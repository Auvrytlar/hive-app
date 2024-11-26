import moment from "moment";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Chart, Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export default function MqttChart({ message }) {
  const [data, setData] = useState({ label: [] });

  useEffect(() => {
    if (message) {
      let m;
      if (typeof message === "object") {
        if (!("timestamp" in message && "value" in message)) {
          console.log("missing");
          return;
        }
        m = message;
      }
      // setData((prevData) => [...prevData, { label: m.timestamp, data: m.value }]);
      else m = JSON.parse(message);
      setData((prevData) => ({
        ...prevData,
        label: [...(prevData.label || []), new Date(m.timestamp * 1000)],
        data: [...(prevData.data || []), parseFloat(m.value)],
      }));
    }
  }, [message]);

  const chartData = {
    labels: data.label, // Convert UNIX timestamp to JavaScript Date object
    datasets: [
      {
        label: "Sensor",
        data: data.data, // Convert string to float
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };
  var PresetOptions = {
    scales: {
      y: {
        display: true,
        ticks: { beginAtZero: false },
        grid: {
          borderColor: "red",
          tickColor: "red",
        },
      },
      x: {
        type: "time",
        display: true,
        ticks: { source: "data" },
        grid: {
          color: "#333333",
          borderColor: "red",
          tickColor: "red",
        },
        // min: new Date(new Date().getTime() - 20 * 1000),
      },
    },
    animation: {
      duration: 0,
    },
    responsive: true,
  };

  return (
    <>
      {!data.label.length ? (
        "Loading Chart..."
      ) : (
        <>
          <div className="chart-container-standard" style={{ width: "70%" }}>
            <Chart type="line" data={chartData} options={PresetOptions} />
          </div>
        </>
      )}
    </>
  );
}

// for (var index = 0; index < record.data.length; index++)
//   single.data.push({
//     x: new Date(record.data[index].rTimestamp).getTime(),
//     y: parseFloat(record.data[index].rValue),
//   });
