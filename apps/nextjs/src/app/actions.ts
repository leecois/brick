'use server'

import type { Company, Mail, Setting } from '~/types'
import { env } from '~/env'

const get = async (path: string) => {
  const url = env.ENDPOINT + path
  console.log('GET |', url)
  const res = await fetch(url)
  return (await res.json()) as unknown
}

const url2keyword = async (prevState: [], form: { url: string }): Promise<string[]> =>
  get('/url2keyword?url=' + form.url) as Promise<string[]>

const file2keyword = async (prevState: [], form: FormData): Promise<string[]> => {
  const url = env.ENDPOINT + '/file2keyword'
  // const url = 'http://localhost:8000/file2keyword'
  console.log('POST |', url, form)
  const res = await fetch(url, {
    method: 'POST',
    body: form
  })
  return (await res.json()) as string[]
}

const getCompanies = async (
  prevState: [],
  form: {
    setting: Setting
    user: string
    query: string
  }
): Promise<Company[]> =>
  get(
    '/company?' +
      new URLSearchParams(form.setting as unknown as Record<string, string>).toString() +
      '&user=' +
      form.user +
      '&query=' +
      form.query
  ) as Promise<Company[]>

const getHistory = async (user: string, id: string) => get('/history?id=' + id + '&user=' + user)
const getEmployees = async (user: string, id: string) => get('/employee?id=' + id + '&user=' + user)
const getContact = async (user: string, id: string) => get('/contact?id=' + id + '&user=' + user)

const deleteHistory = async (user: string, ids: string[]) => {
  const url = env.ENDPOINT + '/delete'
  const payload = { user, ids }
  console.log('POST |', url, payload)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  return (await res.json()) as unknown
}

const sendEmails = async (form: Mail) => {
  console.log('POST |', form)

  // const url = process.env.ENDPOINT + '/mail'
  // console.log('POST |', url)
  // const res = await fetch(url, {
  // method: 'POST',
  // headers: {
  // 'Content-Type': 'application/json'
  // },
  // body: JSON.stringify(form)
  // })
  // return await res.json()

  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}

export {
  deleteHistory,
  getCompanies,
  getContact,
  getEmployees,
  getHistory,
  sendEmails,
  url2keyword,
  file2keyword
}
