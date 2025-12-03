"use client"
import clsx from "clsx"
import { useState } from "react"

export default function FancyButton() {
const [buttonColor, setButtonColor] = useState(false)


function handleClick() {
  setButtonColor(!buttonColor)
}
  return (
    <div className="py-10 px-5 w-1/2 mx-auto">
    <button className={clsx('border-2 border-fuchsia-400 px-6 py-3 rounded-full', buttonColor && 'bg-fuchsia-300 text-white'
    )}
    onClick={handleClick}
    >
H.A.M. Let them Know
    </button>
    </div>
  )
}
