import {Transform} from 'class-transformer';
import {IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, Validate} from 'class-validator';
import {ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {isIsoDate} from './calendar';

const trim = ({value}: {value: unknown}) => (typeof value === 'string' ? value.trim() : value);

@ValidatorConstraint({name: 'isoDate'})
class IsoDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isIsoDate(value);
  }

  defaultMessage(): string {
    return 'date must be a valid date in YYYY-MM-DD format';
  }
}

export class ListSlotsQuery {
  @IsString()
  @Validate(IsoDateConstraint)
  date: string;
}

export class CreateBookingDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {message: 'slotId must look like YYYY-MM-DDTHH:mm'})
  slotId: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty({message: 'patientName is required'})
  @Length(2, 100)
  patientName: string;

  @Transform(trim)
  @IsEmail({}, {message: 'email must be a valid email address'})
  @MaxLength(254)
  email: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
