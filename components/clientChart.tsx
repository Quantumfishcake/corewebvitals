import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Scores, Score } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart({ scores }:Scores) {

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Chart",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "right",
        max:100,
        min:0,
      },
    },
  };

  const labels = scores.filter(score => score.score_type === 1).map(x => x.date);



  const luxData = {
      label: `lux`,
      data: scores.filter(score => score.score_type === 1).map(x => x.score),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y",
    };

    const clientData = {
        label: `client`,
        data: scores.filter(score => score.score_type === 2).map(x => x.score),
        borderColor: "rgb(0, 128, 0)",
        backgroundColor: "rgba(0, 128, 0, 0.5)",
        yAxisID: "y",
      };

  const data = {
    labels,
    datasets: [luxData, clientData],
  };

  return <Line options={options} data={data} />;
}
