import { FunctionComponent, useEffect, useState } from 'react'

import { useInView } from 'react-intersection-observer'

const prism = require('prismjs')

import { source } from '../../utils/component'

import { allBreakpoints } from '../../lib/breakpoints'

import { Component } from '../../interface/component'

import Breakpoint from './buttons/breakpoint'
import Copy from './buttons/copy'
import Code from './buttons/view'
import Range from './range'
import IconLoading from '../icon/loading'
import { useRouter } from 'next/router'

type Props = {
  item: Component
  spacing: string
}

const Example: FunctionComponent<Props> = ({ item, spacing }) => {
  let [code, setCode] = useState<string>()
  let [html, setHtml] = useState<string>()
  let [view, setView] = useState<boolean>(true)
  let [width, setWidth] = useState<string>('100%')
  let [range, setRange] = useState<number>(1348)
  let router = useRouter()

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  })

  const breakpoints = allBreakpoints

  const { id, title, spacing: space } = item

  const { query } = router
  const { category, slug } = query

  const componentSpacing: string = space ? space : spacing

  const componentId = `component-${id}`

  useEffect(() => {
    async function fetchHtml() {
      const response = await fetch(`/components/${category}-${slug}/${id}.html`)
      const text = await response.text()

      setCode(text)
      setHtml(source(text, componentSpacing))

      return
    }

    if (inView) {
      fetchHtml()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  useEffect(() => {
    prism.highlightAll()
  })

  useEffect(() => {
    range === 1348 ? setWidth('100%') : setWidth(`${range}px`)
  }, [range])

  const handleWidth = (width: string) => {
    setWidth(width)

    width === '100%'
      ? setRange(1348)
      : setRange(Number(width.replace('px', '')))
  }

  return (
    <div className="pt-20 -mt-20" ref={ref} id={componentId}>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-black sm:text-xl">
          <a href={`#${componentId}`} className="relative inline-block group">
            <span
              className="hidden lg:inset-y-0 lg:block lg:transition lg:opacity-0 lg:absolute lg:-left-6 group-hover:opacity-25"
              aria-hidden="true"
            >
              #
            </span>

            {title}
          </a>
        </h2>

        <div className="flex items-center justify-between">
          <div>
            {code && (
              <div className="flex items-center gap-4">
                <Code handleView={setView} view={view} />
                <Copy code={code} />
              </div>
            )}
          </div>

          <div className="hidden lg:items-center lg:gap-4 lg:flex">
            <Range range={range} handleRange={setRange} />

            <strong className="text-center font-mono text-white font-medium text-xs w-16 py-2.5 bg-black rounded-lg">
              {width}
            </strong>

            {breakpoints.map(({ name, emoji, width: breakpoint }) => (
              <Breakpoint
                key={name}
                text={name}
                emoji={emoji}
                size={breakpoint}
                handleWidth={(width: string) => handleWidth(width)}
                active={width === breakpoint}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          {!code && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-white rounded-lg"
              aria-hidden="true"
            >
              <IconLoading />
            </div>
          )}

          <div className={view ? 'block' : 'hidden'}>
            <iframe
              className="bg-white w-full h-[400px] lg:transition-all lg:h-[600px] ring-2 ring-black rounded-lg"
              loading="lazy"
              srcDoc={html}
              style={{ maxWidth: width }}
              title={`${title} Component`}
            ></iframe>
          </div>

          <div className={view ? 'hidden' : 'block'}>
            <pre className="p-4 overflow-auto h-[400px] lg:h-[600px] ring-2 ring-black rounded-lg">
              <code className="language-html">{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Example
