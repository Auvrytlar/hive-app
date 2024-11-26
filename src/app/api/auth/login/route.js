// import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { email, password } = req.body;
    // await signIn("credentials", { email, password });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.type === "CredentialsSignin") {
      res.status(401).json({ error: "Invalid credentials." });
    } else {
      res.status(500).json({ error: "Something went wrong." });
    }
  }
}
