import React from 'react';
import PropTypes from 'prop-types';

const CallVetCenterForHours = ({ vetCenterHoursId }) => (
  <div id={vetCenterHoursId}>
    <h4 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
      Hours
    </h4>
    <div className="vads-u-flex-direction--column small-screen:vads-u-flex-direction--row vads-u-margin-bottom--0">
      Please call the main Vet Center for hours
    </div>
  </div>
);

CallVetCenterForHours.propTypes = {
  hours: PropTypes.array,
  vetCenterHoursId: PropTypes.string,
};

export default CallVetCenterForHours;
