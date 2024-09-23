import {
    UserIcon,
    QuestionMarkCircleIcon,
    ChatBubbleLeftIcon,
    LifebuoyIcon,
    EnvelopeIcon,
    DocumentIcon,
    ExclamationTriangleIcon,
    HeartIcon,
    ShoppingBagIcon,
    CalendarIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    TruckIcon
} from '@heroicons/vue/24/outline';

export const cards = [
    {
        title: 'Patient Logins',
        value: 856,
        trend: 'up',
        percentage: '10.0%',
        color: '#0B8A00',
        backgroundColor: 'rgba(11, 138, 0, 0.1)',
        icon: UserIcon,
        points: [
            {x: 0, y: 28},
            {x: 10, y: 20},
            {x: 20, y: 30},
            {x: 30, y: 16},
            {x: 40, y: 8},
            {x: 50, y: 30},
            {x: 60, y: 5},
            {x: 70, y: 12},
            {x: 80, y: 20},
            {x: 90, y: 8},
            {x: 100, y: 1}
        ],
        size: 'small',
    },
    {
        title: 'Dairy Questions',
        value: 42,
        trend: 'down',
        percentage: '7.0%',
        color: '#C71026',
        backgroundColor: 'rgba(199, 16, 38, 0.1)',
        icon: QuestionMarkCircleIcon,
        points: [
            {x: 0, y: 5},
            {x: 10, y: 21},
            {x: 20, y: 28},
            {x: 30, y: 19},
            {x: 40, y: 26},
            {x: 50, y: 7},
            {x: 60, y: 24},
            {x: 70, y: 8},
            {x: 80, y: 26},
            {x: 90, y: 18},
            {x: 100, y: 40}
        ],
        size: 'small',
    },
    {
        title: 'Teleconsultations',
        value: 13,
        trend: 'up',
        percentage: '3.2%',
        color: '#0B8A00',
        backgroundColor: 'rgba(11, 138, 0, 0.1)',
        icon: ChatBubbleLeftIcon,
        points: [
            {x: 0, y: 28},
            {x: 10, y: 25},
            {x: 20, y: 30},
            {x: 30, y: 16},
            {x: 40, y: 10},
            {x: 50, y: 20},
            {x: 60, y: 10},
            {x: 70, y: 12},
            {x: 80, y: 20},
            {x: 90, y: 8},
            {x: 100, y: 1}
        ],
        size: 'small',
    },
    {
        title: 'Care questions',
        value: 13,
        trend: 'down',
        percentage: '2.4%',
        color: '#C71026',
        backgroundColor: 'rgba(199, 16, 38, 0.1)',
        icon: LifebuoyIcon,
        points: [
            {x: 0, y: 5},
            {x: 10, y: 19},
            {x: 20, y: 28},
            {x: 30, y: 19},
            {x: 40, y: 30},
            {x: 50, y: 10},
            {x: 60, y: 30},
            {x: 70, y: 18},
            {x: 80, y: 26},
            {x: 90, y: 18},
            {x: 100, y: 40}
        ],
        size: 'small',
    },
    {
        title: 'Messages',
        value: 2123,
        trend: 'flat',
        percentage: '5.0%',
        color: '#00BFA5',
        backgroundColor: 'rgba(0, 191, 165, 0.1)',
        icon: EnvelopeIcon,
        points: [
            {x: 0, y: 30},
            {x: 10, y: 22},
            {x: 20, y: 15},
            {x: 30, y: 24},
            {x: 40, y: 19},
            {x: 50, y: 22},
            {x: 60, y: 15},
            {x: 70, y: 24},
            {x: 80, y: 18},
            {x: 90, y: 20},
            {x: 100, y: 10}
        ],
        size: 'small',
    }
];

export const middleCardsData = [
    {
        title: 'Measurements',
        value: 1856,
        trend: 'down',
        percentage: '4.1% this month',
        color: '#C71026',
        backgroundColor: 'rgba(199, 16, 38, 0.1)',
        icon: LifebuoyIcon,
        points: [
            {label: 'Telemonitoring', value: 62, color: '#7F8AED'},
            {label: 'Kiosk', value: 25, color: '#52D8EA'},
            {label: 'Manual measurement', value: 23, color: '#5AA7DF'}
        ],
        size: 'small',
    },
    {
        title: 'Questionnaries Sent',
        value: 121,
        trend: 'flat',
        percentage: 'completion rate 2.0%',
        color: '#00BFA5',
        backgroundColor: 'rgba(0, 191, 165, 0.1)',
        icon: EnvelopeIcon,
        points: [
            {label: 'Kiosk answered', value: 58, color: '#DB85F9'},
            {label: 'Patient app answered', value: 22, color: '#5ADF9F'},
            {label: 'Not answered', value: 41, color: '#E5E5E5'}
        ],
        size: 'small',
    },
    {
        title: 'Education sent',
        value: 121,
        trend: 'flat',
        percentage: 'Opened rate 24.0%',
        color: '#00BFA5',
        backgroundColor: 'rgba(0, 191, 165, 0.1)',
        icon: EnvelopeIcon,
        points: [
            {label: 'Send', value: 58, color: '#85E4F9'},
            {label: 'Opened', value: 22, color: '#F8E649'},
            {label: 'Confirmed', value: 41, color: '#72DCC3'}
        ],
        size: 'small',
    }
];


export const largeCardsData = [
    {
        title: 'Care path',
        value: '121/72',
        trend: 'flat',
        percentage: 'Active/Activated care paths',
        color: '#7E858E',
        backgroundColor: 'rgba(126, 133, 142, 0.2)',
        icon: LifebuoyIcon,
        lowestUsedValues: [
            {label: 'Pre-op', value: 0, icon: DocumentIcon, backgroundColor: '#F3F3F3'},
            {label: 'Covid', value: 0, color: ExclamationTriangleIcon, backgroundColor: '#F3F3F3'},
            {label: 'Cardiology', value: 0, color: HeartIcon, backgroundColor: '#F3F3F3'}
        ],
        mostUsedValues: [
            {label: 'Pre-op', value: 0, icon: DocumentIcon, backgroundColor: '#F3F3F3'},
            {label: 'Covid', value: 0, color: ExclamationTriangleIcon, backgroundColor: '#F3F3F3'},
            {label: 'Cardiology', value: 0, color: HeartIcon, backgroundColor: '#F3F3F3'}
        ],
    },
    {
        title: 'Services',
        value: '24',
        trend: 'flat',
        percentage: 'Total active services',
        color: '#7E858E',
        backgroundColor: 'rgba(126, 133, 142, 0.2)',
        icon: ClipboardDocumentCheckIcon,
        lowestUsedValues: [
            {label: 'My prescriptions', value: 8, icon: DocumentTextIcon, backgroundColor: '#F3F3F3'},
            {label: 'My medical records', value: 4, color: DocumentIcon, backgroundColor: '#F3F3F3'},
            {label: 'Travelling to the hospital', value: 2, color: TruckIcon, backgroundColor: '#F3F3F3'}
        ],
        mostUsedValues: [
            {label: 'Medlicnic shop', value: 24, icon: ShoppingBagIcon, backgroundColor: '#F3F3F3'},
            {label: 'Book an appointment', value: 20, color: CalendarIcon, backgroundColor: '#F3F3F3'},
            {label: 'Check your symptoms', value: 16, color: ClipboardDocumentCheckIcon, backgroundColor: '#F3F3F3'}
        ],
    }
];
