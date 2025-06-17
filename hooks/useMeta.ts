'use client'

import { useEffect } from 'react'

interface UseMetaProps {
  title?: string
  description?: string
  keywords?: string
}

export const useMeta = ({ title, description, keywords }: UseMetaProps) => {
  useEffect(() => {
    if (title) {
      document.title = title
    }

    const setMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('name', name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    if (description) setMetaTag('description', description)
    if (keywords) setMetaTag('keywords', keywords)
  }, [title, description, keywords])
}
