import {Module} from '@nestjs/common';
import {clockProvider} from '../clock';
import {AppointmentsController} from './appointments.controller';
import {AppointmentsService, CLINIC_TIME_ZONE} from './appointments.service';
import {DEFAULT_CLINIC_TIME_ZONE} from './schedule';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    clockProvider,
    {provide: CLINIC_TIME_ZONE, useValue: process.env.CLINIC_TIME_ZONE ?? DEFAULT_CLINIC_TIME_ZONE},
  ],
})
export class AppointmentsModule {}
