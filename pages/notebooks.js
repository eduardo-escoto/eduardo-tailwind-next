// import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { getAllNotebookMetadata } from '@/lib/ipynb'

export const POSTS_PER_PAGE = 5

export async function getStaticProps() {
  // const posts = await getAllFilesFrontMatter('blog')
  const posts = await getAllNotebookMetadata('notebooks')
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }
  return { props: { initialDisplayPosts, pagination, posts } }
}

// Render folder structure
// export async function getServerSideProps() {
//   const res = await fetch(
//     `https://api.github.com/repos/eduardo-exists/notebook-monorepo/git/trees/main?recursive=1`
//   )
//   const repoFileStructure = await res.json()
//   const notebook
//   return { props: { testProp: 'test' } }
// }
// TODO: Local build notebooks and then on client side fetch from github api. Render routes to local notebooks and also markdown files
// Or just manually place in here. Not sure what would be better, worth a try

export default function Blog({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        slugPath="/blog/notebooks/"
        title="All Notebooks"
      />
    </>
  )
}
