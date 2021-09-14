import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const FacilityContacts = () => (
  <>
    <h3>Contact information for your VA health care facilities</h3>
    <dl>
      <dt>
        <h4>James A. Haley Veterans’ Hospital</h4>
      </dt>
      <dd>
        <strong>Main number:</strong> <Telephone contact={'813-972-2000'} />
      </dd>
      <dt>
        <h4>San Diego VA Medical Center</h4>
      </dt>
      <dd>
        <strong>Main number:</strong> <Telephone contact={'858-552-8585'} />
      </dd>
      <dt>
        <h4>Philadelphia VA Medical Center</h4>
      </dt>
      <dd>
        <strong>Main number:</strong> <Telephone contact={'215-823-5800'} />
      </dd>
    </dl>
  </>
);

export default FacilityContacts;
