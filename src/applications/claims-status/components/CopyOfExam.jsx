import React from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function CopyOfExam() {
  return (
    <div>
      <h2 className="appeal-help-heading vads-u-margin-top--5">
        Want a copy of your claim exam?
      </h2>

      <p>
        Use{' '}
        <VaLink
          data-testid="va-form-20-10206-link"
          href="https://va.gov/find-forms/about-form-20-10206/"
          text="VA Form 20-10206"
        />{' '}
        to request a copy of your exam. You can submit the form using our online
        tool, or download a pdf of the form and send it by mail.
      </p>
    </div>
  );
}
