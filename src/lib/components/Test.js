"use client"

import { useEffect } from "react"

export function Test (value)  {
  "use client"
  
  useEffect(() =>{
    console.log(value)
  }, [value])

  return (
    <>
      {/* {value.map((t, i) => (
        <p key={i}>{t}</p>
      ))} */}
    </>
  )
}