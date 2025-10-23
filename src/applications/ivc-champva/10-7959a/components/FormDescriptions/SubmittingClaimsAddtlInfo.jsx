import React from 'react';
import PropTypes from 'prop-types';
import { nameWording, privWrapper } from '../../../shared/utilities';

const SubmittingClaimsAddtlInfo = ({ formContext }) => {
  const { fullData } = formContext;
  const nameCap = privWrapper(
    nameWording(fullData, false, true, true) || 'You',
  );
  const namePosessive =
    fullData?.certifierRole === 'applicant' ? 'your' : 'their';
  const name = fullData?.certifierRole === 'applicant' ? 'you' : 'they';
  return (
    <va-additional-info
      trigger="Other helpful information about submitting claims"
      class="vads-u-margin-bottom--4"
    >
      <ul>
        <li>
          {nameCap} must file {namePosessive} claim within 1 year of when {name}{' '}
          got the care. And if {name} stayed at a hospital for care, {name} must
          file {namePosessive} claim within 1 year of when {name} left the
          hospital.
        </li>
        <li>Please retain a copy of all documents submitted to CHAMPVA.</li>
      </ul>
    </va-additional-info>
  );
};

SubmittingClaimsAddtlInfo.propTypes = {
  formContext: PropTypes.shape({
    fullData: PropTypes.object,
  }),
};

export default SubmittingClaimsAddtlInfo;
