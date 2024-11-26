"use client";
import { PrintObject } from "@components/temp/printObject";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();

  return (
    <>
      <button onClick={() => signIn("google", { callbackUrl: "/user/login" })}>Sign in with Google</button>
      <Link href={"/api/auth/signout"}>Sign out</Link>
      <p>{status}</p>
      {status == "unauthenticated" ? (
        "Unauthenticated"
      ) : status == "loading" ? (
        "Loading"
      ) : status == "authenticated" ? (
        <span>
          {session.user.id}
          <p>Signed in as {session.user && session.user.name}</p>
          <Image src={session.user.image} width={100} height={100}></Image>
          <PrintObject obj={session} />
        </span>
      ) : (
        "Error: " + { status }
      )}
    </>
  );
}
