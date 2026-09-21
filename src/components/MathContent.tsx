import { InlineMath, BlockMath } from 'react-katex';
import DOMPurify from 'dompurify';

interface MathContentProps {
  html: string; // le content_html venant de ton API (MongoDB)
}

export function MathContent({ html }: MathContentProps) {
  // On découpe le texte en segments : texte normal / \( ... \) / \[ ... \]
  const parts = splitByLatex(html);

  return (
    <div className="prose max-w-none">
      {parts.map((part, i) => {
        if (part.type === 'inline') return <InlineMath key={i} math={part.content} />;
        if (part.type === 'block') return <BlockMath key={i} math={part.content} />;
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(part.content) }}
          />
        );
      })}
    </div>
  );
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'inline'; content: string }
  | { type: 'block'; content: string };

function splitByLatex(html: string): Segment[] {
  const segments: Segment[] = [];
  // Regex qui capture \[ ... \] (bloc) ou \( ... \) (en ligne)
  const regex = /\\\[(.*?)\\\]|\\\((.*?)\\\)/gs;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: html.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: 'block', content: match[1].trim() });
    } else if (match[2] !== undefined) {
      segments.push({ type: 'inline', content: match[2].trim() });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < html.length) {
    segments.push({ type: 'text', content: html.slice(lastIndex) });
  }
  return segments;
}
