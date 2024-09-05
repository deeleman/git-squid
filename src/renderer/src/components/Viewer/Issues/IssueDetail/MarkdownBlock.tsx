import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function MarkdownBlock(props: { children: string | null | undefined }): JSX.Element {
  return (
    <Markdown skipHtml disallowedElements={['img']} remarkPlugins={[remarkGfm]}>
      {props.children}
    </Markdown>
  )
}

export default MarkdownBlock
