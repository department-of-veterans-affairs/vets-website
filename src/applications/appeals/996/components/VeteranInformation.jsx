import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { genderLabels } from 'platform/static-data/labels';
import { selectProfile } from 'platform/user/selectors';

import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

// separate each number so the screenreader reads "number ending with 1 2 3 4"
// instead of "number ending with 1,234"
const mask = value => {
  const number = (value || '').toString().slice(-4);
  return srSubstitute(
    `●●●–●●–${number}`,
    `ending with ${number.split('').join(' ')}`,
  );
};

const VeteranInformation = ({ profile = {}, veteran = {} }) => {
  const { ssnLastFour, vaFileLastFour } = veteran;
  const { dob, gender, userFullName = {} } = profile;

  const { first, middle, last, suffix } = userFullName;
  const momentDob = moment(dob || null); // called with undefined = today's date

  return (
    <>
      <p>This is the personal information we have on file for you.</p>
      <br />
      <div className="blue-bar-block">
        <strong className="name">
          {`${first || ''} ${middle || ''} ${last || ''}`}
          {suffix ? `, ${suffix}` : null}
        </strong>
        {ssnLastFour ? (
          <p className="ssn">Social Security number: {mask(ssnLastFour)}</p>
        ) : null}
        {vaFileLastFour ? (
          <p className="vafn">VA file number: {mask(vaFileLastFour)}</p>
        ) : null}
        <p>
          Date of birth:{' '}
          {momentDob.isValid() ? (
            <span className="dob">{momentDob.format('LL')}</span>
          ) : null}
        </p>
        <p>
          Gender: <span className="gender">{genderLabels?.[gender] || ''}</span>
        </p>
      </div>
      <br />
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        please call Veterans Benefits Assistance toll free at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
        8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};

VeteranInformation.propTypes = {
  profile: PropTypes.shape({
    dob: PropTypes.string,
    gender: PropTypes.string,
    userFullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
    }),
  }),
  veteran: PropTypes.shape({
    ssnLastFour: PropTypes.string,
    vaFileLastFour: PropTypes.string,
  }),
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const veteran = state.form?.data.veteran;
  return { profile, veteran };
};

export { VeteranInformation };

export default connect(mapStateToProps)(VeteranInformation);
