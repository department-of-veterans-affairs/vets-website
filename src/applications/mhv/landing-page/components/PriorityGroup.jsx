import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchEnrollmentStatus as fetchEnrollmentStatusFn } from '../actions';

export const PriorityGroup = ({ fetchEnrollmentStatus, value }) => {
  useEffect(() => fetchEnrollmentStatus(), [fetchEnrollmentStatus]);
  if (!value) return <></>;
  const priorityGroup = value.replace('Group ', '');
  return (
    <div>
      <i className="fas fa-clipboard-check" />
      Your healthcare priority group: {priorityGroup}
      <br />
      <a href="https://va.gov/health-care/eligibility/priority-groups">
        Learn more about priority groups
      </a>
    </div>
  );
};

PriorityGroup.propTypes = {
  fetchEnrollmentStatus: PropTypes.func,
  value: PropTypes.string,
};

PriorityGroup.defaultProps = {
  fetchEnrollmentStatus: () => {},
};

const mapStateToProps = state => ({
  value: state?.priorityGroup?.data?.priorityGroup,
});

const mapDispatchToProps = {
  fetchEnrollmentStatus: fetchEnrollmentStatusFn,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriorityGroup);
