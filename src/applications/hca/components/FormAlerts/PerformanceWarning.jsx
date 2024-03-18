import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const PerformanceWarning = () => (
  <va-alert status="warning" uswds>
    <h3 slot="headline">This application may not be working right now</h3>
    <div>
      <p className="vads-u-margin-top--0">
        You may have trouble using this application at this time. We’re working
        to fix the problem. If you have trouble, you can try again or check back
        later.
      </p>
      <p>
        <strong>
          If you’re trying to apply based on our expansion of health care
          benefits starting on March 5, 2024
        </strong>
        , you can also apply in other ways:
      </p>
      <ul>
        <li>
          Call us at <va-telephone contact={CONTACTS['222_VETS']} />, Monday
          through Friday, 8:00 a.m. to 8:00 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
        </li>
        <li>Mail us an application.</li>
        <li>
          Or bring your application in person to your nearest VA health
          facility.
        </li>
      </ul>
      <p>
        <va-link
          href="/health-care/how-to-apply/#you-can-also-apply-in-any-of-t"
          text="Learn more about how to apply by phone, mail, or in person"
        />
      </p>
    </div>
  </va-alert>
);

export default PerformanceWarning;
