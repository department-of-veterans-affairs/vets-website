import React from 'react';
import PropTypes from 'prop-types';

import { recordModalVisible } from '../../shared/utils/helpers';

const MissingInfo = ({ hasSsn, hasDob }) => {
  const hasSsnOrDob = [
    hasSsn ? '' : 'Social Security number',
    hasDob ? '' : 'date of birth',
  ].filter(Boolean);
  const missing = hasSsnOrDob.join(' and ');

  recordModalVisible(
    'warning',
    'We’re missing some of your personal information',
    'missing_ssn_or_dob',
    `Missing ${missing}`,
  );

  return (
    <va-alert status="error">
      <h2 slot="headline">We’re missing some of your personal information</h2>
      <p>
        You’ll need to provide us with the missing information before you can
        fill out a Supplemental Claim request. Call the Defense Manpower Data
        Center (DMDC) support office at <va-telephone contact="8005389552" /> to
        to make sure we have your {missing}. They’re open Monday through Friday,
        8:00 a.m. to 8:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        . If you have hearing loss, call{' '}
        <va-telephone contact="8663632883" tty />.
      </p>
    </va-alert>
  );
};

MissingInfo.propTypes = {
  hasDob: PropTypes.bool,
  hasSsn: PropTypes.bool,
};

export default MissingInfo;
