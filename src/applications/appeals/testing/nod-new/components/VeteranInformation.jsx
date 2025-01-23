import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { genderLabels } from '~/platform/static-data/labels';
import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';

import {
  FORMAT_YMD_DATE_FNS,
  FORMAT_READABLE_DATE_FNS,
} from '../../../shared/constants';

import { parseDateToDateObj } from '../../../shared/utils/dates';

const VeteranInformation = ({ veteran = {} }) => {
  const { ssnLastFour, vaFileLastFour } = veteran;
  const dob = '1980-01-10';
  const gender = 'M';
  const first = 'HECTOR';
  const last = 'BAKER';

  const dobDateObj = parseDateToDateObj(dob || null, FORMAT_YMD_DATE_FNS);

  // separate each number so the screenreader reads "number ending with 1 2 3 4"
  // instead of "number ending with 1,234"
  const mask = value => {
    const number = (value || '').toString().slice(-4);
    return srSubstitute(
      `●●●–●●–${number}`,
      `ending with ${number.split('').join(' ')}`,
    );
  };

  return (
    <>
      <h1 className="vads-u-margin-bottom--4">
        Confirm the personal information we have on file
      </h1>
      <div className="blue-bar-block">
        <strong
          className="name dd-privacy-hidden"
          data-dd-action-name="full name"
        >
          {`${first || ''} ${last || ''}`}
        </strong>
        {ssnLastFour && (
          <p className="ssn">
            Social Security number:{' '}
            <span className="dd-privacy-mask" data-dd-action-name="SSN">
              {mask(ssnLastFour)}
            </span>
          </p>
        )}
        {vaFileLastFour && (
          <p className="vafn">
            VA file number:{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="VA file number"
            >
              {mask(vaFileLastFour)}
            </span>
          </p>
        )}
        <p>
          Date of birth:{' '}
          {isValid(dobDateObj) ? (
            <span
              className="dob dd-privacy-mask"
              data-dd-action-name="Date of birth"
            >
              {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
            </span>
          ) : null}
        </p>
        <p>
          Gender:{' '}
          <span
            className="gender dd-privacy-hidden"
            data-dd-action-name="gender"
          >
            {(gender && genderLabels[gender]) || ''}
          </span>
        </p>
      </div>
      <br role="presentation" />
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here
        Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};

VeteranInformation.propTypes = {
  veteran: PropTypes.shape({
    vaFileLastFour: PropTypes.string,
    ssnLastFour: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => {
  const { veteran } = state.form?.data;
  return { veteran };
};

export { VeteranInformation };

export default connect(mapStateToProps)(VeteranInformation);
