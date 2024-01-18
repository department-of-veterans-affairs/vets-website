import React from 'react';
import { getAppUrl } from 'platform/utilities/registry-helpers';

const vreUrl = getAppUrl('28-8832-planning-and-career-guidance');

const EDUCATION_CAREER_COUNSELING_PATH = 'education-and-career-counseling';

const Chapter36CTA = () => {
  const isEducationAndCareerPage = window.location.href.includes(
    EDUCATION_CAREER_COUNSELING_PATH,
  );
  const content = (
    <>
      {!isEducationAndCareerPage ? <h2>How do I apply?</h2> : null}
      <a target="_self" href={vreUrl}>
        Apply for career counseling
      </a>
    </>
  );
  return <div>{content}</div>;
};

export default Chapter36CTA;
