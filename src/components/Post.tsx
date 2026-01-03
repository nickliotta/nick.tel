import { useParams, Redirect } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import PageWrapper from "../pages/PageWrapper";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { visit } from "unist-util-visit";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";

const NotesTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "#1f1f1f",
		color: "#fff",
		minWidth: 50,
		maxWidth: "none",
		width: "auto",
		fontFamily: "inherit",
		fontSize: "0.98rem",
		padding: "5px 20px",
		borderRadius: "8px",
		whiteSpace: "normal",
		lineHeight: 1.25,
		boxShadow: "0px 3px 10px rgba(0,0,0,0.3)",
		textAlign: "center",
	},
	[`& .${tooltipClasses.arrow}`]: {
		color: "#1f1f1f",
	},
}));

export function remarkTooltip() {
  return (tree: any) => {
    visit(tree, "text", (node, index, parent) => {
      const regex = /\[\[([^\|\]]+)\|([^\]]+)\]\]/g;
      const parts: any[] = [];
      let lastIndex = 0;

      node.value.replace(regex, (match: string, text: string, title: string, offset: number) => {
        if (offset > lastIndex) {
          parts.push({ type: "text", value: node.value.slice(lastIndex, offset) });
        }
        parts.push({
          type: "element",
          data: { hName: "tooltip", hProperties: { title } },
          children: [{ type: "text", value: text }],
        });
        lastIndex = offset + match.length;
        return match;
      });

      if (lastIndex < node.value.length) {
        parts.push({ type: "text", value: node.value.slice(lastIndex) });
      }

      if (parts.length > 0 && parent) {
        parent.children.splice(index, 1, ...parts);
      }
    });
  };
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    const getTitle = (md: string) => {
        const lines = md.split("\n");
        const h1 = lines.find((line) => line.startsWith("# "));
        if (h1) return h1.replace(/^# /, "").trim();
        return "Post"; 
    };

    useEffect(() => {
        if (!slug) return;

        fetch(`/posts/${slug}.md`)
            .then((res) => { 
                if (!res.ok) throw new Error("Not found");
                return res.text();
            })
            .then(setContent)
            .catch(() => setNotFound(true));
    }, [slug]);

    if (notFound) return <Redirect to="/posts" />;
    if (!content) return <p>...</p>;
    
    const title = getTitle(content);

    return (
        <PageWrapper>
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Article>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkTooltip]}
                    components={{
                        code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code
                                    style={{
                                        backgroundColor: "#333",
                                        padding: "0.2rem 0.4rem",
                                        borderRadius: "4px",
                                        fontFamily: "Space Mono, monospace",
                                    }}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        },
                        tooltip({ node, children }) {
                            const title = node.properties?.title;

                            return (
                            <NotesTooltip title={title} arrow placement="top">
                                {children}
                            </NotesTooltip>
                            );
                        },          
                        a({ href, children, ...props }) {
                            return (
                                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                                    {children}
                                </a>
                            );
                        },                    
                    }}
                >
                    {content}
                </ReactMarkdown>
            </Article>
        </PageWrapper>
    );
}

const Article = styled.article`
    line-height: 1.5;
    
    h1 {
        margin-top: 0.67em;
        margin-bottom: -1.25rem;
    }

    h2, h3, h4, h5, h6 {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
    }

    p {
        color: hsl(var(--primary-200));
        margin-bottom: 1rem;
    }

    a {
        color: #ff65b2;
        text-decoration: none !important;
        &:hover {
            color: #ff8ccf;
            text-decoration: none !important;
        }
    }
    
    li {
        margin: 0.5rem 0;
        padding-left: 0.5rem;
    }

    li::marker {
        color: #d8d8d8ff;
    }

    img {
        max-width: 100%;
        height: auto;
        border-radius: 10px;
        margin: 1rem 0;
    }
`;