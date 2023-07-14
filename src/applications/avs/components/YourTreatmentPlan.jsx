import React from 'react';
import PropTypes from 'prop-types';

const YourTreatmentPlan = props => {
  const { avs } = props;
  // eslint-disable-next-line no-console
  console.log(avs);

  return <p>Treatment plan.</p>;
};

export default YourTreatmentPlan;

YourTreatmentPlan.propTypes = {
  avs: PropTypes.object,
};
