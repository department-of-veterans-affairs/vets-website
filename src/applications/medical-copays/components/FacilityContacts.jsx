import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const FacilityContacts = ({ facilities }) => (
  <>
    <h4>Contact information for your VA health care facilities:</h4>
    <ul>
      {facilities?.map(facility => (
        <li key={facility.facilitYNum}>
          {facility.facilityName}:
          <Telephone
            className="vads-u-margin-x--0p5"
            contact={facility.teLNum}
          />
        </li>
      ))}
    </ul>
  </>
);

export default FacilityContacts;
