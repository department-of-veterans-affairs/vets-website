import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchHcaEnrollmentStatus as fetchHcaEnrollmentStatusFn } from '../actions';
import { selectHcaEnrollmentStatus, showPriorityGroup } from '../selectors';

export const PriorityGroup = ({ enabled, fetchHcaEnrollmentStatus, value }) => {
  useEffect(() => enabled && fetchHcaEnrollmentStatus(), [
    enabled,
    fetchHcaEnrollmentStatus,
  ]);
  if (!enabled || !value) return <></>;
  const priorityGroup = value.replace('Group ', '');
  return (
    <div
      data-testid="mhv-priority-group"
      className="mhv-priority-group vads-u-display--flex vads-u-justify-content--flex-start vads-u-margin-bottom--3"
    >
      <div className="vads-u-margin-x--1">
        <i className="fas fa-clipboard-check vads-u-font-size--lg" />
      </div>
      <div className="vads-l-col--11">
        Your healthcare priority group: {priorityGroup}
        <br />
        <a
          data-dd-action-name="VA priority groups link"
          href="/health-care/eligibility/priority-groups"
        >
          Learn more about priority groups
        </a>
      </div>
    </div>
  );
};

PriorityGroup.propTypes = {
  enabled: PropTypes.bool,
  fetchHcaEnrollmentStatus: PropTypes.func,
  value: PropTypes.string,
};

PriorityGroup.defaultProps = {
  enabled: false,
  fetchHcaEnrollmentStatus: () => {},
  value: null,
};

const mapStateToProps = state => ({
  enabled: showPriorityGroup(state),
  value: selectHcaEnrollmentStatus(state),
});

const mapDispatchToProps = {
  fetchHcaEnrollmentStatus: fetchHcaEnrollmentStatusFn,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriorityGroup);
