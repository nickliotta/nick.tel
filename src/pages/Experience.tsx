import PageWrapper from "./PageWrapper";
import Work from "../components/Work";
import styled from "styled-components";
import Northwell from "../assets/images/northwell.png";
import ColdSpringHarborLaboratory from "../assets/images/cold-spring-harbor-laboratory.png";
import WeillCornell from "../assets/images/weill-cornell.webp";
import CarnegieMellonUniversity from "../assets/images/carnegie-mellon-university.png";
import GladstoneInstitutes from "../assets/images/gladstone-institutes.png";
import { Helmet } from "react-helmet";

const Experience = () => {
    const experiences = [
        {
            logo                    : Northwell,
            timeline                : "May 2024 - Present",
            company                 : "Northwell Health",
            department              : "Feinstein Institutes for Medical Research",
            location                : "Manhasset, New York",
            role                    : "Bioinformatician",
            website                 : "https://feinstein.northwell.edu/"
        },
        {
            logo                    : ColdSpringHarborLaboratory,
            timeline                : "January 2022 - Present",
            company                 : "Cold Spring Harbor Laboratory",
            department              : "Dolan Learning Center",
            location                : "Cold Spring Harbor, New York",
            role                    : "Head College Intern",
            website                 : "https://dnalc.cshl.edu/"
        },
        {
            logo                    : CarnegieMellonUniversity,
            timeline                : "May 2025 - August 2025",
            company                 : "Carnegie Mellon University",
            department              : "Department of Psychology",
            location                : "Pittsburgh, Pennsylvania",
            role                    : "Undergraduate Research Assistant",
            website                 : "https://www.cmu.edu/"
        },
        {
            logo                    : WeillCornell,
            timeline                : "February 2022 - April 2024",
            company                 : "Weill Cornell Medicine",
            department              : "Department of Medicine",
            location                : "New York, New York",
            role                    : "Undergraduate Research Assistant",
            website                 : "https://medicine.weill.cornell.edu/"
        },
        {
            logo                    : GladstoneInstitutes,
            timeline                : "January 2022 - August 2022",
            company                 : "University of California, San Francisco",
            department              : "Gladstone Institute",
            location                : "San Francisco, California",
            role                    : "Research Intern",
            website                 : "https://www.ucsf.edu/"
        }
    ];

    const current = experiences.filter(experience => experience.timeline.includes("Present"));
    const previous = experiences.filter(experience => !experience.timeline.includes("Present"));

    type WorkExperience = {
        logo                    : string;
        timeline                : string;
        company                 : string;
        department              : string;
        location                : string;
        role                    : string;
        website                 : string;
    };

    const renderWorkItems = (workList: WorkExperience[]) => {
        return workList.map((work: WorkExperience) => (
            <Work
                key={`${work.company}-${work.timeline}`}
                logo={work.logo}
                timeline={work.timeline}
                company={work.company}
                department={work.department}
                location={work.location}
                role={work.role}
                website={work.website}
            />
        ));
    };

    const renderCurrentWork = () => {
        if (current.length === 0) return <></>;
        return (
            <>
                <h3>Currently</h3>
                <WorkWrapper>
                    {renderWorkItems(current)}
                </WorkWrapper>
            </>
        );
    };

    const renderPreviousWork = () => {
        if (previous.length === 0) return <></>;
        return (
            <>
                <h3>Previously</h3>
                <WorkWrapper>
                    {renderWorkItems(previous)}
                </WorkWrapper>
            </>
        );
    };

    return (
        <PageWrapper>
            <Helmet>
                <title>Experience</title>
            </Helmet>

            <h1>Where I am</h1>
            {renderCurrentWork()}
            {renderPreviousWork()}
        </PageWrapper>
    );
};

const WorkWrapper = styled.div`
    display: grid;
    width: 100%;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(30em, 30em));
    align-items: stretch;
    margin-bottom: 2.5rem;

    @media (max-width: 1100px) {
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 30em), 30em));
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
    }
`;

export default Experience;