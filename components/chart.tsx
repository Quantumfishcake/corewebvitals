import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Colors
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

import { PSIScoreType } from '@/types';

ChartJS.register(
  Colors,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

export const options = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Line Chart - Multi Axis',
      color: '#fff',
    },
    legend: {
      labels: {
        fontSize: 18,
        color: "#fff"
      }
    },
  },

  scales: {
    x: {
      grid: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
        zeroLineColor: "transparent",
      },
      ticks: {
        color: "#9a9a9a"
      }
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      ticks: {
        color: "#9a9a9a"
      },
      grid: {
        color: 'rgba(29,140,248,0.0)',
      },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: "#9a9a9a"
      }
    },
  },
};

export const options2 = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,

  plugins: {
    legend: {
      labels: {
        fontSize: 30,
        color: "#fff",
      }
    },
  },
  scales: {
    x: {
      grid: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
        zeroLineColor: "transparent",
      },
      ticks: {
        color: "#9a9a9a"
      }
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      ticks: {
        color: "#9a9a9a"
      },
      grid: {
        color: 'rgba(29,140,248,0.0)',
      },
    },
  },
};

const LUXChart: React.FC<{ psiscores: Array<PSIScoreType> }> = ({
  psiscores,
}) => {

  const getLuxScoresOnly = () : PSIScoreType[] => {
    const luxScores = psiscores?.filter((score: PSIScoreType) => score.score_type === 1);
    // order by date
    if (!luxScores) return [];
    return luxScores?.sort((b, a) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // get the trend line from an array of numbers
  const getTrendLine = (data: number[]) : number[] => {
    const x = data.map((_, i) => i);
    const y = data;
    const xSum = x.reduce((a, b) => a + b);
    const ySum = y.reduce((a, b) => a + b);
    const xSquaredSum = x.map((n) => n * n).reduce((a, b) => a + b);
    const xySum = x.map((n, i) => n * y[i]).reduce((a, b) => a + b);
    const m = (data.length * xySum - xSum * ySum) / (data.length * xSquaredSum - xSum * xSum);
    const b = (ySum - m * xSum) / data.length;
    return x.map((n) => m * n + b);
  };

  const luxScores = getLuxScoresOnly();
  const luxLighthouseScores = luxScores.map((score) => score.lighthouse_score);
  const labels = luxScores.map((score) => score.date);
  const trendingData = getTrendLine(luxScores.map((score) => score.lighthouse_score))
  const luxLCPData = luxScores.map((score) => score.lighthouse_lcp);
  const luxFCPData = luxScores.map((score) => score.lighthouse_fcp);
  const luxCLSData = luxScores.map((score) => score.lighthouse_cls);
  const luxTBTData = luxScores.map((score) => score.lighthouse_tbt);

  const mainScoreData = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Trending',
        data: trendingData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        color: '#fff'
      },
      {
        type: 'bar' as const,
        label: 'Lighthouse Score',
        data: luxLighthouseScores,
        // borderColor: 'rgb(39, 183, 145)',
        backgroundColor: 'rgba(255, 107, 139, 0.75)',
        color: '#fff',
      }
    ],
  };

  const LCP_FCP_data = {
    labels,
    datasets: [
      {
        label: 'LCP ',
        data: luxLCPData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        color: "#fff",
        yAxisID: 'y',
      },
      {
        label: 'FCP',
        data: luxFCPData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        color: '#fff',
        yAxisID: 'y',
      },
      {
        label: 'CLS',
        data: luxCLSData,
        borderColor: 'rgb(52, 196, 52)',
        backgroundColor: 'rgba(52, 196, 52, 0.5)',
        yAxisID: 'y1',
        color: '#fff',
      },
      {
        label: 'TBT',
        data: luxTBTData,
        borderColor: 'rgb(191, 196, 52)',
        backgroundColor: 'rgba(177, 196, 52, 0.5)',
        yAxisID: 'y',
        color: '#fff',
      }
    ],
  };

  return (
    < div className='bg-slate-800 flex h-80'>
      <div className="flex-1">
        <Chart type='bar' data={mainScoreData} options={options2} />
      </div>
      <div className="flex-1">
        <Line options={options} data={LCP_FCP_data} />
      </div>
    </div>
  );
};

export default LUXChart
