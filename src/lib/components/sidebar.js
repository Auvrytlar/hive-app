"use client";
import styles from "@/app/utils.module.css";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
// import { useSession } from "next-auth/react";

export function Sidebar({ links }) {
  const activeSegment = useSelectedLayoutSegment();
  // const { data: session, status } = useSession();

  return (
    <>
      <div className={styles.sidebar} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <nav>
          {links.map((l, i) => {
            return (
              <Link
                key={i}
                href={l.path}
                className={activeSegment === l.targetSegment ? styles.activeSegment : styles.inactiveSegment}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        {/* {status === "authenticated" && session.user ? (
          <div>
            <p style={{ margin: 0 }}>Signed in as:</p>
            <p style={{ margin: 0 }}>{session.user.name}</p>
          </div>
        ) : (
          "Signed Out"
        )} */}
      </div>
    </>
  );
}
