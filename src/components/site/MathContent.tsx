import { InlineMath, BlockMath } from "react-katex";
import DOMPurify from "dompurify";
import "katex/dist/katex.min.css";

interface MathContentProps {
  html: string;
}

type Segment =
  | { type: "text"; content: string }
  | { type: "inline"; content: string }
  | { type: "block"; content: string };

function splitByLatex(html: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /\\\[(.*?)\\\]|\\\((.*?)\\\)/gs;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: html.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: "block", content: match[1].trim() });
    } else if (match[2] !== undefined) {
      segments.push({ type: "inline", content: match[2].trim() });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < html.length) {
    segments.push({ type: "text", content: html.slice(lastIndex) });
  }
  return segments;
}

const katexOptions = {
  throwOnError: false,
  strict: false as const,
};

export function MathContent({ html }: MathContentProps) {
  const parts = splitByLatex(html);

  return (
    <div
      className="
        prose max-w-none
        prose-headings:font-display prose-headings:text-navy prose-headings:scroll-mt-24
        prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/60 prose-h2:pb-2
        prose-h3:mt-8 prose-h3:mb-3
        prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-brand
        prose-p:leading-7 prose-p:text-foreground
        prose-li:leading-7
        prose-table:my-5 prose-table:w-full prose-table:text-sm prose-table:border-collapse
        prose-th:border prose-th:border-border/60 prose-th:bg-secondary/50 prose-th:p-2 prose-th:text-left
        prose-td:border prose-td:border-border/60 prose-td:p-2
        prose-blockquote:border-l-brand prose-blockquote:bg-brand-soft/40 prose-blockquote:py-1 prose-blockquote:not-italic
        prose-strong:text-navy
      "
    >
      {parts.map((part, i) => {
        if (part.type === "inline") {
          return (
            <span key={i} className="px-0.5">
              <InlineMath math={part.content} settings={katexOptions} />
            </span>
          );
        }
        if (part.type === "block") {
          return (
            <div
              key={i}
              className="not-prose my-5 overflow-x-auto rounded-xl border border-border/60 bg-secondary/20 px-4 py-4 text-center"
            >
              <BlockMath math={part.content} settings={katexOptions} />
            </div>
          );
        }
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
