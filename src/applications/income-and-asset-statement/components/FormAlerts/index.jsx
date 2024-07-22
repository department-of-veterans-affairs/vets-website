import React from 'react';
import PropTypes from 'prop-types';

const RequestFormAlert = ({ title, formName, formLink, children }) => {
  const linkText = `Get ${formName} to download (opens in new tab)`;
  return (
    <va-alert status="warning" uswds>
      <p className="vads-u-margin-y--0">
        You’ll need to submit an {title} ({formName}
        ).
      </p>
      <p>{children}</p>
      <p>
        We’ll ask you to upload this form at the end of this application. Or you
        can send it to us by mail.
      </p>
      <p>
        <a
          href={formLink}
          rel="noopener noreferrer"
          target="_blank"
          aria-label={linkText}
        >
          {linkText}
        </a>
      </p>
    </va-alert>
  );
};

RequestFormAlert.propTypes = {
  children: PropTypes.node.isRequired,
  formLink: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export const RequestPropertyOrBusinessIncomeFormAlert = () => (
  <RequestFormAlert
    title="Report of Income from Property or Business"
    formName="VA Form 21P-4185"
    formLink="https://www.va.gov/find-forms/about-form-21p-4185/"
  />
);

export const RequestFarmIncomeFormAlert = () => (
  <RequestFormAlert
    title="Pension Claim Questionnaire for Farm Income"
    formName="VA Form 21P-4165"
    formLink="https://www.va.gov/find-forms/about-form-21p-4165/"
  />
);
