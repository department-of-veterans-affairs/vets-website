import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '@department-of-veterans-affairs/platform-utilities';
import { fetchEnrollmentStatus as actualFetchEnrollmentStatus } from '../actions';

const url = path => `${environment.BaseUrl}${path}`;

export const PriorityGroup = ({
  fetchEnrollmentStatus = actualFetchEnrollmentStatus,
  value,
}) => {
  useEffect(() => fetchEnrollmentStatus(), []);
  if (!value) return <></>;
  const priorityGroup = value.replace('Group ', '');
  return (
    <div>
      <i className="fas fa-clipboard-check" />
      Your healthcare priority group: {priorityGroup}
      <br />
      <a href={url('/health-care/eligibility/priority-groups')}>
        Learn more about priority groups
      </a>
    </div>
  );
};

PriorityGroup.propTypes = {
  fetchEnrollmentStatus: PropTypes.func,
  value: PropTypes.string,
};

const mapStateToProps = state => ({
  value: state?.data?.priorityGroup,
});

export default connect(
  mapStateToProps,
  null,
)(PriorityGroup);
