import React from 'react';

export const DISABILITY_COMP_CARD = explanation => (
  <>
    {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
      a problem with Safari not treating the `ul` as a list. */}
    {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
    <ul className="onramp-list-none" role="list">
      <li>
        <va-card>
          <h2 className="vads-u-margin-top--0">
            Disability Compensation Claim
          </h2>
          <p>{explanation}</p>
          <va-link
            external
            class="vads-u-display--block vads-u-margin-bottom--2"
            href="/disability/how-to-file-claim"
            text="Learn more about Disability Benefits"
          />
          <va-link-action
            href="/disability/file-disability-claim-form-21-526ez/introduction"
            text="Start disability compensation application"
          />
        </va-card>
      </li>
    </ul>
  </>
);
