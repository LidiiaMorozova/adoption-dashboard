import {Body, Controller, Get, HttpCode, Post} from '@nestjs/common';
import {CovidService} from './covid.service';
import type {SymptomEntry} from './covid.types';
import {CreateSymptomEntryDto} from './dto';

@Controller('covid/symptom-entries')
export class CovidController {
  constructor(private readonly covid: CovidService) {}

  @Get()
  list(): SymptomEntry[] {
    return this.covid.list();
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateSymptomEntryDto): SymptomEntry {
    return this.covid.create(body);
  }
}
