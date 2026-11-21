import {Module} from '@nestjs/common';
import {AppointmentsModule} from './appointments/appointments.module';
import {CovidModule} from './covid/covid.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {HealthController} from './health.controller';

@Module({
  imports: [DashboardModule, AppointmentsModule, CovidModule],
  controllers: [HealthController],
})
export class AppModule {}
