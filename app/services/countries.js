const API_URL = 'https://api.restcountries.com/countries/v5'
const PAGE_SIZE = 100
const REQUEST_TIMEOUT_MS = 10000
// REST Countries terms allow caching responses for up to 3 days.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

let cache = null
let inFlight = null

const fetchPage = async (apiKey, offset) => {
  const params = new URLSearchParams({
    response_fields: 'names.common,codes.alpha_2,calling_codes',
    limit: PAGE_SIZE,
    offset
  })

  const res = await fetch(`${API_URL}?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  })

  if (!res.ok) throw new Error(`REST Countries responded with ${res.status}`)

  const { data } = await res.json()
  return data
}

const fetchAllCountries = async () => {
  const apiKey = process.env.REST_COUNTRIES_API_KEY
  if (!apiKey) throw new Error('REST_COUNTRIES_API_KEY is not set')

  const countries = []
  let more = true

  while (more) {
    const { objects, meta } = await fetchPage(apiKey, countries.length)
    countries.push(...objects)
    more = meta.more && objects.length > 0
  }

  return countries.map(country => ({
    name: country.names.common,
    code: country.codes.alpha_2,
    callingCodes: (country.calling_codes ?? []).map(code => `+${code}`)
  }))
}

export const getCountries = async () => {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.data

  inFlight ??= fetchAllCountries()
    .then(data => {
      cache = { data, fetchedAt: Date.now() }
      return data
    })
    .catch(error => {
      if (cache) return cache.data
      throw error
    })
    .finally(() => { inFlight = null })

  return inFlight
}
