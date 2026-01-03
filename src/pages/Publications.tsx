import PageWrapper from "./PageWrapper";
import { Helmet } from "react-helmet";
import Publication from "../components/Publication";

const Publications = () => {
    return (
        <PageWrapper>
            <Helmet>
                <title>Publications</title>
            </Helmet>

            <h1>Publications</h1>

            <Publication
                title    = "Endogenous retroelement expression in modeled airway epithelial repair"
                authors  = "Stephanie Michael, Nicholas Liotta, Tongyi Fei, Matthew L. Bendall, Douglas F. Nixon, Nicholas Dopkins"
                year     = {2024}
                journal  = "Microbes and Infection"
                doi      = "10.1016/j.micinf.2024.105465"
                abstract ="Cystic fibrosis (CF) is an autosomal recessive genetic disorder characterized by impairment of the CF transmembrane conductance regulator (CFTR) via gene mutation. CFTR is expressed at the cellular membrane of epithelial cells and functions as an anion pump which maintains water and salt ion homeostasis. In pulmonary airways of CF patients, pathogens such as P. aeruginosa and subsequent uncontrolled inflammation damage the human airway epithelial cells (HAECs) and can be life-threatening. We previously identified that inhibiting endogenous retroelement (ERE) reverse transcriptase can hamper the inflammatory response to bacterial flagella in THP-1 cells. Here, we investigate how ERE expression is sensitive to HAEC repair and toll-like receptor 5 (TLR5) activation, a primary mechanism by which inflammation impacts disease outcome. Our results demonstrate that several human endogenous retroviruses (HERVs) and long interspersed nuclear elements (LINEs) fluctuate throughout the various stages of repair and that TLR5 activation further influences ERE expression. By considering the impact of the most common CF mutation F508del/F508del on ERE expression in unwounded HAECs, we also found that two specific EREs, L1FLnI_2p23.1c and HERVH_10p12.33, were downregulated in CF-derived HAECs. Collectively, we show that ERE expression in HAECs is sensitive to certain modalities reflective of CF pathogenesis, and specific EREs may be indicative of CF disease state and pathogenesis."
            />

            <Publication
                title    = "Endogenous retroelement expression in the gut microenvironment of people living with HIV-1"
                authors  = "Nicholas Dopkins, Tongyi Fei, Stephanie Michael, Nicholas Liotta, Kejun Guo, Kaylee L. Mickens, Brad S. Barrett, Matthew L. Bendall, Stephanie M. Dillon, Cara C. Wilson, Mario L. Santiago, Douglas F. Nixon"
                year     = {2024}
                journal  = "eBioMedicine"
                doi      = "10.1016/j.ebiom.2024.105133"
                abstract = "Endogenous retroelements (EREs), including human endogenous retroviruses (HERVs) and long interspersed nuclear elements (LINEs), comprise almost half of the human genome. Our previous studies of the interferome in the gut suggest potential mechanisms regarding how IFNb may drive HIV-1 gut pathogenesis. As ERE activity is suggested to partake in type 1 immune responses and is incredibly sensitive to viral infections, we sought to elucidate underlying interactions between ERE expression and gut dynamics in people living with HIV-1 (PLWH). ERE expression profiles from bulk RNA sequencing of colon biopsies and PBMC were compared between a cohort of PLWH not on antiretroviral therapy (ART) and uninfected controls. We found 59 EREs differentially expressed in the colon of PLWH when compared to uninfected controls (padj <0.05 and FC ≤ -1 or ≥ 1), with 12 downregulated and 47 upregulated. Colon expression of the ERE loci LTR19_12p13.31 and L1FLnI_1q23.1s showed significant correlations with certain gut immune cell subset frequencies, and L1FLnI_1q23.1s was also significantly upregulated in peripheral blood mononuclear cells (PBMCs) of PLWH, suggesting a common mechanism of differential ERE expression across tissues. These findings indicate that ERE activity is deregulated in the colon of PLWH, supporting the hypothesis that specific EREs could serve as biomarkers and potential mediators of pathogenesis in HIV-1 reservoirs."
            />

            <Publication
                title    = "SARS-CoV-2 variants evolve convergent strategies to remodel the host response"
                authors  = "Mehdi Bouhaddou, Ann-Kathrin Reuschl, Benjamin J. Polacco, Lucy G. Thorne, Manisha R. Ummadi, Chengjin Ye, Romel Rosales, Adrian Pelin, Jyoti B. Batra, Gwendolyn M. Jang, Jiewei Xu, Jack M. Moen, Alicia L. Richards, Yuan Zhou, Bhavya Harjai, Erica Stevenson, Ajda Rojc, Roberta Ragazzini, Matthew VX. Whelan, Wilhelm Furnon, Giuditta De Lorenzo, Vanessa Cowton, Abdullah M. Syed, Alison Ciling, Noa Deutsch, Daniel Pirak, Giulia Dowgier, Dejan Mesner, Jane L. Turner, Briana L. McGovern, M. Luis Rodriguez, Rocio Leiva-Rebollo, Alistair S. Dunham, Xiaofang Zhong, Manon Eckhardt, Andrea Fossati, Nicholas F. Liotta, Thomas Kehrer, Anastasija Cupic, Magdalena Rutkowska, Ignacio Mena, Sadaf Aslam, Alyssa Hoffert, Helene Foussard, Charles Ochieng’Olwal, Weiqing Huang, Thomas Zwaka, John Pham, Molly Lyons, Laura Donohue, Aliesha Griffin, Rebecca Nugent, Kevin Holden, Robert Deans, Pablo Aviles, Jose A. Lopez-Martin, Jose M. Jimeno, Kirsten Obernier, Jacqueline M. Fabius, Margaret Soucheray, Ruth Hüttenhain, Irwin Jungreis, Manolis Kellis, Ignacia Echeverria, Kliment Verba, Paola Bonfanti, Pedro Beltrao, Roded Sharan, Jennifer A. Doudna, Luis Martinez-Sobrido, Arvind H. Patel, Massimo Palmarini, Lisa Miorin, Kris White, Danielle L. Swaney, Adolfo Garcia-Sastre, Clare Jolly, Lorena Zuliani-Alvarez, Greg J. Towers, Nevan J. Krogan"
                year     = {2023}
                journal  = "Cell"
                doi      = "10.1016/j.cell.2023.08.026"
                code     = "https://github.com/nickliotta/Krogan"
                abstract = "SARS-CoV-2 variants of concern (VOCs) emerged during the COVID-19 pandemic. Here, we used unbiased systems approaches to study the host-selective forces driving VOC evolution. We discovered that VOCs evolved convergent strategies to remodel the host by modulating viral RNA and protein levels, altering viral and host protein phosphorylation, and rewiring virus-host protein-protein interactions. Integrative computational analyses revealed that although Alpha, Beta, Gamma, and Delta ultimately converged to suppress interferon-stimulated genes (ISGs), Omicron BA.1 did not. ISG suppression correlated with the expression of viral innate immune antagonist proteins, including Orf6, N, and Orf9b, which we mapped to specific mutations. Later Omicron subvariants BA.4 and BA.5 more potently suppressed innate immunity than early subvariant BA.1, which correlated with Orf6 levels, although muted in BA.4 by a mutation that disrupts the Orf6-nuclear pore interaction. Our findings suggest that SARS-CoV-2 convergent evolution overcame human adaptive and innate immune barriers, laying the groundwork to tackle future pandemics."
            />

            <Publication
                title    = "Global landscape of the host response to SARS-CoV-2 variants reveals viral evolutionary trajectories"
                authors  = "Mehdi Bouhaddou, Ann-Kathrin Reuschl, Benjamin J. Polacco, Lucy G. Thorne, Manisha R. Ummadi, Chengjin Ye, Romel Rosales, Adrian Pelin, Jyoti B. Batra, Gwendolyn M. Jang, Jiewei Xu, Jack M. Moen, Alicia Richards, Yuan Zhou, Bhavya Harjai, Erica Stevenson, Ajda Rojc, Roberta Ragazzini, Matthew V.X. Whelan, Wilhelm Furnon, Giuditta De Lorenzo, Vanessa Cowton, Abdullah M. Syed, Alison Ciling, Noa Deutsch, Daniel Pirak, Giulia Dowgier, Dejan Mesner, Jane L. Turner, Briana L. McGovern, M. Luis Rodriguez, Rocio Leiva-Rebollo, Alistair S. Dunham, Xiaofang Zhong, Manon Eckhardt, Andrea Fossati, Nicholas Liotta, Thomas Kehrer, Anastasija Cupic, Magda Rutkowska, Nacho Mena, Sadaf Aslam, Alyssa Hoffert, Helene Foussard, John Pham, Molly Lyons, Laura Donahue, Aliesha Griffin, Rebecca Nugent, Kevin Holden, Robert Deans, Pablo Aviles, José Antonio López-Martín, Jose M. Jimeno, Kirsten Obernier, Jacqueline M. Fabius, Margaret Soucheray, Ruth Hüttenhain, Irwin Jungreis, Manolis Kellis, Ignacia Echeverria, Kliment Verba, Paola Bonfanti, Pedro Beltrao, Roded Sharan, Jennifer A. Doudna, Luis Martinez-Sobrido, Arvind Patel, Massimo Palmarini, Lisa Miorin, Kris White, Danielle L. Swaney, Adolfo García-Sastre, Clare Jolly, Lorena Zuliani-Alvarez, Greg J. Towers, Nevan J. Krogan"
                year     = {2022}
                journal  = "bioRxiv"
                doi      = "10.1101/2022.10.19.512927"
                code     = "https://github.com/nickliotta/Krogan"
                abstract = "A series of SARS-CoV-2 variants of concern (VOCs) have evolved in humans during the COVID-19 pandemic—Alpha, Beta, Gamma, Delta, and Omicron. Here, we used global proteomic and genomic analyses during infection to understand the molecular responses driving VOC evolution. We discovered VOC-specific differences in viral RNA and protein expression levels, including for N, Orf6, and Orf9b, and pinpointed several viral mutations responsible. An analysis of the host response to VOC infection and comprehensive interrogation of altered virus-host protein-protein interactions revealed conserved and divergent regulation of biological pathways. For example, regulation of host translation was highly conserved, consistent with suppression of VOC replication in mice using the translation inhibitor plitidepsin. Conversely, modulation of the host inflammatory response was most divergent, where we found Alpha and Beta, but not Omicron BA.1, antagonized interferon stimulated genes (ISGs), a phenotype that correlated with differing levels of Orf6. Additionally, Delta more strongly upregulated proinflammatory genes compared to other VOCs. Systematic comparison of Omicron subvariants revealed BA.5 to have evolved enhanced ISG and proinflammatory gene suppression that similarly correlated with Orf6 expression, effects not seen in BA.4 due to a mutation that disrupts the Orf6-nuclear pore interaction. Our findings describe how VOCs have evolved to fine-tune viral protein expression and protein-protein interactions to evade both innate and adaptive immune responses, offering a likely explanation for increased transmission in humans."
            />    
        </PageWrapper>
    );
};

export default Publications;
