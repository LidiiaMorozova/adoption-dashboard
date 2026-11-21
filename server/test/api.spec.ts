import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import {AppModule} from '../src/app.module';
import {CLOCK} from '../src/clock';
import {configureApp} from '../src/configure-app';

const NOW = new Date('2026-03-02T09:00:00Z');

describe('REST API', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({imports: [AppModule]})
      .overrideProvider(CLOCK)
      .useValue(() => NOW)
      .compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  it('GET /api/dashboard returns the three card groups', async () => {
    const res = await http().get('/api/dashboard').expect(200);

    expect(res.body.smallCards).toHaveLength(5);
    expect(res.body.middleCards).toHaveLength(3);
    expect(res.body.largeCards).toHaveLength(2);
  });

  it('GET /api/appointments/slots validates the date', async () => {
    const res = await http().get('/api/appointments/slots?date=2026-02-31').expect(400);

    expect(res.body.message).toContain('date must be a valid date in YYYY-MM-DD format');
  });

  it('books a slot once and answers 409 for the second attempt', async () => {
    const slots = await http().get('/api/appointments/slots?date=2026-03-03').expect(200);
    const free = slots.body.find((slot: {available: boolean}) => slot.available);

    const created = await http()
      .post('/api/appointments/bookings')
      .send({slotId: free.id, patientName: '  Jane Doe ', email: 'jane@example.com'})
      .expect(201);
    expect(created.body).toMatchObject({slotId: free.id, patientName: 'Jane Doe'});

    const conflict = await http()
      .post('/api/appointments/bookings')
      .send({slotId: free.id, patientName: 'John Doe', email: 'john@example.com'})
      .expect(409);
    expect(conflict.body.code).toBe('SLOT_TAKEN');

    await http().get(`/api/appointments/bookings/${created.body.id}`).expect(200);
  });

  it('stores symptom entries and lists the newest first', async () => {
    await http()
      .post('/api/covid/symptom-entries')
      .send({temperature: 37.2, wellbeing: 4, appetite: 3, sleep: 5})
      .expect(201);
    const second = await http()
      .post('/api/covid/symptom-entries')
      .send({temperature: 38.4, wellbeing: 2, appetite: 2, sleep: 1, notes: '  Headache  '})
      .expect(201);
    expect(second.body).toMatchObject({temperature: 38.4, notes: 'Headache', recordedAt: NOW.toISOString()});

    const list = await http().get('/api/covid/symptom-entries').expect(200);
    expect(list.body.slice(0, 2).map((entry: {temperature: number}) => entry.temperature)).toEqual([38.4, 37.2]);
    expect(list.body[1].notes).toBeNull();
  });

  it('starts with one sample check-in per day for the previous six days', async () => {
    const list = await http().get('/api/covid/symptom-entries').expect(200);

    expect(list.body.map((entry: {recordedAt: string}) => entry.recordedAt.slice(0, 10))).toEqual([
      '2026-03-01', '2026-02-28', '2026-02-27', '2026-02-26', '2026-02-25', '2026-02-24',
    ]);
  });

  it('keeps earlier days in the history when there are many check-ins today', async () => {
    for (let i = 0; i < 25; i++) {
      await http().post('/api/covid/symptom-entries').send({temperature: 37, wellbeing: 3, appetite: 3, sleep: 3}).expect(201);
    }

    const list = await http().get('/api/covid/symptom-entries').expect(200);

    expect(list.body).toHaveLength(31);
    expect(list.body.at(-1).recordedAt.slice(0, 10)).toBe('2026-02-24');
  });

  it('rejects invalid symptom entries', async () => {
    const res = await http()
      .post('/api/covid/symptom-entries')
      .send({temperature: 37.25, wellbeing: 0, appetite: 6, sleep: 2.5})
      .expect(400);

    expect(res.body.message).toEqual(expect.arrayContaining([
      'temperature must be a number with at most one decimal',
      'wellbeing must not be less than 1',
      'appetite must not be greater than 5',
      'sleep must be an integer number',
    ]));
  });

  it('rejects invalid booking payloads', async () => {
    const res = await http()
      .post('/api/appointments/bookings')
      .send({slotId: 'tomorrow', patientName: '', email: 'not-an-email', extra: true})
      .expect(400);

    expect(res.body.message).toEqual(expect.arrayContaining([
      'slotId must look like YYYY-MM-DDTHH:mm',
      'patientName is required',
      'email must be a valid email address',
      'property extra should not exist',
    ]));
  });
});
