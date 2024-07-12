type Source = 'kompass' | 'linkedin' | 'europages'

interface BaseInfo {
  ava?: string
  id: string
  name: string
}
interface Contact {
  industry: string
  location: string
  mail: string
  phone: string
  verified: boolean
  work: boolean
}
type Employee = BaseInfo &
  Partial<Contact> & {
    company: string
    linkedin: string
    star?: boolean
    title: string
  }
type Company = BaseInfo & {
  address?: string
  country?: string
  description?: string
  employeeCount?: number
  industry?: string
  phone?: string
  searchQueries?: string[]
  unlocked?: boolean
  url?: string
}
interface Address {
  country: string
  name: string
}
interface Product {
  description: string
  name: string
}
interface SocialMedia {
  platform: string
  url: string
}
interface Mail {
  en: string
  vi: string
}
interface CompanyInfo {
  buyingProducts?: string[]
  companyDescription?: string
  emails?: string[]
  importPotential?: number
  importPotentialReasoning?: string
  industries?: string[]
  internationalTrade?: string[]
  phones?: string[]
  sellingProducts?: Product[]
  socialMedia?: SocialMedia[]
  storesBranchesOffices?: Address[]
  targetCustomers?: string[]
  targetSuppliers?: string[]
}

export type { Address, Company, CompanyInfo, Contact, Employee, Mail, Product, SocialMedia, Source }
