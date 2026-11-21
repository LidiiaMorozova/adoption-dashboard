import {Module} from '@nestjs/common';
import {clockProvider} from '../clock';
import {CovidController} from './covid.controller';
import {CovidService} from './covid.service';

@Module({
  controllers: [CovidController],
  providers: [CovidService, clockProvider],
})
export class CovidModule {}
