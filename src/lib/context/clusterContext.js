"use client";
// import { useList, useQueue } from "@uidotdev/usehooks";
import { useList, useQueue } from "react-use";
import { randomUUID } from "crypto";
// ClusterContext.js
import { createContext, useContext, useEffect, useState } from "react";
// import { getCluster } from "@lib/mongodb/cluster";

// Import your db related functions here.

// Create a context
const ClusterContext = createContext();

// Custom hook to access the context
export function useCluster() {
  return useContext(ClusterContext);
}

// ClusterContext Provider component
export function ClusterProvider({ children }) {
  // State to store cluster data
  const [cluster, setCluster] = useState([]);
  // const [records, setRecords] = useState([]);
  const { add, remove, first, last, size } = useQueue();
  const [records, { set, push, updateAt, insertAt, update, updateFirst, upsert, sort, filter, removeAt, clear, reset }] = useList();

  // Fetch cluster data from the database (You'll need to implement this)

  // Fetch cluster data when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/cluster`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // console.log(data);
        setCluster(data); // Set the data in your state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Define functions to manipulate cluster data if needed
  // For example, you can add functions to update, delete, or add clusters.

  useEffect(() => {
    if (!first) return;
    if (exists(first)) {
      remove();
      return;
    }
    const QueueItem = first;

    fetchRecord(QueueItem).then((data) => {
      const arrayWithoutId = data.map((obj) => {
        const { _id, rParent, ...rest } = obj; // remove both the _id and rParent fields
        return rest;
      });
      const sortedData = sortData(arrayWithoutId);
      // Update & Insert into records list
      upsert((item) => item._id === QueueItem, { _id: QueueItem, data: sortedData });
      remove();
    });
  }, [first]);

  // It would be better to get a list as params so we get all records at once
  const getRecord = (targets) => {
    // console.log("getRecord: ", targets);

    targets.forEach(async (target) => {
      if (!exists(target)) {
        add(target);
      }
    });
  };

  async function fetchRecord(targetHardwareUID) {
    try {
      const response = await fetch(`/api/record/${targetHardwareUID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function exists(id) {
    // console.log(id)
    // console.log(records)
    // return ids.some((item) => records.some((record) => item == record._id));
    let exist = records.some((record) => id == record._id);
    // console.log("exists", id, exist);
    return exist;
  }

  // Provide the cluster data and functions to child components
  const contextValue = {
    cluster,
    records,
    getRecord,
    setCluster,
    // Add more functions as needed
  };

  return <ClusterContext.Provider value={contextValue}>{children}</ClusterContext.Provider>;
}

function sortData(data) {
  data.sort((a, b) => new Date(a.rTimestamp).getTime() - new Date(b.rTimestamp).getTime());
  return data;
}
