import { useState } from 'react'
import { searchRestaurants } from '../services/api'

export function useRestaurantSearch() {
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const runSearch = async (query) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      setHasSearched(false)
      setError('')
      setResults([])
      return
    }

    setSearching(true)
    setError('')

    try {
      const rows = await searchRestaurants(trimmedQuery)
      setResults(rows)
      setHasSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
      setHasSearched(false)
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setResults([])
    setHasSearched(false)
    setError('')
  }

  return {
    results,
    searching,
    error,
    hasSearched,
    runSearch,
    clearSearch,
  }
}
