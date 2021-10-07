import fs from 'fs'
import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { NotebookRenderer } from '@/components/NotebookComponents'
import { getFileBySlug as getMDFileBySlug } from '@/lib/mdx'
import { getFiles, formatSlug, getAllNotebookMetadata, getFileBySlug } from '@/lib/ipynb'

const DEFAULT_LAYOUT = 'PostLayout'

export async function getStaticPaths() {
  const posts = getFiles('notebooks')
  return {
    paths: posts.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllNotebookMetadata('notebooks')
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug('notebooks', params.slug.join('/'))
  const authorList = post.metadata.authors || ['default']
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getMDFileBySlug('authors', [author], 'md')
    return authorResults.frontMatter
  })
  const authorDetails = await Promise.all(authorPromise)
  // rss
  const rss = generateRss(allPosts)
  fs.writeFileSync('./public/feed.xml', rss)

  return { props: { post, authorDetails, prev, next } }
}

export default function Notebooks({ post, authorDetails, prev, next }) {
  const { nbformat, nbformat_minor, cells, metadata } = post
  return (
    <>
      {metadata.draft !== true ? (
        <NotebookRenderer nbJSON={post} authorDetails={authorDetails} prev={prev} next={next} />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
