'use client'

import { useEffect, useState } from 'react'
import { GlobeIcon } from '@radix-ui/react-icons'
import { getCookie, setCookie } from 'cookies-next'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@a/ui/dropdown-menu'

import '../../../../node_modules/flag-icons/css/flag-icons.min.css'

const GT = 'googtrans',
  iso639to3166: Record<string, string> = {
    aa: 'dj',
    af: 'za',
    ak: 'gh',
    am: 'et',
    auto: 'gb',
    az: 'az',
    be: 'by',
    bg: 'bg',
    bi: 'vu',
    bm: 'ml',
    bn: 'bd',
    bs: 'ba',
    ca: 'ad',
    cs: 'cz',
    cy: 'gb',
    da: 'dk',
    de: 'de',
    dv: 'mv',
    dz: 'bt',
    el: 'gr',
    en: 'gb',
    es: 'es',
    et: 'ee',
    fa: 'ir',
    fi: 'fi',
    fil: 'ph',
    fj: 'fj',
    fr: 'fr',
    ga: 'ie',
    gaa: 'gh',
    gu: 'in',
    he: 'il',
    hi: 'in',
    ho: 'pg',
    hr: 'hr',
    ht: 'ht',
    hu: 'hu',
    hy: 'am',
    id: 'id',
    ig: 'ng',
    is: 'is',
    it: 'it',
    ja: 'jp',
    ka: 'ge',
    kg: 'cg',
    kj: 'ao',
    kk: 'kz',
    km: 'kh',
    kmb: 'ao',
    ko: 'kr',
    kr: 'ne',
    ku: 'iq',
    ky: 'kg',
    la: 'va',
    lb: 'lu',
    ln: 'cg',
    lo: 'la',
    lt: 'lt',
    lu: 'cd',
    lv: 'lv',
    mg: 'mg',
    mh: 'mh',
    mi: 'nz',
    mk: 'mk',
    mn: 'mn',
    mos: 'bf',
    ms: 'my',
    mt: 'mt',
    my: 'mm',
    nb: 'no',
    nd: 'zw',
    ne: 'np',
    nl: 'nl',
    nn: 'no',
    no: 'no',
    nr: 'za',
    nso: 'za',
    ny: 'mw',
    pa: 'in',
    pap: 'aw',
    pl: 'pl',
    ps: 'af',
    pt: 'pt',
    qu: 'wh',
    rm: 'ch',
    rn: 'bi',
    ro: 'ro',
    ru: 'ru',
    rw: 'rw',
    sg: 'cf',
    si: 'lk',
    sk: 'sk',
    sl: 'si',
    sn: 'zw',
    snk: 'sn',
    so: 'so',
    sq: 'al',
    sr: 'rs',
    srr: 'sn',
    ss: 'sz',
    st: 'ls',
    sv: 'se',
    ta: 'lk',
    te: 'in',
    tet: 'tl',
    tg: 'tj',
    th: 'th',
    ti: 'er',
    tk: 'tm',
    tl: 'ph',
    tn: 'bw',
    tpi: 'pg',
    tr: 'tr',
    ts: 'za',
    uk: 'ua',
    umb: 'ao',
    ur: 'pk',
    uz: 'uz',
    ve: 'za',
    vi: 'vn',
    wo: 'sn',
    xh: 'za',
    zh: 'cn',
    zu: 'za'
  },
  languages: Record<string, string> = {
    auto: 'English',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
    hi: 'हिन्दी',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    vi: 'Tiếng Việt'
  }

export default function Translate() {
  const [current, setCurrent] = useState('vi')

  useEffect(() => {
    const lang = getCookie(GT)
    if (lang) {
      const s = lang.split('/')
      if (s.length > 2 && s[2]) {
        setCurrent(s[2])
      }
    } else {
      setCookie(GT, '/auto/vi')
    }
  }, [])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='notranslate mb-1.5 w-full justify-start gap-0 rounded-3xl px-px text-[0] text-muted-foreground transition-all duration-500 *:transition-all *:duration-500 hover:drop-shadow-lg group-hover:h-10 group-hover:pl-0.5 group-hover:pr-3 group-hover:text-base'
          variant='ghost'>
          <span
            className={cn(
              `fi fis fi-${iso639to3166[current]}`,
              'rounded-full text-[33px] group-hover:text-[0]'
            )}
          />
          <GlobeIcon className='size-0 group-hover:mr-1.5 group-hover:size-9' />
          {languages[current]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='mx-2 my-1.5 transition-all duration-300 hover:drop-shadow-xl'
        onCloseAutoFocus={e => e.preventDefault()}
        side='right'>
        <DropdownMenuRadioGroup
          onValueChange={(value: string) => {
            setCurrent(value)
            setCookie(GT, `/auto/${value}`)
            window.location.reload()
          }}
          value={current}>
          {Object.entries(languages).map(([id, lang]) => (
            <DropdownMenuRadioItem className='notranslate group gap-2' key={id} value={id}>
              <span
                className={cn(
                  `fi fis fi-${iso639to3166[id]}`,
                  'rounded-full text-xl transition-all duration-500 group-hover:scale-150 group-hover:drop-shadow-lg'
                )}
              />
              {lang}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
