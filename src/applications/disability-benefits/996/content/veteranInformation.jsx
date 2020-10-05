import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import { setData } from 'platform/forms-system/src/js/actions';
import { genderLabels } from 'platform/static-data/labels';
import { selectProfile } from 'platform/user/selectors';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
import { SAVED_CLAIM_TYPE } from '../constants';
import { srSubstitute } from '../../all-claims/utils';

const mask = srSubstitute('●●●–●●–', 'ending with');

export const VeteranInfoView = ({
  formData,
  profile = {},
  veteran = {},
  setFormData,
}) => {
  const { ssnLastFour, vaFileLastFour } = veteran;
  const { dob, gender, userFullName } = profile;

  const { first, middle, last, suffix } = userFullName;

  // benefit type is added by the wizard, but the session value will be empty
  // if the user decides to restart the form; set in the submitTransformer
  const benefitType = window.sessionStorage.getItem(SAVED_CLAIM_TYPE);
  useEffect(() => {
    if (formData && benefitType) {
      window.sessionStorage.removeItem(SAVED_CLAIM_TYPE);
      setFormData({ ...formData, benefitType });
    }
  });

  return (
    <>
      <p>This is the personal information we have on file for you.</p>
      <br />
      <div className="blue-bar-block">
        <strong className="name">
          {`${first || ''} ${middle || ''} ${last || ''}`}
          {suffix && `, ${suffix}`}
        </strong>
        {ssnLastFour && (
          <p className="ssn">
            Social Security number: {mask} {ssnLastFour.slice(-4)}
          </p>
        )}
        {vaFileLastFour && (
          <p className="vafn">
            VA file number: {mask} {vaFileLastFour.slice(-4)}
          </p>
        )}
        <p>
          Date of birth:{' '}
          <span className="dob">{dob ? moment(dob).format('LL') : ''}</span>
        </p>
        <p>
          Gender:{' '}
          <span className="gender">
            {(gender && genderLabels[gender]) || ''}
          </span>
        </p>
      </div>
      <br />
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        please call Veterans Benefits Assistance toll free at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
        8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};

VeteranInfoView.propTypes = {
  setFormData: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const veteran = state.form?.veteran;
  return {
    profile,
    veteran,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VeteranInfoView);
