import React from 'react';
import PropTypes from 'prop-types';

const CallVetCenterForHours = ({ vetCenterHoursId, hoursH4Style }) => (
  <div id={vetCenterHoursId}>
    <h4 className={hoursH4Style}>Hours</h4>
    <div className="vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row vads-u-margin-bottom--0">
      Please call the main Vet Center for hours
    </div>
  </div>
);

CallVetCenterForHours.propTypes = {
  hours: PropTypes.array,
  vetCenterHoursId: PropTypes.string,
  hoursH4Style: PropTypes.string,
};

export default CallVetCenterForHours;
