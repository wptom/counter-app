'use client'

import { useState, useEffect } from 'react'
import Counter from '@/components/Counter'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Counter />
      </div>
    </main>
  )
}
