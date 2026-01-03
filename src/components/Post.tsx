import { useParams, Redirect } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import styled from "styled-components";
import PageWrapper from "../pages/PageWrapper";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

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

    return (
        <PageWrapper>
            <Article>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
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
