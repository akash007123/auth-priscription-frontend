import React from 'react'
import Button from './Button'

export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-bold">R</div>
          <div>
            <div className="font-semibold">React Starter</div>
            <div className="text-xs text-slate-500">TS + Tailwind + Framer Motion</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => alert('Get started!')}>Get started</Button>
        </div>
      </div>
    </nav>
  )
}
