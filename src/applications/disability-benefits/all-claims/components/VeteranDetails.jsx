import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { genderLabels } from 'platform/static-data/labels';
import { srSubstitute, formatDate } from '../utils';
import { editNote } from '../content/common';

function VeteranDetails({ profile }) {
  // NOTE: ssn and vaFileNumber will be undefined for the foreseeable future; they're kept in here as a reminder.
  const { ssn, vaFileNumber, dob, gender } = profile;
  const { first, middle, last, suffix } = profile.userFullName;
  const mask = srSubstitute('●●●–●●–', 'ending with');

  return (
    <div>
      <p className="vads-u-margin-top--0">
        This is the personal information we have on file for you.
      </p>
      <div className="blue-bar-block">
        <strong>
          {`${first || ''} ${middle || ''} ${last || ''}`}
          {suffix && `, ${suffix}`}
        </strong>
        {ssn && (
          <p>
            Social Security number: {mask}
            {ssn.slice(5)}
          </p>
        )}
        {vaFileNumber && (
          <p>
            VA file number: {mask}
            {vaFileNumber.slice(5)}
          </p>
        )}
        <p>Date of birth: {dob ? formatDate(dob) : ''}</p>
        <p>Gender: {genderLabels[gender]}</p>
      </div>
      {editNote('personal information')}
    </div>
  );
}

VeteranDetails.propTypes = {
  profile: PropTypes.shape({
    dob: PropTypes.string,
    gender: PropTypes.string,
    ssn: PropTypes.string,
    userFullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
    }),
    vaFileNumber: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  profile: state.user.profile,
});

export default connect(mapStateToProps)(VeteranDetails);
