import { atomWithStorage } from 'jotai/utils'

import type { CollectionModel } from '@a/db/schema'

import type { Company, CompanyInfo, Employee, Source } from '~/types'

const collectAtom = atomWithStorage<Company[]>('collect', []),
  companiesAtom = atomWithStorage<Company[]>('company', []),
  employeesAtom = atomWithStorage<Record<string, Employee[]>>('employees', {}),
  focusCollectionAtom = atomWithStorage<CollectionModel | null>('collection', null),
  focusCompanyAtom = atomWithStorage<Company | null>('focus', null),
  infoAtom = atomWithStorage<Record<string, CompanyInfo>>('moreinfo', {}),
  queryAtom = atomWithStorage<string>('query', ''),
  sourceAtom = atomWithStorage<Source>('source', 'linkedin')

export {
  collectAtom,
  companiesAtom,
  employeesAtom,
  focusCollectionAtom,
  focusCompanyAtom,
  infoAtom,
  queryAtom,
  sourceAtom
}
