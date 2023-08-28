import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchHcaEnrollmentStatus as fetchHcaEnrollmentStatusFn } from '../actions';
import { selectPriorityGroup, showPriorityGroup } from '../selectors';

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
      className="vads-u-display--flex medium-screen:vads-u-justify-content--flex-end medium-screen:vads-u-margin-bottom--1"
    >
      <div className="medium-screen:vads-u-font-size--lg">
        <i className="fas fa-clipboard-check vads-u-padding-right--1" />
        Your health care{' '}
        <a
          data-dd-action-name="VA priority groups link"
          href="/health-care/eligibility/priority-groups"
        >
          priority group
        </a>
        : {priorityGroup}
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
  value: selectPriorityGroup(state),
});

const mapDispatchToProps = {
  fetchHcaEnrollmentStatus: fetchHcaEnrollmentStatusFn,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PriorityGroup);
