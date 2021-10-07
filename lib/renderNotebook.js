import htmr from 'htmr'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'

const CellRendererTypes = {
  code: RenderCode,
  markdown: RenderMarkdown,
}

const OutputRendererTypes = {
  stream: RenderOutputStream,
  execute_result: RenderOutputExecuteResult,
  display_data: RenderOutputDisplayData,
  error: RenderOutputError,
}

function RenderOutputError(props) {
  return <a>ERROR LUL</a>
}

function RenderOutputDisplayData({ data, metadata, output_type }) {
  const DataComponents = Object.keys(data).map((key, idx) => {
    const DataRenderer = DataRendererTypes[key]
    return <DataRenderer data={data[key]} key={idx} />
  })
  return <div>{DataComponents}</div>
}

const DataRendererTypes = {
  'text/html': RenderOutputHTML,
  'text/plain': RenderOutputPlainText,
  'image/png': RenderOutputPNG,
}

function RenderOutputExecuteResult({ data, execution_count, metadata, output_type }) {
  // console.log(data);
  const DataComponents = Object.keys(data).map((key, idx) => {
    const DataRenderer = DataRendererTypes[key]
    return <DataRenderer data={data[key]} key={idx} />
  })
  return (
    <div>
      Execution Count: {execution_count} <br />
      Output Type: {output_type} <br />
      {DataComponents}
    </div>
  )
}

function RenderOutputHTML({ data }) {
  // console.log("html", data);
  // return <div dangerouslySetInnerHTML={{ __html: data }} />;
  return htmr(data.join(''))
}
function RenderOutputPlainText({ data }) {
  // console.log("text", data);
  return (
    <pre>
      <samp>{data}</samp>
    </pre>
  )
}
function RenderOutputPNG({ data }) {
  // console.log("image", data);
  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '20%' }}>
      <Image
        alt="Image Alt"
        src={`data:image/png;base64,${data}`}
        layout="fill"
        objectFit="contain" // Scale your image down to fit into the container
      />
    </div>
  )
}

function RenderOutputStream({ name, output_type, text }) {
  return (
    <div>
      Output Name: {name} <br />
      Output Type: {output_type} <br />
      Output Text:{' '}
      <pre>
        <samp>{text}</samp>
      </pre>{' '}
      <br />
    </div>
  )
}

function RenderSource({ sourceArray }) {
  return (
    <pre>
      <code>{sourceArray.join('')}</code>
    </pre>
  )
}

function RenderOutputs({ outputArray }) {
  // TODO: Render text/html straight to jsx
  //   console.log(typeof outputArray, outputArray.length, outputArray);

  if (outputArray.length === 0) return null

  return outputArray.map((output, idx) => {
    // console.log("Now rendering:", idx, output.output_type);
    // console.log(output);
    const OutputRenderComponent = OutputRendererTypes[output.output_type]
    return OutputRenderComponent ? <OutputRenderComponent key={idx} {...output} /> : null
  })
}
function RenderCode({ cell_type, execution_count, metadata, source, outputs }) {
  // TODO: Render Scrolled and Collapsed cells accordingly
  if (metadata.scrolled) return 'Scrolled Cell Not Implemented'

  if (metadata.collapsed) return 'Collapsed Cell Not Implemented'

  return (
    <div>
      {cell_type}! <br />
      <span>Execution Count: {execution_count}</span> <br />
      Source: <RenderSource sourceArray={source} />
      Output: <RenderOutputs outputArray={outputs} />
    </div>
  )
}

function RenderMarkdown({ cell_type, metadata, source }) {
  return (
    <>
      {cell_type}!
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {source.join('')}
      </ReactMarkdown>
    </>
  )
}

export default function RenderNotebook({ metadata, nbformat, nbformat_minor, cells }) {
  console.log('Notebook Version:', nbformat + '.' + nbformat_minor)
  return cells.map((cellJSON, cell_idx) => {
    const Renderer = CellRendererTypes[cellJSON.cell_type]
    console.log('Now rendering:', cellJSON.id ? cellJSON.id : cell_idx)
    return (
      <div key={cellJSON.id ? cellJSON.id : cell_idx}>
        <Renderer {...cellJSON} />
        <hr />
      </div>
    )
  })
}
