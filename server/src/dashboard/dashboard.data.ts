import type {DashboardData} from './dashboard.types';

const TREND_UP = {color: '#0B8A00', backgroundColor: 'rgba(11, 138, 0, 0.1)'};
const TREND_DOWN = {color: '#C71026', backgroundColor: 'rgba(199, 16, 38, 0.1)'};
const TREND_FLAT = {color: '#00BFA5', backgroundColor: 'rgba(0, 191, 165, 0.1)'};
const NEUTRAL = {color: '#7E858E', backgroundColor: 'rgba(126, 133, 142, 0.2)'};

/** Sample adoption figures served until a real analytics source is connected. */
export const dashboardData: DashboardData = {
  smallCards: [
    {
      title: 'Patient Logins',
      value: 856,
      trend: 'up',
      caption: '10.0% this month',
      ...TREND_UP,
      icon: 'user',
      points: [2, 10, 0, 14, 22, 0, 25, 18, 10, 22, 29],
    },
    {
      title: 'Diary Questions',
      value: 42,
      trend: 'down',
      caption: '7.0% this month',
      ...TREND_DOWN,
      icon: 'question-mark-circle',
      points: [35, 19, 12, 21, 14, 33, 16, 32, 14, 22, 0],
    },
    {
      title: 'Teleconsultations',
      value: 13,
      trend: 'up',
      caption: '3.2% this month',
      ...TREND_UP,
      icon: 'chat-bubble-left',
      points: [2, 5, 0, 14, 20, 10, 20, 18, 10, 22, 29],
    },
    {
      title: 'Care questions',
      value: 13,
      trend: 'down',
      caption: '2.4% this month',
      ...TREND_DOWN,
      icon: 'lifebuoy',
      points: [35, 21, 12, 21, 10, 30, 10, 22, 14, 22, 0],
    },
    {
      title: 'Messages',
      value: 2123,
      trend: 'flat',
      caption: '5.0% this month',
      ...TREND_FLAT,
      icon: 'envelope',
      points: [0, 8, 15, 6, 11, 8, 15, 6, 12, 10, 20],
    },
  ],
  middleCards: [
    {
      title: 'Measurements',
      value: 1856,
      trend: 'down',
      caption: '4.1% this month',
      ...TREND_DOWN,
      icon: 'lifebuoy',
      points: [
        {label: 'Telemonitoring', value: 62, color: '#7F8AED'},
        {label: 'Kiosk', value: 25, color: '#52D8EA'},
        {label: 'Manual measurement', value: 23, color: '#5AA7DF'},
      ],
    },
    {
      title: 'Questionnaires Sent',
      value: 121,
      trend: 'flat',
      caption: 'Completion rate 2.0%',
      ...TREND_FLAT,
      icon: 'envelope',
      points: [
        {label: 'Kiosk answered', value: 58, color: '#DB85F9'},
        {label: 'Patient app answered', value: 22, color: '#5ADF9F'},
        {label: 'Not answered', value: 41, color: '#E5E5E5'},
      ],
    },
    {
      title: 'Education sent',
      value: 121,
      trend: 'flat',
      caption: 'Opened rate 24.0%',
      ...TREND_FLAT,
      icon: 'envelope',
      points: [
        {label: 'Sent', value: 58, color: '#85E4F9'},
        {label: 'Opened', value: 22, color: '#F8E649'},
        {label: 'Confirmed', value: 41, color: '#72DCC3'},
      ],
    },
  ],
  largeCards: [
    {
      title: 'Care path',
      value: '121/72',
      trend: 'flat',
      caption: 'Active/Activated care paths',
      ...NEUTRAL,
      icon: 'lifebuoy',
      mostUsedValues: [
        {label: 'Pre-op', value: 0, icon: 'document'},
        {label: 'Covid', value: 0, icon: 'exclamation-triangle'},
        {label: 'Cardiology', value: 0, icon: 'heart'},
      ],
      lowestUsedValues: [
        {label: 'Pre-op', value: 0, icon: 'document'},
        {label: 'Covid', value: 0, icon: 'exclamation-triangle'},
        {label: 'Cardiology', value: 0, icon: 'heart'},
      ],
    },
    {
      title: 'Services',
      value: '24',
      trend: 'flat',
      caption: 'Total active services',
      ...NEUTRAL,
      icon: 'clipboard-document-check',
      mostUsedValues: [
        {label: 'Medclinic shop', value: 24, icon: 'shopping-bag'},
        {label: 'Book an appointment', value: 20, icon: 'calendar'},
        {label: 'Check your symptoms', value: 16, icon: 'clipboard-document-check'},
      ],
      lowestUsedValues: [
        {label: 'My prescriptions', value: 8, icon: 'document-text'},
        {label: 'My medical records', value: 4, icon: 'document'},
        {label: 'Travelling to the hospital', value: 2, icon: 'truck'},
      ],
    },
  ],
};
