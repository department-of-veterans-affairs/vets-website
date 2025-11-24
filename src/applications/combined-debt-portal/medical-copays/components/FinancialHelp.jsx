import React from 'react';
import PropTypes from 'prop-types';

export const FinancialHelp = ({ showOneThingPerPage = false }) => (
  <article className="vads-u-padding--0" data-testid="financial-help">
    <h2 id="how-to-get-financial-help">How to request financial help</h2>
    {showOneThingPerPage ? null : (
      <p>
        If you’re struggling because of life situations like losing your job,
        having a sudden decrease in income, or having an increase in
        out-of-pocket family health care expenses, we can help.
      </p>
    )}
    <h3>Request help for your current bills</h3>
    <p>You can request these relief options:</p>
    <ul>
      <li>
        <strong>Compromise offer.</strong> This means you offer a lesser
        one-time lump sum amount as full payment of the debt. If we approve your
        request, you’ll have to pay the one-time amount within 30 days.
      </li>
      <li>
        <strong>Waiver.</strong> This means you ask us to forgive (or “waive”)
        part or all of the debt. If we approve your request, you won’t have to
        pay the amount waived.
      </li>
    </ul>
    <p>
      <va-link-action
        href="/manage-va-debt/request-debt-help-form-5655/"
        text="Request help with your debt"
        type="secondary"
      />
    </p>
    <h3>Request help for your future health care</h3>
    <p>
      You may be eligible for a hardship determination, which would qualify you
      for a copay exemption. This means we’ll assign you to a higher priority
      group, and you won’t have to pay any VA copays for the rest of the
      calendar year.
    </p>
    <p>
      <va-link-action
        href="https://www.va.gov/health-care/pay-copay-bill/financial-hardship"
        text="Learn more about requesting a hardship determination"
        type="secondary"
      />
    </p>
  </article>
);

FinancialHelp.propTypes = {
  showOneThingPerPage: PropTypes.bool,
};

export default FinancialHelp;
