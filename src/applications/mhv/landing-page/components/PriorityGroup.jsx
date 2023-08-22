import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchHcaEnrollmentStatus as fetchHcaEnrollmentStatusFn } from '../actions';

export const PriorityGroup = ({ fetchHcaEnrollmentStatus, value }) => {
  useEffect(() => fetchHcaEnrollmentStatus(), [fetchHcaEnrollmentStatus]);
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
  fetchHcaEnrollmentStatus: PropTypes.func,
  value: PropTypes.string,
};

PriorityGroup.defaultProps = {
  fetchHcaEnrollmentStatus: () => {},
  value: null,
};

const mapStateToProps = state => ({
  value: state?.priorityGroup?.data?.priorityGroup,
});

const mapDispatchToProps = {
  fetchHcaEnrollmentStatus: fetchHcaEnrollmentStatusFn,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriorityGroup);
