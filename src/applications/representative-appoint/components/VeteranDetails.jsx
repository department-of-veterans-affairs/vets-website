import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { genderLabels } from 'platform/static-data/labels';
import { srSubstitute, formatDate } from '../utilities/helpers';
import { editNote } from '../content/common';

function VeteranDetails({ profile }) {
  const { veteranSocialSecurityNumber, vaFileNumber, dob, gender } = profile;
  const { first, middle, last, suffix } = profile.userFullName;
  const mask = srSubstitute('●●●–●●–', 'ending with');

  return (
    <div>
      <p className="vads-u-margin-top--0">
        Confirm the personal information we have on file for you.
      </p>
      <div className="blue-bar-block">
        <strong>
          {`${first || ''}${first && middle ? ' ' : ''}${middle || ''}${
            (first || middle) && last ? ' ' : ''
          }${last || ''}`}
          {suffix && `, ${suffix}`}
        </strong>
        <p>
          Social Security number: {mask}
          {veteranSocialSecurityNumber?.slice(5)}
        </p>
        <p>
          VA file number: {mask}
          {vaFileNumber?.slice(5)}
        </p>
        <p>Branch of service: {genderLabels[gender]}</p>

        <p>Date of birth: {dob ? formatDate(dob) : ''}</p>
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
