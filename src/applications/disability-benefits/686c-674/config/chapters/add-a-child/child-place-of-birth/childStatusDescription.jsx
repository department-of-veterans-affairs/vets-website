import React from 'react';

export const childStatusDescription = (
  <div>
    <p>
      If you select an option other than{' '}
      <span className="vads-u-color--gray-dark vads-u-font-weight--bold">
        Biological
      </span>{' '}
      or if you don’t live in the U.S. or a territory of the U.S., we require
      additional evidence to establish a dependent.
    </p>
    <va-additional-info
      trigger="What are some examples of additional evidence?"
      uswds="false"
    >
      <p className="vads-u-margin-bottom--4">
        If you <strong>don’t live in the U.S.</strong> or a territory of the
        U.S., you’ll need to provide a copy of each child’s birth certificate
      </p>
      <p className="vads-u-margin-bottom--4">
        To add a <strong>stepchild,</strong> you’ll need to provide a copy of
        their birth certificate, showing the names of both parents if your
        stepchild is not the biological child of your spouse (adopted, for
        example)
      </p>
      <p className="vads-u-margin-bottom--2">
        To add an <strong>adopted child,</strong> you’ll need to provide a copy
        of one of the following:
      </p>
      <ul className="vads-u-margin-bottom--4">
        <li>The final decree of adoption</li>{' '}
        <li>The adoptive placement agreement</li>
        <li>The interlocutory decree of adoptions, or</li>
        <li>The revised birth certificate</li>
      </ul>
    </va-additional-info>
  </div>
);
