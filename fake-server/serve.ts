import { file, serve, sleep } from 'bun'

serve({
  async fetch(req) {
    const url = new URL(req.url)
    let f = url.pathname
    await sleep(0)
    if (f !== '/user') {
      await sleep(1000)
    }
    const source = url.searchParams.get('source')
    if (source) {
      f += '&' + new URLSearchParams({ source }).toString()
    }
    f = `.${f}.json`
    console.log(f)
    return new Response(file(f))
  },
  port: 3001
})
