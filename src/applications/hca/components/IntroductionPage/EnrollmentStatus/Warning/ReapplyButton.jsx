import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import content from '../../../../locales/en/content.json';

const APPLY_STATUSES = new Set([
  HCA_ENROLLMENT_STATUSES.activeDuty,
  HCA_ENROLLMENT_STATUSES.canceledDeclined,
  HCA_ENROLLMENT_STATUSES.closed,
  HCA_ENROLLMENT_STATUSES.nonMilitary,
  HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry,
  HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
  HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry,
]);

const ReapplyButton = ({ route: { formConfig, pageList } }) => {
  const statusCode = useSelector(state => state.hcaEnrollmentStatus.statusCode);

  const hasApplyStatus = useMemo(() => APPLY_STATUSES.has(statusCode), [
    statusCode,
  ]);

  const sipProps = useMemo(
    () => ({
      startText: content['sip-start-form-text'],
      messages: formConfig.savedFormMessages,
      downtime: formConfig.downtime,
      buttonOnly: true,
      pageList,
    }),
    [formConfig, pageList],
  );

  return hasApplyStatus ? (
    <div className="vads-u-margin-top--3">
      <SaveInProgressIntro {...sipProps} />
    </div>
  ) : null;
};

ReapplyButton.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      savedFormMessages: PropTypes.object,
      downtime: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }),
};

export default ReapplyButton;
