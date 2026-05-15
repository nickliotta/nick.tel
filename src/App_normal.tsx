import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";

import Nav from "./components/Nav";
import Home from "./pages/Home";
import Experience from "./pages/Experience";
import Publications from "./pages/Publications";
import Posts from "./pages/Posts";
import Post from "./components/Post";

function App() {
    return (
        <Wrapper>
            <Helmet titleTemplate={'%s • Nicholas'}>
                <title>Nicholas Liotta</title>
            </Helmet>

            <MainContent
                transition={{ duration: 0.85 }}
                initial={false}
            >
                <Router>
                    <Nav />

                    <ContentWrapper>
                        <AnimatePresence>
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/where" component={Experience} />
                                <Route exact path="/publications" component={Publications} />
                                <Route exact path="/posts" component={Posts} />
                                <Route exact path="/posts/:slug" component={Post} />
                                {/* <Route exact path="/photography" component={Photography} /> */}
                            </Switch>
                        </AnimatePresence>
                    </ContentWrapper>
                </Router>
            </MainContent>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;

    canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 0;
    }
`;

const MainContent = styled(motion.div)`
    height: 100vh;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: row;
    overflow-y: auto;

    @media (max-width: 850px) {
        flex-direction: column;
        /* padding-top: 65px; */
    }
`;

const ContentWrapper = styled.div`
    margin-left: 15rem;
    padding: 2rem;
    width: 100%;
    box-sizing: border-box;
    font-size: 1rem;
    overflow-x: hidden;

    a {
        &:hover {
            text-decoration: underline;
        }
    }

    @media (max-width: 850px) {
        margin-left: 0px;
        padding-top: 65px;
    }
`;

export default App;
