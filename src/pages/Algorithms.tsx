import { useEffect, useMemo, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import PageWrapper from "./PageWrapper";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

type TabId = "med" | "cky";

const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

const sanitizeLettersNumbersSpaces = (value: string) => value.replace(/[^a-zA-Z0-9 ]/g, "");

const sanitizeGrammarInput = (value: string) => value.replace(/[^a-zA-Z0-9\s\-|>]/g, "");

const Icon = ({ name }: { name: "play" | "pause" | "reset" | "step" | "sparkles" | "info" }) => {
    const common = {
        width: 16,
        height: 16,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "butt" as const,
        strokeLinejoin: "round" as const,
    };

    if (name === "play") return <svg {...common}><polygon points="6 3 20 12 6 21 6 3" /></svg>;
    if (name === "pause") return <svg {...common}><line x1="8" y1="4" x2="8" y2="20" /><line x1="16" y1="4" x2="16" y2="20" /></svg>;
    if (name === "reset") return <svg {...common}><polyline points="1 4 1 10 7 10" /><path d="M3.5 15a9 9 0 1 0 2.2-9.2L1 10" /></svg>;
    if (name === "step") return <svg {...common}><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>;
    if (name === "sparkles") return <svg {...common}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /><path d="M5 17l.8 2.2L8 20l-2.2.8L5 23l-.8-2.2L2 20l2.2-.8L5 17z" /></svg>;
    return <svg {...common}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
};

const usePlayer = (
    step: number,
    setStep: Dispatch<SetStateAction<number>>,
    maxStep: number,
    playing: boolean,
    setPlaying: Dispatch<SetStateAction<boolean>>,
    speed: number
) => {
    useEffect(() => {
        if (!playing) return undefined;
        if (step >= maxStep) {
            setPlaying(false);
            return undefined;
        }

        const id = window.setTimeout(() => setStep((s) => Math.min(maxStep, s + 1)), speed);
        return () => window.clearTimeout(id);
    }, [playing, step, maxStep, setStep, setPlaying, speed]);
};

const MiniDropdown = ({
    value,
    options,
    onChange,
    compact = false,
}: {
    value: number;
    options: Array<{ value: number; label: string }>;
    onChange: (value: number) => void;
    compact?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const selected = options.find((option) => option.value === value) || options[0];

    return (
        <DropdownWrap className={compact ? "compact" : ""}>
            <DropdownButton type="button" onClick={() => setOpen((current) => !current)}>
                {selected.label}
                <span aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                            d="M2 3.5L5 6.5L8 3.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="butt"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </DropdownButton>

            {open && (
                <DropdownMenu>
                    {options.map((option) => (
                        <DropdownOption
                            key={option.value}
                            type="button"
                            className={option.value === value ? "active" : ""}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </DropdownOption>
                    ))}
                </DropdownMenu>
            )}
        </DropdownWrap>
    );
};

const Controls = ({
    step,
    maxStep,
    playing,
    setPlaying,
    setStep,
    speed,
    setSpeed,
}: {
    step: number;
    maxStep: number;
    playing: boolean;
    setPlaying: (playing: boolean) => void;
    setStep: Dispatch<SetStateAction<number>>;
    speed: number;
    setSpeed: (speed: number) => void;
}) => (
    <ControlRow>
        <ToolButton onClick={() => { setPlaying(false); setStep(0); }}>
            <Icon name="reset" /> Reset
        </ToolButton>
        <ToolButton disabled={step <= 0} onClick={() => { setPlaying(false); setStep(Math.max(0, step - 1)); }}>
            Back
        </ToolButton>
        <PrimaryButton disabled={maxStep === 0} onClick={() => setPlaying(!playing)}>
            <Icon name={playing ? "pause" : "play"} /> {playing ? "Pause" : "Play"}
        </PrimaryButton>
        <ToolButton disabled={step >= maxStep} onClick={() => { setPlaying(false); setStep(Math.min(maxStep, step + 1)); }}>
            <Icon name="step" /> Step
        </ToolButton>
        <MiniDropdown
            value={speed}
            onChange={setSpeed}
            options={[
                { value: 1300, label: "Slow" },
                { value: 850, label: "Normal" },
                { value: 450, label: "Fast" },
            ]}
        />
    </ControlRow>
);

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
    <FieldBlock>
        <label>{label}</label>
        {children}
    </FieldBlock>
);

// ---------------- MED ----------------
type MedStep = {
    type: "init" | "fill";
    r: number;
    c: number;
    note: string;
    left?: number;
    below?: number;
    diag?: number;
    val?: number;
};

function buildMED(source: string, target: string, subCost = 2) {
    const s = source.trim();
    const t = target.trim();
    const rows = t.length + 1;
    const cols = s.length + 1;
    const D = Array.from({ length: rows }, () => Array<number | null>(cols).fill(null));
    const steps: MedStep[] = [];

    D[0][0] = 0;
    steps.push({ type: "init", r: 0, c: 0, note: "Start with empty string to empty string = 0." });

    for (let c = 1; c < cols; c += 1) {
        D[0][c] = c;
        steps.push({ type: "init", r: 0, c, note: `Bottom boundary: ${c} edits from ${s.slice(0, c)} to empty.` });
    }

    for (let r = 1; r < rows; r += 1) {
        D[r][0] = r;
        steps.push({ type: "init", r, c: 0, note: `Left boundary: ${r} edits from empty to ${t.slice(0, r)}.` });
    }

    for (let c = 1; c < cols; c += 1) {
        for (let r = 1; r < rows; r += 1) {
            const same = s[c - 1] === t[r - 1];
            const left = Number(D[r][c - 1]) + 1;
            const below = Number(D[r - 1][c]) + 1;
            const diag = Number(D[r - 1][c - 1]) + (same ? 0 : subCost);
            const val = Math.min(left, below, diag);
            D[r][c] = val;
            steps.push({
                type: "fill",
                r,
                c,
                left,
                below,
                diag,
                val,
                note: same
                    ? `Characters match (${s[c - 1]} = ${t[r - 1]}), so diagonal adds 0. min(${left}, ${below}, ${diag}) = ${val}.`
                    : `Characters differ (${s[c - 1]} ≠ ${t[r - 1]}), so diagonal adds ${subCost}. min(${left}, ${below}, ${diag}) = ${val}.`,
            });
        }
    }

    return { D, steps, source: s, target: t };
}

const MEDVisualizer = () => {
    const [source, setSource] = useState("graffe");
    const [target, setTarget] = useState("giraffe");
    const [subCost, setSubCost] = useState(2);
    const [step, setStep] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(850);

    const data = useMemo(() => buildMED(source, target, subCost), [source, target, subCost]);
    const maxStep = data.steps.length;
    usePlayer(step, setStep, maxStep, playing, setPlaying, speed);
    useEffect(() => { setStep(0); setPlaying(false); }, [source, target, subCost]);

    const active = data.steps[Math.max(0, step - 1)];
    const grid = Array.from({ length: data.target.length + 1 }, () => Array<number | null>(data.source.length + 1).fill(null));
    data.steps.slice(0, step).forEach((current) => { grid[current.r][current.c] = data.D[current.r][current.c]; });

    return (
        <ToolLayout>
            <Panel>
                <PanelTitle>Minimum Edit Distance</PanelTitle>
                <PanelText>Counts the minimum number of operations required to transform one string into the other, also known as Levenshtein distance.</PanelText>
                <Field label="Source Word"><Input value={source} onChange={(event) => setSource(sanitizeLettersNumbersSpaces(event.target.value))} /></Field>
                <Field label="Target Word"><Input value={target} onChange={(event) => setTarget(sanitizeLettersNumbersSpaces(event.target.value))} /></Field>
                <Field label="Substitution Cost">
                    <MiniDropdown
                        compact
                        value={subCost}
                        onChange={setSubCost}
                        options={[
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                        ]}
                    />
                </Field>
                <Controls step={step} maxStep={maxStep} playing={playing} setPlaying={setPlaying} setStep={setStep} speed={speed} setSpeed={setSpeed} />
                <FormulaHint>
                    <Icon name="info" />

                    <HintText>
                        For every column <InlineMath math="1" /> to <InlineMath math="i" />, for every row <InlineMath math="1" /> to <InlineMath math="j" /> :
                    </HintText>

                    <FormulaCenter>
                        <BlockMath
                            math={String.raw`
                D(i, \:j)=\min
                \begin{cases}
                D(i - 1, \: j)+1 & \\
                D(i, \:j - 1)+1 & \\
                D(i - 1, \: j - 1) +
                \begin{cases}
                2 & \text{if } s_i \mathrel{\not=} t_j \\
                0 & \text{otherwise}
                \end{cases}
                \end{cases}
                `}
                        />
                    </FormulaCenter>
                </FormulaHint>
            </Panel>

            <Panel wide>
                <ScrollArea>
                    <MedGrid style={{ gridTemplateColumns: `44px repeat(${data.source.length + 1}, 54px)` }}>
                        {Array.from({ length: data.target.length + 1 }).map((_, displayR) => {
                            const r = data.target.length - displayR;
                            return (
                                <FragmentLike key={`row-${r}`}>
                                    <AxisLabel>{r === 0 ? "" : data.target[r - 1]}</AxisLabel>
                                    {Array.from({ length: data.source.length + 1 }).map((__, c) => {
                                        const isActive = Boolean(active && active.r === r && active.c === c);
                                        const isNeighbor = Boolean(active && active.type === "fill" && (
                                            (active.r === r && active.c - 1 === c) ||
                                            (active.r - 1 === r && active.c === c) ||
                                            (active.r - 1 === r && active.c - 1 === c)
                                        ));
                                        return (
                                            <MedCell key={`cell-${r}-${c}`} className={cx(isActive && "active", isNeighbor && "neighbor")}>
                                                {grid[r][c] ?? ""}
                                            </MedCell>
                                        );
                                    })}
                                </FragmentLike>
                            );
                        })}
                        <div />
                        <div />
                        {Array.from(data.source).map((ch, index) => (
                            <AxisLabel key={`s-bottom-${index}`}>{ch}</AxisLabel>
                        ))} 
                    </MedGrid>
                </ScrollArea>
                <Explanation><strong>Explanation (<StepCounter>Step {step}/{maxStep}</StepCounter>)</strong><br />{active?.note || "Press Step or Play to start filling the chart."}</Explanation>
            </Panel>
        </ToolLayout>
    );
};

const FragmentLike = ({ children }: { children: ReactNode }) => <>{children}</>;

// ---------------- CKY ----------------
type GrammarRule = { lhs: string; rhs: string[] };
type BinaryRule = { lhs: string; a: string; b: string };

type CKYCellRef = { i: number; j: number };

type CKYSplitAttempt = {
    k: number;
    left: CKYCellRef;
    right: CKYCellRef;
    leftCats: string[];
    rightCats: string[];
    matches: string[];
    label: string;
};

type CKYStep = {
    span: number;
    i: number;
    j: number;
    cats: string[];
    note: string;
    tries?: string[];
    splitAttempts?: CKYSplitAttempt[];
};

function parseGrammar(text: string) {
    const rules: GrammarRule[] = [];
    const lex: Record<string, string[]> = {};
    const binary: BinaryRule[] = [];

    text.split(/\n+/).map((x) => x.trim()).filter(Boolean).forEach((line) => {
        const cleaned = line.replace(/#.*$/, "").trim();
        if (!cleaned || !cleaned.includes("->")) return;
        const [lhsRaw, rhsRaw] = cleaned.split("->").map((x) => x.trim());
        rhsRaw.split("|").map((x) => x.trim()).filter(Boolean).forEach((rhs) => {
            const parts = rhs.split(/\s+/);
            rules.push({ lhs: lhsRaw, rhs: parts });
            if (parts.length === 1) {
                lex[parts[0]] = lex[parts[0]] || [];
                lex[parts[0]].push(lhsRaw);
            }
            if (parts.length === 2) binary.push({ lhs: lhsRaw, a: parts[0], b: parts[1] });
        });
    });

    return { rules, lex, binary };
}

const defaultCKYGrammar = `S -> NP VP
VP -> TV NP | VP PP
NP -> DT N | Tom | Australia
N -> N PP | friend
PP -> P NP
TV -> saw | friend
DT -> a
P -> from
N -> saw`;

function buildCKY(sentence: string, grammarText: string) {
    const words = sentence.trim().split(/\s+/).filter(Boolean);
    const G = parseGrammar(grammarText);
    const n = words.length;
    const chart = Array.from({ length: n }, () => Array.from({ length: n }, () => [] as string[]));
    const steps: CKYStep[] = [];

    for (let i = 0; i < n; i += 1) {
        const cats = [...(G.lex[words[i]] || []), ...(G.lex[words[i].toLowerCase()] || [])];
        chart[i][i] = Array.from(new Set<string>(cats));
        steps.push({ span: 1, i, j: i, cats: chart[i][i], note: `Lexical cell for “${words[i]}”: ${chart[i][i].length ? chart[i][i].join(", ") : "no category found"}.` });
    }

    for (let span = 2; span <= n; span += 1) {
        for (let i = 0; i <= n - span; i += 1) {
            const j = i + span - 1;
            const added: string[] = [];
            const tries: string[] = [];
            const splitAttempts: CKYSplitAttempt[] = [];

            for (let k = i; k < j; k += 1) {
                const left = chart[i][k];
                const right = chart[k + 1][j];
                const matchesForSplit: string[] = [];

                left.forEach((A) => right.forEach((B) => {
                    const matches = G.binary.filter((rule) => rule.a === A && rule.b === B);
                    tries.push(`[${words.slice(i, k + 1).join(" ")}] ${A} + [${words.slice(k + 1, j + 1).join(" ")}] ${B}`);
                    matches.forEach((match) => {
                        const matchText = `${match.lhs} -> ${A} ${B}`;
                        if (!matchesForSplit.includes(matchText)) matchesForSplit.push(matchText);

                        if (!chart[i][j].includes(match.lhs)) {
                            chart[i][j].push(match.lhs);
                            added.push(`${match.lhs} from ${A} ${B} using ${match.lhs} -> ${A} ${B}`);
                        }
                    });
                }));

                splitAttempts.push({
                    k,
                    left: { i, j: k },
                    right: { i: k + 1, j },
                    leftCats: Array.from(left),
                    rightCats: Array.from(right),
                    matches: matchesForSplit,
                    label: `${words.slice(i, k + 1).join(" ")} | ${words.slice(k + 1, j + 1).join(" ")}`,
                });
            }
            steps.push({
                span,
                i,
                j,
                cats: Array.from(chart[i][j]),
                tries,
                splitAttempts,
                note: added.length ? `Added ${added.join("; ")}.` : "No matching binary rule for this span.",
            });
        }
    }

    return { words, chart, steps };
}

const CKYVisualizer = () => {
    const [sentence, setSentence] = useState("Tom saw a friend from Australia");
    const [grammar, setGrammar] = useState(defaultCKYGrammar);
    const [step, setStep] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(850);
    const data = useMemo(() => buildCKY(sentence, grammar), [sentence, grammar]);
    const maxStep = data.steps.length;
    usePlayer(step, setStep, maxStep, playing, setPlaying, speed);
    useEffect(() => { setStep(0); setPlaying(false); }, [sentence, grammar]);

    const active = data.steps[Math.max(0, step - 1)];
    const n = data.words.length;
    const display = Array.from({ length: n }, () => Array.from({ length: n }, () => [] as string[]));
    data.steps.slice(0, step).forEach((current) => { display[current.i][current.j] = current.cats; });

    const activeLeftCells = new Set((active?.splitAttempts || []).map((attempt) => `${attempt.left.i}-${attempt.left.j}`));
    const activeRightCells = new Set((active?.splitAttempts || []).map((attempt) => `${attempt.right.i}-${attempt.right.j}`));

    return (
        <ToolLayout>
            <Panel>
                <PanelTitle>Cocke-Younger-Kasami Parse Chart</PanelTitle>
                <PanelText>Determine if a string can be generated by a specific context-free grammar, and, if so, find all possible parse trees.</PanelText>
                <Field label="Sentence"><Input value={sentence} onChange={(event) => setSentence(sanitizeLettersNumbersSpaces(event.target.value))} /></Field>
                <Field label="Grammar"><TextArea value={grammar} onChange={(event) => setGrammar(sanitizeGrammarInput(event.target.value))} rows={12} /></Field>
                <Controls step={step} maxStep={maxStep} playing={playing} setPlaying={setPlaying} setStep={setStep} speed={speed} setSpeed={setSpeed} />
                {/* <Hint><Icon name="info" /> Pink is the cell being filled. Blue cells are the left side of the attempted splits, and purple cells are the right side. If a rule like X -&gt; Y Z matches, X goes into the pink cell.</Hint> */}
            </Panel>
            <Panel wide>
                <ScrollArea>
                    <CkyGrid style={{ gridTemplateColumns: `90px repeat(${n}, 122px)` }}>
                        {Array.from({ length: n }).map((_, spanIndex) => {
                            const span = n - spanIndex;
                            return (
                                <FragmentLike key={`span-${span}`}>
                                    <StateLabel>Span {span}</StateLabel>

                                    {Array.from({ length: n }).map((__, i) => {
                                        const j = i + span - 1;

                                        if (j >= n) {
                                            return <EmptyCell key={`empty-${span}-${i}`} />;
                                        }

                                        const isActive = Boolean(active && active.i === i && active.j === j);
                                        const cellKey = `${i}-${j}`;
                                        const isLeftSource = activeLeftCells.has(cellKey);
                                        const isRightSource = activeRightCells.has(cellKey);

                                        return (
                                            <CkyCell
                                                key={`cky-${i}-${j}`}
                                                className={cx(
                                                    isActive && "active",
                                                    !isActive && isLeftSource && isRightSource && "sourceBoth",
                                                    !isActive && isLeftSource && !isRightSource && "sourceLeft",
                                                    !isActive && isRightSource && !isLeftSource && "sourceRight"
                                                )}
                                            >
                                                {display[i][j].length ? display[i][j].join(", ") : "—"}
                                            </CkyCell>
                                        );
                                    })}
                                </FragmentLike>
                            );
                        })}

                        <StateLabel />
                        {data.words.map((word, index) => (
                            <BottomWordLabel key={`word-bottom-${index}`}>{word}</BottomWordLabel>
                        ))}
                    </CkyGrid>
                </ScrollArea>
                <Explanation>
                    <strong>Explanation (<StepCounter>Step {step}/{maxStep}</StepCounter>)</strong><br />{active?.note || "Press Step or Play to begin."}
                </Explanation>
            </Panel>
        </ToolLayout>
    );
};


const Algorithms = () => {
    const [tab, setTab] = useState<TabId>("med");
    const tabs: Array<{ id: TabId; label: string; description: string }> = [
        { id: "med", label: "Minimum Edit Distance", description: "Levenshtein distance between two words" },
        { id: "cky", label: "Cocke–Younger–Kasami", description: "Parsing algorithm on a sentence" },
    ];

    return (
        <PageWrapper>
            <MathStyleFix>
                <Helmet>
                    <title>Algorithms</title>
                </Helmet>
                <ToolsHeader>
                    <h1>Algorithms</h1>
                </ToolsHeader>
                <Tabs>
                    {tabs.map((item) => (
                        <TabButton key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>
                            <strong>{item.label}</strong>
                            <span>{item.description}</span>
                        </TabButton>
                    ))}
                </Tabs>
                {tab === "med" ? <MEDVisualizer /> : <CKYVisualizer />}
            </MathStyleFix>
        </PageWrapper>
    );
};

const MathStyleFix = styled.div`
    .katex {
        margin: 0 0 1rem;
        color: hsl(var(--primary-200));
        font-size: 0.96rem;
        font-weight: 400;
        line-height: 1.6;
        letter-spacing: 0;
        opacity: 0.86;
    }

    .katex .mtext {
        margin: 0 0 1rem;
        color: hsl(var(--primary-200));
        font-family: inherit;
        font-size: 0.96rem;
        font-weight: 400;
        line-height: 1.6;
        letter-spacing: 0;
        opacity: 0.86;
    }
`;

const DropdownButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    border: 1px solid hsl(var(--primary-800));
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
    padding: 0.6rem 0.85rem;
    cursor: pointer;
    transition: 0.18s ease;

    font-family: inherit;
    font-size: 0.92rem;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: 0;

    span {
        color: hsl(var(--primary-200));
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
    }

    &:hover {
        border-color: rgba(255, 255, 255, 0.35);
        background: rgba(255, 255, 255, 0.08);
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: calc(100% + 0.45rem);
    left: 0;
    z-index: 20;
    min-width: 8rem;
    padding: 0.35rem;
    border: 1px solid hsl(var(--primary-800));
    border-radius: 14px;
    background: rgba(12, 12, 14, 0.96);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(10px);
`;

const DropdownOption = styled.button`
    width: 100%;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: hsl(var(--primary-200));
    padding: 0.55rem 0.7rem;
    text-align: left;
    cursor: pointer;

    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 1.3;
    letter-spacing: 0;

    &:hover {
        background: rgba(255, 255, 255, 0.07);
        color: #fff;
    }

    &.active {
        background: rgba(255, 101, 178, 0.18);
        color: #fff;
    }
`;

const DropdownWrap = styled.div`
    position: relative;
    display: inline-flex;

    &.compact {
        width: fit-content;
    }

    &.compact ${DropdownButton} {
        min-width: 4.25rem;
        justify-content: center;
    }

    &.compact ${DropdownMenu} {
        min-width: 4.25rem;
        right: auto;
        left: 0;
    }

    &.compact ${DropdownOption} {
        text-align: center;
        padding: 0.55rem 0.45rem;
    }
`;

const ToolsHeader = styled.div`
    max-width: 900px;
    margin-bottom: 1.5rem;

    h1 {
        margin-bottom: 0.35rem;
    }

    p {
        margin-top: 0;
        line-height: 1.6;
    }
`;


const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 350px));
    justify-content: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

const TabButton = styled.button`
    border: 1px solid hsl(var(--primary-800));
    background: rgba(255, 255, 255, 0.03);
    color: hsl(var(--primary-200));
    border-radius: 18px;
    padding: 1rem;
    text-align: left;
    cursor: pointer;
    transition: 0.2s ease;

    font: inherit;
    font-family: inherit;
    letter-spacing: normal;
    text-transform: none;
    -webkit-font-smoothing: inherit;
    text-rendering: inherit;

    strong {
        display: block;
        color: #fff;
        margin-bottom: 0.3rem;
        font-family: inherit;
        font-size: 1rem;
        font-weight: 650;
        line-height: 1.25;
        letter-spacing: 0;
    }

    span {
        display: block;
        font-family: inherit;
        font-size: 0.92rem;
        font-weight: 400;
        line-height: 1.45;
        letter-spacing: 0;
        color: hsl(var(--primary-200));
        opacity: 0.82;
    }

    &:hover, &.active {
        transform: translateY(-1px);
        border-color: rgba(255, 101, 178, 0.55);
        background: rgba(255, 101, 178, 0.12);
    }
`;

const ToolLayout = styled.div`
    display: grid;
    grid-template-columns: minmax(360px, 520px) minmax(0, 1fr);
    gap: 1rem;
    align-items: start;

    @media (max-width: 1100px) {
        grid-template-columns: 1fr;
    }
`;

const Panel = styled.div<{ wide?: boolean }>`
    border: 1px solid hsl(var(--primary-800));
    border-radius: 22px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.035);
    backdrop-filter: blur(8px);
    min-width: 0;
`;

const PanelTitle = styled.h2`
    margin: 0 0 0.35rem;
    font-size: 1.25rem;
`;

const PanelText = styled.p`
    margin: 0 0 1rem;
    color: hsl(var(--primary-200));
    font-family: inherit;
    font-size: 0.96rem;
    font-weight: 400;
    line-height: 1.6;
    letter-spacing: 0;
    opacity: 0.86;
`;

const FieldBlock = styled.div`
    margin-bottom: 0.85rem;

    label {
        display: block;
        color: #fff;
        font-family: inherit;
        font-size: 0.92rem;
        font-weight: 600;
        line-height: 1.3;
        letter-spacing: 0;
        margin-bottom: 0.4rem;
    }
`;

const Input = styled.input`
    width: 100%;
    box-sizing: border-box;
    border: 1px solid hsl(var(--primary-800));
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.35);
    color: #fff;
    padding: 0.7rem 0.8rem;
    outline: none;

    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 400;
    line-height: 1.45;
    letter-spacing: 0;

    &::placeholder {
        color: hsl(var(--primary-300));
        opacity: 0.65;
    }

    &:focus {
        border-color: rgba(255, 101, 178, 0.7);
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    box-sizing: border-box;
    border: 1px solid hsl(var(--primary-800));
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.35);
    color: #fff;
    padding: 0.7rem 0.8rem;
    outline: none;
    resize: vertical;

    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.86rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;

    &:focus {
        border-color: rgba(255, 101, 178, 0.7);
    }
`;


const ControlRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
`;

const ToolButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid hsl(var(--primary-800));
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
    border-radius: 999px;
    padding: 0.6rem 0.85rem;
    cursor: pointer;
    transition: 0.18s ease;

    font-family: inherit;
    font-size: 0.92rem;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: 0;

    &:hover:not(:disabled) {
        border-color: rgba(255, 255, 255, 0.35);
        background: rgba(255, 255, 255, 0.08);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.45;
    }
`;

const PrimaryButton = styled(ToolButton)`
    border-color: rgba(255, 101, 178, 0.7);
    background: rgba(255, 101, 178, 0.2);
`;

const StepCounter = styled.span`
    color: hsl(var(--primary-200));
    font-size: 0.9rem;
`;

const FormulaHint = styled.div`
    position: relative;
    color: hsl(var(--primary-200));
    border: 1px solid hsl(var(--primary-800));
    border-radius: 16px;
    padding: 0.75rem;

    font-family: inherit;
    font-size: 0.92rem;
    font-weight: 400;
    line-height: 1.45;
    letter-spacing: 0;
    opacity: 0.9;

    > svg {
        position: absolute;
        top: 1.0rem;
        left: 0.85rem;
        width: 16px;
        height: 16px;
    }
`;

const HintText = styled.div`
    padding-left: 1.6rem;
    margin-bottom: 0.5rem;
`;

const FormulaCenter = styled.div<{ $nudge?: number }>`
    width: 100%;
    display: flex;
    justify-content: center;

    .katex-display {
        margin: 0;
        width: fit-content;
        transform: translateX(${({ $nudge = 12 }) => $nudge}px);
    }
`;

const Hint = styled.div`
    display: flex;
    gap: 0.5rem;
    color: hsl(var(--primary-200));
    border: 1px solid hsl(var(--primary-800));
    border-radius: 16px;
    padding: 0.75rem;

    font-family: inherit;
    font-size: 0.92rem;
    font-weight: 400;
    line-height: 1.45;
    letter-spacing: 0;
    opacity: 0.9;

    > svg {
        flex: 0 0 16px;
        width: 16px;
        height: 16px;
        margin-top: 0.2rem;
    }
`;

const ScrollArea = styled.div`
    width: 100%;
    overflow: auto;
    padding-bottom: 0.5rem;
`;

const MedGrid = styled.div`
    display: inline-grid;
    gap: 0.35rem;
    align-items: center;
`;

const AxisLabel = styled.div`
    color: #fff;
    font-family: inherit;
    font-size: 0.92rem;
    font-weight: 650;
    line-height: 1.25;
    letter-spacing: 0;
    text-align: center;
    min-height: 24px;
`;

const BottomWordLabel = styled(AxisLabel)`
    padding-top: 0.6rem;
`;

const StateLabel = styled(AxisLabel)`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: hsl(var(--primary-200));
    font-size: 0.86rem;
    font-weight: 600;
`;

const EmptyCell = styled.div``;

const MedCell = styled.div`
    height: 48px;
    width: 48px;
    border: 1px solid hsl(var(--primary-800));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: #fff;
    background: rgba(255, 255, 255, 0.045);
    font-family: inherit;
    letter-spacing: 0;

    &.neighbor {
        background: rgba(255, 255, 255, 0.16);
    }

    &.active {
        background: #ff65b2;
        color: #000;
        border-color: #ff65b2;
    }
`;

const Explanation = styled.div`
    margin-top: 1rem;
    border: 1px solid hsl(var(--primary-800));
    border-radius: 16px;
    padding: 0.85rem;
    color: hsl(var(--primary-200));

    font-family: inherit;
    font-size: 0.94rem;
    font-weight: 400;
    line-height: 1.55;
    letter-spacing: 0;
    opacity: 0.9;

    strong {
        color: #fff;
        font-weight: 650;
        letter-spacing: 0;
    }
`;

const SmallNote = styled.div`
    margin-top: 0.6rem;
    font-size: 0.82rem;
`;


const CkyGrid = styled.div`
    display: inline-grid;
    gap: 0.5rem;
`;

const CkyCell = styled.div`
    min-height: 41px;
    border: 1px solid hsl(var(--primary-800));
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.04);
    color: hsl(var(--primary-200));
    padding: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 0.82rem;
    font-weight: 700;
    font-family: inherit;
    letter-spacing: 0;

    &.sourceLeft {
        background: rgba(59, 130, 246, 0.18);
        border-color: rgba(59, 130, 246, 0.75);
        color: #fff;
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.28) inset;
    }

    &.sourceRight {
        background: rgba(168, 85, 247, 0.18);
        border-color: rgba(168, 85, 247, 0.75);
        color: #fff;
        box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.28) inset;
    }

    &.sourceBoth {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.24), rgba(168, 85, 247, 0.24));
        border-color: rgba(125, 110, 246, 0.8);
        color: #fff;
        box-shadow: 0 0 0 1px rgba(125, 110, 246, 0.3) inset;
    }

    &.active {
        background: rgba(255, 101, 178, 0.26);
        border-color: rgba(255, 101, 178, 0.8);
        color: #fff;
        box-shadow: 0 0 0 1px rgba(255, 101, 178, 0.35) inset;
    }
`;


export default Algorithms;