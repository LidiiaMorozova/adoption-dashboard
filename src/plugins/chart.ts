import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.color = '#5F6670';

export {Chart};
