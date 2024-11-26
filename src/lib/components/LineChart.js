import moment from "moment";
import React, { useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import { Chart, Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import rgbFromSeed from "@lib/scripts/rgbFromSeed";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

/**
 * Uses react-chartjs-2.
 * @param arrayOfModules arrayOfModules: [{_id, hardwareUID, type, state, interval, ...}]
 * @param arrayOfRecords arrayOfRecords: [{parent, data: [{rValue: "", rTimestamp: ""}], offset: -1.21054}]
 * @param callback callback used if the dataId is not in arrayOfRecords. pass the missing id and it will fetch to arrayOfRecords.
 */
const LineChart = ({
  arrayOfModules,
  arrayOfRecords,
  callback,
  Title,
  Subtitle,
  min,
  max,
  alignTicks = true,
  legend = true,
  showX = true,
  showY = true,
}) => {
  const [ChartData, setChartData] = React.useState(null);
  //const [newChartData, setNewChartData] = useChartData_FromModuleArray(arrayOfModules)

  // useEffect(() => {
  //   console.log(arrayOfModules);
  //   console.log(arrayOfRecords);
  //   console.log(callback);
  // }, []);

  // Callback to get records
  React.useEffect(() => {
    console.log("Callback to get records");
    if (!arrayOfModules || arrayOfModules.length == 0) return;
    if (ChartData?.length === arrayOfModules.length) return; // Don't continue if we have the data we need

    // true = update
    const fetchThis = arrayOfModules.filter((module) => {
      return arrayOfRecords.length === 0 || arrayOfRecords.every((record) => module._id !== record._id);
    });

    // console.log("Callback: ", fetchThis)
    if (fetchThis && fetchThis.length != 0) {
      callback(fetchThis.map((item) => item._id));
    }
  }, [arrayOfModules]);

  // Convert records to ChartData
  React.useEffect(() => {
    console.log("Convert records to ChartData");
    if (!arrayOfRecords) return;
    // Only use records from current arrayOfModules
    const thisChart = arrayOfRecords.filter((record) => arrayOfModules.some((module) => record._id == module._id));
    if (thisChart && thisChart.length != 0) setChartData(dataToChartData(thisChart));
  }, [arrayOfRecords]);

  /**
   * @param records [{_id: "", data: [{rValue: "", rTimestamp: ""}] }]
   */
  function dataToChartData(records) {
    let series = [];
    // Get Module. catch ID
    records.forEach((record, index) => {
      let single = {
        label: `Module ${index + 1}`,
        index: index,
        tension: 0.1, // Performance Issues?
        id: record._id,

        borderColor: rgbFromSeed(record._id),
        // backgroundColor: rgbFromSeed(record._id),
        data: record.data.map((item) => ({
          x: new Date(item.rTimestamp).getTime(),
          y: parseFloat(item.rValue),
        })),
      };
      series.push(single);
    });
    console.log(series);
    return series;
  }

  var data = { datasets: ChartData };
  var PresetOptions = {
    maintainAspectRatio: false,
    datasets: { line: { pointRadius: 0 } },
    elements: { point: { radius: 0 } },
    interaction: {
      intersect: false,
      mode: "nearest",
    },
    scales: {
      y: {
        display: showY ? true : false,
        ticks: { beginAtZero: false },
        grid: {
          borderColor: "red",
          tickColor: "red",
        },
      },
      x: {
        type: "time",
        display: showX ? true : false,
        ticks: { source: alignTicks ? "data" : null },
        grid: {
          color: "#333333",
          borderColor: "red",
          tickColor: "red",
        },
        // min: min, //moment().subtract(12, 'h')
        // min: new Date(new Date().getTime() - 12 * 60 * 60 * 1000),
        min: min,
        max: max,
      },
    },
    plugins: {
      legend: { display: legend ? true : false },
      // colors: { forceOverride: true }, // For Colors Plugin
      subtitle: {
        display: Subtitle ? true : false,
        text: Subtitle,
      },
      title: {
        display: Title ? true : false,
        text: Title,
      },
      tooltip: {
        enabled: true,
        mode: "nearest", // nearest index // Displays tooltips for all points at the same index
        position: "nearest", // average nearest
        yAlign: "top",
        // xAlign: "center",
        intersect: false, // Allows tooltips to be displayed for all points at the same x-value
        // position: (tooltipModel, eventPosition) => {
        //   // Ensure tooltip always appears above the point
        //   const x = eventPosition.x || 0;
        //   const y = eventPosition.y || 0;
        //   return {
        //     x: x,
        //     y: y - 10, // Adjust this value as needed to position the tooltip outside the chart
        //   };
        // },
        callbacks: {
          label: (tooltipItem) => {
            return `No̱${tooltipItem.dataset.index + 1} Value: ${tooltipItem.formattedValue} ${getValueFormat()}`;
            // return [`No̱ ${tooltipItem.dataset.index + 1}`, `Value: ${tooltipItem.formattedValue} ${getValueFormat()}`];
          },
          // footer: function(tooltipItems, data) {
          //   return ['new line', 'another line'];
          // }
        },
      },
    },
    layout: {
      autoPadding: true,
    },
    borderWidth: 1,
    animation: {
      duration: 0,
    },
  };

  function getValueFormat() {
    if (!arrayOfModules && arrayOfModules.length == 0) return;
    switch (arrayOfModules[0].mType) {
      case "Temperature":
        return "°C";
      case "Weight":
        return "g";
      default:
        return "";
    }
  }

  return (
    <>
      {!ChartData ? (
        "Loading Chart..."
      ) : (
        <>
          <Chart type="line" data={data} options={PresetOptions} />
        </>
      )}
    </>
  );
};

export default LineChart;

// for (var index = 0; index < record.data.length; index++)
//   single.data.push({
//     x: new Date(record.data[index].rTimestamp).getTime(),
//     y: parseFloat(record.data[index].rValue),
//   });
