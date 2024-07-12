import { useEffect, useRef, useState, useTransition } from 'react'

const useServerAction = <P extends unknown[], R>(
  action: (...args: P) => Promise<R>,
  onFinished?: (_: R | undefined) => void
): [(...args: P) => Promise<R | undefined>, boolean] => {
  const [isPending, startTransition] = useTransition(),
    [result, setResult] = useState<R>(),
    [finished, setFinished] = useState(false),
    resolver = useRef<(value?: R | PromiseLike<R>) => void>(),
    runAction = async (...args: P): Promise<R | undefined> => {
      startTransition(
        () =>
          void action(...args).then(data => {
            setResult(data)
            setFinished(true)
          })
      )
      return new Promise(resolve => {
        resolver.current = resolve
      })
    }
  useEffect(() => {
    if (!finished) {
      return
    }
    if (onFinished) {
      onFinished(result)
    }
    resolver.current?.(result)
  }, [result, finished, onFinished])

  return [runAction, isPending]
}

export default useServerAction
