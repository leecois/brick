type Source = 'kompass' | 'linkedin' | 'europages'

interface BaseInfo {
  id: string
  name: string
  ava: string
}
interface Contact {
  location: string
  industry: string
  mail: string
  phone: string
  work: boolean
  verified: boolean
}
type Employee = BaseInfo &
  Partial<Contact> & {
    title: string
    linkedin: string
    company: string
    star?: boolean
  }
type Company = BaseInfo & {
  address: string
  country: string
  description: string
  url: string
  searchQueries: string[]
  industry?: string
  employeeCount?: number
}
interface Setting {
  source: Source
  model: string
  alpha: number
  beta: number
}
type Query = Setting & {
  id: string
  query: string
  date: Date | null
}
interface Mail {
  user: string
  mails: string[]
  subject: string
  message: string
}
export type { Company, Contact, Employee, Query, Setting, Source, Mail }
