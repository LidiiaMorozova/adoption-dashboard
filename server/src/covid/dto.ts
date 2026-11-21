import {Transform} from 'class-transformer';
import {IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min} from 'class-validator';
import type {Rating} from './covid.types';

export const MIN_TEMPERATURE = 34;
export const MAX_TEMPERATURE = 43;

const trim = ({value}: {value: unknown}) => (typeof value === 'string' ? value.trim() : value);

export class CreateSymptomEntryDto {
  @IsNumber({maxDecimalPlaces: 1}, {message: 'temperature must be a number with at most one decimal'})
  @Min(MIN_TEMPERATURE)
  @Max(MAX_TEMPERATURE)
  temperature: number;

  @IsInt()
  @Min(1)
  @Max(5)
  wellbeing: Rating;

  @IsInt()
  @Min(1)
  @Max(5)
  appetite: Rating;

  @IsInt()
  @Min(1)
  @Max(5)
  sleep: Rating;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
