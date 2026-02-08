'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Counter() {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Načíst počáteční hodnotu při načtení komponenty
  useEffect(() => {
    fetchCounter()
  }, [])

  const fetchCounter = async () => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/api/counter`)
      if (!response.ok) throw new Error('Chyba při načítání')
      const data = await response.json()
      setCount(data.value)
    } catch (err) {
      setError('Nelze načíst počítadlo')
      console.error(err)
    }
  }

  const handleIncrement = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/api/counter/increment`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Chyba při zvyšování')
      const data = await response.json()
      setCount(data.value)
    } catch (err) {
      setError('Nelze zvýšit počítadlo')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDecrement = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/api/counter/decrement`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Chyba při snižování')
      const data = await response.json()
      setCount(data.value)
    } catch (err) {
      setError('Nelze snížit počítadlo')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Počítadlo
      </h1>
      
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 mb-8">
        <div className="text-7xl md:text-8xl font-bold text-center text-white">
          {count}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleDecrement}
          disabled={loading}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
        >
          −
        </button>
        
        <button
          onClick={handleIncrement}
          disabled={loading}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
        >
          +
        </button>
      </div>

      <button
        onClick={fetchCounter}
        disabled={loading}
        className="w-full mt-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
      >
        {loading ? 'Načítání...' : 'Obnovit'}
      </button>
    </div>
  )
}
