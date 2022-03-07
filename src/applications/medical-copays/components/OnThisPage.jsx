import React from 'react';
import JumpLink from 'platform/site-wide/jump-link/JumpLink';

export const OnThisPage = () => (
  <nav id="table-of-contents" aria-labelledby="on-this-page">
    <h2
      id="on-this-page"
      className="vads-u-margin-bottom--2 vads-u-font-size--xl"
    >
      On this page
    </h2>
    {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
    <ul className="usa-unstyled-list" role="list">
      <li className="vads-u-margin-bottom--2">
        <JumpLink toId="download-statements" label="Your statements" />
      </li>

      <li className="vads-u-margin-bottom--2">
        <JumpLink toId="how-to-pay" label="How do I pay my VA copay bill?" />
      </li>

      <li className="vads-u-margin-bottom--2">
        <JumpLink
          toId="how-to-get-financial-help"
          label="How do I get financial help for my copays?"
        />
      </li>

      <li className="vads-u-margin-bottom--2">
        <JumpLink
          toId="dispute-charges"
          label="How do I dispute my copay charges?"
        />
      </li>

      <li className="vads-u-margin-bottom--2">
        <JumpLink
          toId="balance-questions"
          label="What to do if you have questions about your balance"
        />
      </li>
    </ul>
  </nav>
);
