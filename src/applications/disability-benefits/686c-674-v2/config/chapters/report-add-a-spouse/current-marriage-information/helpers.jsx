import React from 'react';

export const marriageTypeInformation = (
  <div>
    <p>
      If you select a marriage type other than{' '}
      <span className="vads-u-color--gray-dark vads-u-font-weight--bold">
        Ceremonial,
      </span>{' '}
      or if you don’t live in the U.S. or a territory of the U.S., we require
      additional evidence to establish a spouse.
    </p>
    <va-additional-info
      trigger="Additional evidence needed to add spouse"
      uswds="false"
    >
      <p>
        Examples of additional information includes a copy of the public record,
        or a copy of the church record that shows:
      </p>
      <ul>
        <li>The identities of the people involved</li>
        <li>The date and place of the marriage</li>
        <li>The number of prior marriages for both parties</li>
      </ul>
      <p>
        If an official record is not available, you should submit at least one
        of the following documents:
      </p>
      <ul>
        <li>
          The official report from your branch of service showing a marriage
          happened while you were in service
        </li>
        <li>A certified copy of the original marriage certificate</li>
        <li>
          An affidavit of the clergyman or magistrate who conducted the marriage
          ceremony.
        </li>
        <li>Other evidence that may be considered</li>
      </ul>
    </va-additional-info>
  </div>
);
