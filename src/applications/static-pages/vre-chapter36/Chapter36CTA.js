import React from 'react';

import { rootUrl as chapter36Url } from 'applications/vre/28-8832/manifest.json';

const EDUCATION_CAREER_COUNSELING_PATH = 'education-and-career-counseling';

const Chapter36CTA = () => {
  const isEducationAndCareerPage = window.location.href.includes(
    EDUCATION_CAREER_COUNSELING_PATH,
  );
  const content = (
    <>
      {!isEducationAndCareerPage ? <h2>How do I apply?</h2> : null}
      <a
        className="usa-button-primary va-button-primary"
        target="_self"
        href={chapter36Url}
      >
        Apply for career counseling
      </a>
    </>
  );
  return <div>{content}</div>;
};

export default Chapter36CTA;
