import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SentimentDashboard = ({ professorName }) => {
  const [sentimentData, setSentimentData] = useState(null);

  useEffect(() => {
    const fetchSentimentData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sentiment-trends/${professorName}`
      );
      const data = await response.json();
      setSentimentData(data.trends);
    };

    if (professorName) {
      fetchSentimentData();
    }
  }, [professorName]);

  if (!sentimentData) {
    return <div>Loading sentiment data...</div>;
  }

  const chartData = {
    labels: sentimentData.map((entry) => entry.date),
    datasets: [
      {
        label: "Sentiment Score",
        data: sentimentData.map((entry) => entry.sentiment_score),
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Rating",
        data: sentimentData.map((entry) => entry.rating),
        borderColor: "rgba(255, 99, 132)",
        borderWidth: 2,
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Sentiment Trends for ${professorName}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  return (
    <div className="sentiment-dashboard">
      <h2>Sentiment Analysis Dashboard</h2>
      <Line data={chartData} options={options} />
      <div className="sentiment-summary">
        <h3>Summary</h3>
        <p>Average Sentiment: {calculateAverage(sentimentData, 'sentimentScore').toFixed(2)}</p>
        <p>Average Rating: {calculateAverage(sentimentData, 'rating').toFixed(2)}</p>
        <p>Total Reviews: {sentimentData.length}</p>
      </div>
    </div>
  );
};

const calculateAverage = (data, key) => {
  return data.reduce((sum, item) => sum + item[key], 0) / data.length;
};

export default SentimentDashboard;
