// src/hooks/useApi.js
// Drop-in hook: const { data, loading, error, refetch } = useApi(fn, deps)

import { useState, useEffect, useCallback, useRef } from 'react'

export function useApi(apiFn, deps = [], opts = {}) {
  const { immediate = true, initialData = null } = opts
  const [data,    setData]    = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetch = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn(...args)
      if (mountedRef.current) {
        setData(res?.data ?? res)
        setLoading(false)
      }
      return res
    } catch (err) {
      if (mountedRef.current) {
        setError(err?.message || 'Something went wrong')
        setLoading(false)
      }
      throw err
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) fetch()
  }, [fetch]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: fetch }
}

// Mutation hook — for POST/PUT/DELETE actions
export function useMutation(apiFn) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const mutate = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn(...args)
      setLoading(false)
      return res
    } catch (err) {
      setError(err?.message || 'Something went wrong')
      setLoading(false)
      throw err
    }
  }, [apiFn])

  return { mutate, loading, error }
}
