import React from 'react';
import PropTypes from 'prop-types';
import JumpLink from 'platform/site-wide/jump-link/JumpLink';

const OnThisPageLinks = ({ isDetailsPage, hasHistory }) => (
  <nav id="table-of-contents" aria-labelledby="on-this-page">
    <h2
      id="on-this-page"
      className="vads-u-margin-bottom--2 vads-u-font-size--lg"
    >
      On this page
    </h2>
    {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
    <ul className="usa-unstyled-list" role="list">
      {!isDetailsPage && (
        <li className="vads-u-margin-bottom--2">
          <JumpLink toId="currentDebts" label="Current debts" />
        </li>
      )}

      {hasHistory && (
        <li className="vads-u-margin-bottom--2">
          <JumpLink toId="debtLetterHistory" label="Debt letter history" />
        </li>
      )}

      {(!isDetailsPage || hasHistory) && (
        <li className="vads-u-margin-bottom--2">
          <JumpLink toId="downloadDebtLetters" label="Download debt letters" />
        </li>
      )}

      <li className="vads-u-margin-bottom--2">
        <JumpLink toId="howDoIPay" label="How do I pay my VA debt?" />
      </li>

      <li className="vads-u-margin-bottom--2">
        <JumpLink toId="howDoIGetHelp" label="How do I get financial help?" />
      </li>

      <li className="vads-u-margin-bottom--2">
        <JumpLink toId="howDoIDispute" label="How do I dispute a debt?" />
      </li>
    </ul>
  </nav>
);

OnThisPageLinks.propTypes = {
  hasHistory: PropTypes.bool,
  isDetailsPage: PropTypes.bool,
};

export default OnThisPageLinks;
