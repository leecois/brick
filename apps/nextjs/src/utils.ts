import type { CountryProperty } from 'country-codes-list'
import { customList } from 'country-codes-list'
import { countryToAlpha2 } from 'country-to-iso'

const enToIso: Record<string, string> = customList(
  'countryNameEn' as CountryProperty,
  '{countryCode}'
)
const isoToFlag = customList('countryCode' as CountryProperty, '{flag}')
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
const nameToIso = (n: string) => enToIso[n] ?? countryToAlpha2(n)

export { capitalize, isoToFlag, nameToIso }
