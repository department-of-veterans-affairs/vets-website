import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { recordEventOnce } from 'platform/monitoring/record-event';

const helpClicked = () =>
  recordEventOnce({
    event: 'disability-526EZ--form-help-text-clicked',
    'help-text-label':
      'Disability - Form 526EZ - What is substantially gainful employment',
  });

export const disabilitiesDescription = ({ formContext }) => {
  // Fix header accessibility
  const Tag = formContext.onReviewPage ? 'h4' : 'h3';
  return (
    <div>
      <Tag className="vads-u-font-size--h5">
        Rated, service-connected, and new disabilities
      </Tag>
      <p>
        Individual unemployability is awarded based on service-connected
        disabilities.
      </p>
      <p>
        Below are the rated, service-connected disabilities, and new
        disabilities you’re claiming. Please choose the disability or
        disabilities that prevent you from getting and keeping a steady job
        (substantially gainful employment).
      </p>
      <VaAdditionalInfo
        trigger="What’s substantially gainful employment?"
        disableAnalytics
        onClick={helpClicked}
      >
        <p>Substantially gainful employment means:</p>
        <ul>
          <li>
            You’re employed in a competitive marketplace or job that isn’t in a
            protected environment, such as a family business or sheltered
            workshop.
          </li>
          <li>
            Your annual earnings are higher than the poverty threshold for one
            person.
          </li>
        </ul>
      </VaAdditionalInfo>
    </div>
  );
};

export const helpDescription = (
  <p>
    <strong>Please note:</strong> If you expect to see something that isn’t
    included in this list or if you have other questions about your claim,
    contact: <va-telephone contact={CONTACTS['222_VETS']} />, Monday through
    Friday, 8:00 a.m. to 8:00 p.m. ET.
  </p>
);
