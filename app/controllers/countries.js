import { getCountries } from '../services/countries.js'

export async function countriesController (req, res) {
  try {
    res.json(await getCountries())
  } catch (error) {
    console.error('Failed to load countries:', error.message)
    res.status(502).json({ error: 'Country list unavailable' })
  }
}
