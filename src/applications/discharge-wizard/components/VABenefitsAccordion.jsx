import React from 'react';
import PropTypes from 'prop-types';

const VABenefitsAccordion = ({ isResultsPage = false }) => {
  const links = [
    {
      text: 'Learn more about military sexual trauma',
      href: '/health-care/health-needs-conditions/military-sexual-trauma/',
    },
    {
      text: 'Learn more about VA mental health services',
      href: '/health-care/health-needs-conditions/mental-health/',
    },
    {
      text: 'Learn more about PTSD treatment',
      href: '/health-care/health-needs-conditions/mental-health/ptsd/',
    },
  ];

  let learnMoreLinks = (
    <ul>
      {links.map((link, index) => (
        <li key={`${link}-${index}`}>
          <va-link href={link.href} text={link.text} />
        </li>
      ))}
    </ul>
  );

  if (isResultsPage) {
    learnMoreLinks = (
      <ul>
        {links.map((link, index) => (
          <li key={`${link}-${index}`}>
            <a href={link.href} rel="noopener noreferrer" target="_blank">
              {link.text} (opens in a new tab)
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <va-accordion-item header="Can I get VA benefits without a discharge upgrade or correction?">
      <p>
        If you need mental health services for conditions related to PTSD,
        military sexual trauma, or other experiences linked to your service, you
        may qualify for VA health benefits right away. You don’t need a
        discharge upgrade or correction to receive these services.
      </p>
      {learnMoreLinks}
    </va-accordion-item>
  );
};

VABenefitsAccordion.propTypes = {
  isResultsPage: PropTypes.bool,
};

export default VABenefitsAccordion;
