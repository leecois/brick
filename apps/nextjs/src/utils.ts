import type { CountryProperty } from 'country-codes-list'
import { customList } from 'country-codes-list'
import { countryToAlpha2 } from 'country-to-iso'

import type { Source } from '~/types'

const enToIso: Record<string, string> = customList(
    'countryNameEn' as CountryProperty,
    '{countryCode}'
  ),
  isoToFlag = customList('countryCode' as CountryProperty, '{flag}'),
  nameToIso = (n: string) => enToIso[n] ?? countryToAlpha2(n),
  url2source = (url: string): Source => {
    if (url.includes('europages.co')) {
      return 'europages'
    }
    if (url.includes('kompass.com')) {
      return 'kompass'
    }
    return 'linkedin'
  }

export { isoToFlag, nameToIso, url2source }
