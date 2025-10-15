import { ENDPOINT } from '../utils'
import type { Challenge } from './types'

export const getChallenge = async () => {
  const raw = await fetch(`${ENDPOINT}/challenge`, {
    method: 'GET',
  })
  if (!raw.ok) {
    throw new Error('Failed to fetch challenge, please try again later')
  }

  const res = (await raw.json()) as { c: number; d: Challenge }
  if (res.c !== 0) {
    throw new Error('Failed to fetch challenge, please try again later')
  }

  return res.d
}
