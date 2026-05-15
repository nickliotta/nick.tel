import { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

const Publication = ({
	title,
	authors,
	year,
	journal,
	doi,
	abstract,
	code,
}: {
	title: string;
	authors: string;
	year: number;
	journal: string;
	doi?: string;
	abstract?: string;
	code?: string;
}) => {
	const [showAbstract, setShowAbstract] = useState(false);
	const me = ["Nicholas F. Liotta", "Nicholas Liotta"];

	return (
		<>
			<PublicationLayoutFix />
			<Container>
				<Title>{title}</Title>

				<Authors>
					{authors.split(", ").map((author, i, arr) => {
						const isMe = me.some((me) => author.includes(me));
						const isLast = i === arr.length - 1;

						if (isMe) {
							return (
								<span key={i}>
									<span style={{ color: "lightpink", fontWeight: "bold" }}>
										{author}
									</span>
									{!isLast && ", "}
								</span>
							);
						}

						return (
							<span key={i}>
								{author}
								{!isLast && ", "}
							</span>
						);
					})}
				</Authors>

				<Journal>
					<i>{journal}</i> ({year}){" "}
					{doi && (
						<span>
							DOI:{" "}
							<a
								href={`https://doi.org/${doi}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								{doi}
							</a>
						</span>
					)}
				</Journal>

				<LinksRow>
					{abstract && (
						<ClickableText onClick={() => setShowAbstract(!showAbstract)}>
							[Abstract]
						</ClickableText>
					)}
					{code && (
						<ClickableLink
							href={code}
							target="_blank"
							rel="noopener noreferrer"
							color="lightblue"
						>
							[Code]
						</ClickableLink>
					)}
				</LinksRow>

				{abstract && (
					<AbstractShell $show={showAbstract}>
						<AbstractBox $show={showAbstract}>{abstract}</AbstractBox>
					</AbstractShell>
				)}
			</Container>
		</>
	);
};

/*
	Fixes the shifting bug without adding the extra spacing from the earlier version.
	- scrollbar-gutter prevents page-width jumps
	- overflow-anchor prevents Chrome from moving the viewport while the abstract opens
*/
const PublicationLayoutFix = createGlobalStyle`
	html {
		overflow-y: scroll;
		scrollbar-gutter: stable;
	}

	body,
	#root {
		overflow-anchor: none;
	}
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid hsl(var(--primary-800));
	border-radius: 10px;
	padding: 1rem;
	margin-bottom: 1rem;
	background-color: hsl(var(--primary-900));
	width: 100%;
	box-sizing: border-box;
	font-family: "Space Mono", monospace;
	font-size: 0.95em;
	overflow-anchor: none;
	contain: layout paint;
`;

const Title = styled.h3`
	margin: 0 0 0.1rem 0;
	color: #fff;
`;

const Authors = styled.p`
	font-family: "Space Mono", monospace;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
	word-break: break-word;
	margin: 0 0 0.1rem 0;
`;

const Journal = styled.p`
	margin: 0 0 0.5rem 0;
	color: #aaa;

	a {
		color: lightblue;
		text-decoration: none !important;
	}

	a:hover {
		opacity: 0.8;
		transition: color 0.3s ease, opacity 0.3s ease;
	}

	a:visited,
	a:hover,
	a:active,
	a:focus {
		text-decoration: none !important;
	}

	i {
		font-style: italic;
	}
`;

const LinksRow = styled.div`
	display: flex;
	gap: 0.5rem;
	margin-bottom: 0.25rem;
`;

const ClickableText = styled.span<{ color?: string }>`
	color: ${({ color }) => color || "lightgreen"};
	cursor: pointer;
	text-decoration: none;
	transition: color 0.3s ease, opacity 0.3s ease;

	&:hover {
		opacity: 0.8;
	}
`;

const ClickableLink = styled.a<{ color?: string }>`
	color: ${({ color }) => color || "lightgreen"};
	cursor: pointer;
	text-decoration: none !important;
	transition: color 0.3s ease, opacity 0.3s ease;

	&:hover {
		text-decoration: none !important;
		opacity: 0.8;
	}
`;

/*
	This is the part that fixes the shift. Unlike the previous grid version,
	the inner box has zero padding while closed, so the closed publication card
	keeps the same compact spacing as your original.
*/
const AbstractShell = styled.div<{ $show: boolean }>`
	display: grid;
	grid-template-rows: ${({ $show }) => ($show ? "1fr" : "0fr")};
	opacity: ${({ $show }) => ($show ? 1 : 0)};
	overflow: hidden;
	overflow-anchor: none;
	transition:
		grid-template-rows 350ms ease,
		opacity 250ms ease;
`;

const AbstractBox = styled.div<{ $show: boolean }>`
	min-height: 0;
	overflow: hidden;
	font-family: "Open Sans", sans-serif;
	background-color: hsl(var(--primary-700));
	border-radius: 5px;
	font-size: 0.90rem;
	line-height: 1.55;
	box-sizing: border-box;
	padding: ${({ $show }) => ($show ? "0.5rem" : "0 0.5rem")};
	transition: padding 350ms ease;
	overflow-anchor: none;
`;

export default Publication;