import { getCluster, getNode } from "@lib/mongodb/cluster";
// import { getToken } from "next-auth/jwt";
// import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function GET(req) {
  // const sessio2n = await getSession();
  // const sessio3n = await getSession({ req });
  // const session1 = await getSession({ req, secret: process.env.NEXTAUTH_SECRET });
  // const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  try {
    let data = await getCluster();
    // console.log(data)
    // console.log(request.query)
    // console.log(params)
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed" });
  }
}
