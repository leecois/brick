'use server'

import type { UserGeneratable } from '@a/db/schema'

import type { Company, CompanyInfo, Contact, Employee, Mail, Source } from '~/types'
import { env } from '~/env'

interface GenMailProps {
  company: string
  employee?: string
  notes?: string
  user: string
}

const _get = async (path: string) => {
    const ep = env.ENDPOINT + path,
      res = await fetch(ep)
    console.log('GET |', ep)
    return (await res.json()) as unknown
  },
  _getForm = (path: string, form: Record<string, string>) =>
    _get(path + new URLSearchParams(form).toString()),
  _postForm = async (path: string, form: FormData) => {
    const ep = env.ENDPOINT + path,
      res = await fetch(ep, {
        body: form,
        method: 'POST'
      })
    console.log('POST |', ep, form)
    return (await res.json()) as unknown
  },
  file2keyword = (prevState: [], form: FormData) =>
    _postForm('/file2keyword', form) as Promise<string[]>,
  file2profile = (prevState: object, form: FormData) =>
    _postForm('/file2profile', form) as Promise<UserGeneratable>,
  genMail = (input: GenMailProps) =>
    _get(
      `/genmail?${new URLSearchParams(input as unknown as Record<string, string>).toString()}`
    ) as Promise<{
      en: string
      vi: string
    }>,
  getCompanies = (
    prevState: {
      data: Company[]
      id: string
    },
    form: {
      query: string
      source: Source
      user: string
    }
  ) =>
    _getForm('/company?', form) as Promise<{
      data: Company[]
      id: string
    }>,
  getCompanyInfo = (user: string, id: string) =>
    _get(`/moreinfo?id=${id}&user=${user}`) as Promise<CompanyInfo>,
  getContact = (user: string, id: string) =>
    _get(`/contact?id=${id}&user=${user}`) as Promise<Contact>,
  getEmployees = (user: string, ids: string) =>
    _get(`/employee?ids=${ids}&user=${user}`) as Promise<Record<string, Employee[]>>,
  getHistory = (user: string, id: string) =>
    _get(`/history?id=${id}&user=${user}`) as Promise<Company[]>,
  sendEmails = async (form: Mail) => {
    console.log('POST |', form)
    await new Promise(resolve => {
      setTimeout(resolve, 1000)
    })
    return true
  },
  url2keyword = (
    prevState: [],
    form: {
      url: string
      user: string
    }
  ) => _getForm('/url2keyword?', form) as Promise<string[]>,
  url2profile = (
    prevState: object,
    form: {
      url: string
      user: string
    }
  ) => _getForm('/url2profile?', form) as Promise<UserGeneratable>

export {
  file2keyword,
  file2profile,
  genMail,
  getCompanies,
  getCompanyInfo,
  getContact,
  getEmployees,
  getHistory,
  sendEmails,
  url2keyword,
  url2profile
}
