/* eslint-disable react/display-name */
import { useMemo } from 'react'
import RenderNotebook from '@/lib/renderNotebook'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'

export const NotebookComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: BlogNewsletterForm,
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = require(`../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

export const NotebookRenderer = ({ layout, nbJSON, ...rest }) => {
  const NBLayout = useMemo(() => RenderNotebook(nbJSON), [nbJSON])

  return NBLayout
}
