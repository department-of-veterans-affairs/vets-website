import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const FacilityContacts = ({ statementData }) => (
  <>
    <h3>Contact information for your VA health care facilities</h3>
    <dl>
      {statementData?.map(statement => (
        <div key={statement.id}>
          <dt>
            <h4>{statement.station.facilitYDesc}</h4>
          </dt>
          <dd>
            <strong>Main number:</strong>
            <Telephone
              className="vads-u-margin-x--0p5"
              contact={statement.station.teLNum}
            />
          </dd>
        </div>
      ))}
    </dl>
  </>
);

export default FacilityContacts;
