import { animated, useSpring } from "react-spring";
import styled from "styled-components";
import { ExternalLinkIcon } from "./Icons";

const calc = (x: number, y: number) => [
	-(y - window.innerHeight / 2) / 200,
	-(x - window.innerWidth / 2) / 200,
	1.05,
];

const trans = (x: number, y: number, s: number): string =>
	`perspective(200px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const Work = ({
	company,
	logo,
	department,
	role,
	location,
	timeline,
    website
}: {
	company: string;
	logo: string;
	department: string;
	role: string;
	location?: string;
	timeline?: string;
    website: string;
}) => {
	const [props, set] = useSpring(() => ({
		xys: [0, 0, 1],
		config: { mass: 2, tension: 350, friction: 40 },
	}));

	return (
        <A href={website} target="_blank" rel="noopener noreferrer">
            <Container
                onMouseMove={({ clientX: x, clientY: y }: { clientX: number; clientY: number }) =>
                    set({ xys: calc(x, y) })
                }
                onMouseLeave={() => set({ xys: [0, 0, 1] })}
                //@ts-ignore
                style={{ transform: props.xys.interpolate(trans) }}
            >
                <Header>
                    <img alt={`${company} Logo`} draggable={false} src={logo} />
                    <div>
                        <sub>{timeline}</sub>
                        <h3>
                            {company} <ExternalLinkIcon />
                        </h3>
                        <span>{department}</span>
                        <Location>
                            {location}
                        </Location>
                    </div>
                </Header>
                <Content>
                    <p>
                        {role}
                    </p>
                </Content>
            </Container>
        </A>
	);
};

const A = styled.a`
    text-decoration: none;
    color: inherit;

    &:hover {
        text-decoration: none !important;
    }
`;

const Location = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    font-weight: 500;
    height: 19px;
    font-size: 14px;
    margin-top: 1px;
    margin-bottom: 15px;
    user-select: none;
    color: #a7a7a7f3;
    overflow-wrap: anywhere;

    @media (max-width: 480px) {
        height: auto;
        line-height: 1.25;
        margin-bottom: 0.75rem;
    }
`;

const Container = styled(animated.div)`
    width: 30em;
    height: 10.25rem;
    border: 1px solid hsl(var(--primary-800));
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.1s ease;
    will-change: transform;
    box-sizing: border-box;

	display: flex;
	flex-direction: column;
	justify-content: flex-start;
    overflow: hidden;

    &:hover {
        background-color: hsl(var(--primary-800));
    }

    @media (max-width: 768px) {
        width: 100%;
        height: auto;
        min-height: 11rem;
        transform: none !important;
    }
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem 1rem 0.35rem 1rem;
    min-width: 0;

    img {
        width: 70px;
        height: 70px;
        border-radius: 25%;
        margin-right: 1rem;
        flex: 0 0 auto;
        object-fit: contain;
    }

    div {
        min-width: 0;
        flex: 1;

        sub {
            display: block;
            text-transform: uppercase;
            color: #ff65b2;
            letter-spacing: 2px;
            line-height: 1.2;
            white-space: nowrap;
        }

        h3 {
            margin: 0;
            line-height: 1.1;
            font-size: 1.15rem;
            overflow-wrap: normal;
        }

        svg {
            width: 15px;
            height: 15px;
            color: #ccc;
            vertical-align: -0.08em;
        }

        span {
            display: block;
            color: #ccc;
            line-height: 1.25;
        }
    }

    @media (max-width: 480px) {
        align-items: flex-start;
        padding: 1rem 1rem 0.5rem 1rem;

        img {
            width: 58px;
            height: 58px;
            margin-right: 0.85rem;
        }

        div {
            sub {
                font-size: 0.68rem;
                letter-spacing: 0.15em;
                white-space: normal;
            }

            h3 {
                font-size: 1.25rem;
                overflow-wrap: anywhere;
            }

            span {
                font-size: 1rem;
            }
        }
    }
`;

const Content = styled.div`
    padding: 0.35rem 1rem 1rem 1rem;
    box-sizing: border-box;

    p {
        margin: 0;
        color: hsl(var(--primary-200));
        line-height: 1.35;
    }
`;

export default Work;
