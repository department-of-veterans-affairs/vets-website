import React, { useLayoutEffect, useRef } from 'react';
import ApplicationsInProgressLegacy from './ApplicationsInProgressLegacy';

const BenefitApplications = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const handleAnchorLink = () => {
      if (document.location.hash === '#benefit-applications') {
        const elt = sectionRef.current;
        const sectionPosition =
          elt?.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionPosition,
          behavior: 'smooth',
        });
        elt?.focus();
      }
    };

    handleAnchorLink();
  }, []);

  return (
    <div
      data-testid="dashboard-section-benefit-application-drafts"
      id="benefit-applications"
      ref={sectionRef}
      tabIndex={-1}
    >
      <h2>Benefit applications and forms</h2>
      <ApplicationsInProgressLegacy hideH3 />
    </div>
  );
};

export default BenefitApplications;
