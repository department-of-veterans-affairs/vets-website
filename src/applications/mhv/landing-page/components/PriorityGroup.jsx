import React from 'react';
import PropTypes from 'prop-types';

const PriorityGroup = ({ value }) => (
  <div>
    Your healthcare group:{' '}
    <a href="/health-care/eligibility/priority-groups/">{value}</a>
  </div>
);

PriorityGroup.propTypes = {
  value: PropTypes.string,
};

export default PriorityGroup;
