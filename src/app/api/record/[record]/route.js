import { getCluster, getNode, getRecord } from "@lib/mongodb/cluster";
// import { getToken } from "next-auth/jwt";
// import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { url } = req;
  const recordId = url.split("/").pop();

  // console.log(recordId);

  try {
    // Assuming getRecord takes the targetHardwareUID as an argument:
    const data = await getRecord(recordId);

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed" });
  }
}
