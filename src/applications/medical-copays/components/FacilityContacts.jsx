import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const FacilityContacts = ({ facilities }) => (
  <>
    <h3>Contact information for your VA health care facilities</h3>
    <dl>
      {facilities.map(facility => (
        <div key={facility.facilitYNum}>
          <dt>
            <h4>{facility.facilityName}</h4>
          </dt>
          <dd>
            <strong>Main number:</strong>
            <Telephone
              className="vads-u-margin-x--0p5"
              contact={facility.teLNum}
            />
          </dd>
        </div>
      ))}
    </dl>
  </>
);

export default FacilityContacts;
