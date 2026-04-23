import { useCallback, useEffect, useState } from 'react'
import { fetchRestaurants } from '../services/api'

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRestaurants = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const rows = await fetchRestaurants()
      setRestaurants(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load restaurants')
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRestaurants()
  }, [loadRestaurants])

  return {
    restaurants,
    loading,
    error,
    reload: loadRestaurants,
  }
}
