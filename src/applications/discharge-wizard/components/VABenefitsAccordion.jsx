import React from 'react';
import PropTypes from 'prop-types';

const VABenefitsAccordion = ({ isResultsPage = false }) => {
  const links = [
    {
      text:
        'VA health benefits for Veterans who’ve experienced military sexual trauma',
      href: '/health-care/health-needs-conditions/military-sexual-trauma/',
    },
    {
      text: 'VA health benefits for Veterans with mental health conditions',
      href: '/health-care/health-needs-conditions/mental-health/',
    },
    {
      text: 'VA health benefits for Veterans with PTSD',
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

  let vsoLink = (
    <va-link
      href="/get-help-from-accredited-representative/find-rep"
      text="Get help from an accredited representative"
    />
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

    vsoLink = (
      <a
        href="/get-help-from-accredited-representative/find-rep"
        rel="noopener noreferrer"
        target="_blank"
      >
        Get help from an accredited representative (opens in a new tab)
      </a>
    );
  }

  return (
    <va-accordion-item header="Can I get VA benefits without a discharge upgrade?">
      <p>
        Even with a less than honorable discharge, you may be able to access
        some VA benefits through the Character of Discharge review process. When
        you apply for VA benefits, we’ll review your record to determine if your
        service was “honorable for VA purposes.” This review can take up to a
        year. Provide us with documents supporting your case, similar to the
        evidence you’d send with an application to upgrade your discharge.
      </p>
      <p>
        An accredited attorney, claims agent, or Veterans Service Organization
        (VSO) representative can help you gather your evidence and submit your
        application. {vsoLink}.
      </p>
      <p>
        <strong>Note:</strong> You can ask for a VA Character of Discharge
        review while at the same time applying for a discharge upgrade from the
        Department of Defense (DOD) or the Coast Guard.
      </p>
      <p>
        If you experienced sexual assault or harassment while in the military,
        or need mental health services related to PTSD or other mental health
        conditions linked to your service, you may qualify immediately for VA
        health benefits, even without a VA Character of Discharge review or a
        discharge upgrade.
      </p>
      <p>Learn more about:</p>
      {learnMoreLinks}
    </va-accordion-item>
  );
};

VABenefitsAccordion.propTypes = {
  isResultsPage: PropTypes.bool,
};

export default VABenefitsAccordion;
