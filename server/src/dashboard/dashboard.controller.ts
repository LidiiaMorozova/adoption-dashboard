import {Controller, Get} from '@nestjs/common';
import {dashboardData} from './dashboard.data';
import type {DashboardData} from './dashboard.types';

@Controller('dashboard')
export class DashboardController {
  @Get()
  getDashboard(): DashboardData {
    return dashboardData;
  }
}
