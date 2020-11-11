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
import { srSubstitute } from '../../all-claims/utils';

const mask = srSubstitute('●●●–●●–', 'ending with');

export const VeteranInfoView = ({
  formData,
  profile = {},
  veteran = {},
  setFormData,
  contestableIssues = {},
}) => {
  const { ssnLastFour, vaFileLastFour } = veteran;
  const { dob, gender, userFullName } = profile;

  const { first, middle, last, suffix } = userFullName;
  // ContestableIssues API needs a benefit type, so they are grouped together
  const { issues, benefitType } = contestableIssues;

  useEffect(() => {
    if (formData) {
      // add benefitType (from wizard) and contestedIssues (from API) values to
      // the form; it's added here instead of the intro page because at this
      // point the prefill or save-in-progress data would overwrite it
      setFormData({
        ...formData,
        // add benefitType from wizard
        benefitType: benefitType || formData.benefitType,
        contestedIssues: issues,
      });
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
  const veteran = state.form?.data.veteran;
  const { contestableIssues } = state;
  return {
    profile,
    veteran,
    contestableIssues,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VeteranInfoView);
