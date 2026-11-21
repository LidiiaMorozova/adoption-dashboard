import {Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Query} from '@nestjs/common';
import {AppointmentsService} from './appointments.service';
import {Booking, DaySummary, Slot} from './appointments.types';
import {CreateBookingDto, ListSlotsQuery} from './dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}

  @Get('days')
  listDays(): DaySummary[] {
    return this.appointments.listDays();
  }

  @Get('slots')
  listSlots(@Query() query: ListSlotsQuery): Slot[] {
    return this.appointments.listSlots(query.date);
  }

  @Post('bookings')
  @HttpCode(201)
  createBooking(@Body() body: CreateBookingDto): Booking {
    return this.appointments.book({
      slotId: body.slotId,
      patientName: body.patientName,
      email: body.email,
      reason: body.reason || undefined,
    });
  }

  @Get('bookings/:id')
  getBooking(@Param('id', new ParseUUIDPipe()) id: string): Booking {
    return this.appointments.getBooking(id);
  }
}
