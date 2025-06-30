import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  Legend
);

const Graph = ({ graphData }) => {
  const safeGraphData = graphData || [];

  if (safeGraphData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Analytics Data Available
          </h3>
          <p className="text-sm text-gray-500">
            Start creating and sharing your links to see click analytics
          </p>
        </div>
      </div>
    );
  }

  const allZeroClicks = safeGraphData.every((item) => item.count === 0);
  if (allZeroClicks) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Click Activity in Selected Date Range
          </h3>
          <p className="text-sm text-gray-500">
            Try selecting a different date range or share your links to see click data
          </p>
        </div>
      </div>
    );
  }

  const labels = safeGraphData.map((item) => item.clickDate);
  const clicksPerDay = safeGraphData.map((item) => item.count);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Clicks",
        data: clicksPerDay,
        backgroundColor: "#3b82f6",
        borderColor: "#1D2327",
        barThickness: 20,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { font: { size: 12, weight: "bold" } },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        type: 'category', // Force category labels (dates)
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          maxTicksLimit: 10,
          callback: function (value, index, ticks) {
            const dataLength = safeGraphData.length;
            if (dataLength <= 7) {
              return labels[index];
            } else if (dataLength <= 14) {
              return index % 2 === 0 ? labels[index] : "";
            } else {
              return index % Math.ceil(dataLength / 10) === 0 ? labels[index] : "";
            }
          },
        },
        title: {
          display: true,
          text: "Date",
          font: { family: "Arial", size: 14, weight: "bold", color: "#374151" },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.1)", drawBorder: false },
        ticks: {
          callback: function (value) {
            return Number.isInteger(value) ? value.toString() : "";
          },
          font: { size: 11 },
        },
        title: {
          display: true,
          text: "Number of Clicks",
          font: { family: "Arial", size: 14, weight: "bold", color: "#374151" },
        },
      },
    },
  };

  return <Bar className="w-full" data={data} options={options} />;
};

export default Graph;
