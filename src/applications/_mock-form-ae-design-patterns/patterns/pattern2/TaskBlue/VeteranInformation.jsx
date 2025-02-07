import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';

import { genderLabels } from '~/platform/static-data/labels';
import { selectProfile } from '~/platform/user/selectors';

import { CONTACTS } from '@department-of-veterans-affairs/component-library';
import {
  FORMAT_READABLE_DATE_FNS,
  FORMAT_YMD_DATE_FNS_CONCAT,
} from './constants';

import { parseDateToDateObj } from '../../../utils/dates';

import { APP_URLS } from '../../../utils/constants';

// separate each number so the screenreader reads "number ending with 1 2 3 4"
// instead of "number ending with 1,234"

const VeteranInformation = ({ formData }) => {
  const { veteranSocialSecurityNumber } = formData || {};
  const { dob, gender, userFullName = {} } = useSelector(selectProfile);
  const { first, middle, last, suffix } = userFullName;

  const dobDateObj = parseDateToDateObj(
    dob || null,
    FORMAT_YMD_DATE_FNS_CONCAT,
  );

  return (
    <>
      <h3 className="vads-u-margin-y--2">
        Confirm the personal information we have on file for you.
      </h3>
      <div className="vads-u-display--flex">
        <va-card background="true">
          <p>
            <strong
              className="name dd-privacy-hidden"
              data-dd-action-name="Veteran's name"
            >
              Name:{' '}
            </strong>
            {`${first || ''} ${middle || ''} ${last || ''}`}
            {suffix ? `, ${suffix}` : null}
          </p>
          {veteranSocialSecurityNumber ? (
            <p className="ssn">
              <strong>Last 4 digits of Social Security number: </strong>
              <span data-dd-action-name="Veteran's SSN">
                {veteranSocialSecurityNumber.slice(-4)}
              </span>
            </p>
          ) : null}
          {/* {vaFileLastFour ? ( */}
          {/* <p className="vafn">
          VA file number:{' '}
          <span
          className="dd-privacy-mask"
          data-dd-action-name="Veteran's VA file number"
          >
          {mask(vaFileLastFour)}
          </span>
          </p>
          ) : null} */}
          <p>
            <strong>Date of birth: </strong>
            {isValid(dobDateObj) ? (
              <span
                className="dob dd-privacy-mask"
                data-dd-action-name="Veteran's date of birth"
              >
                {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
              </span>
            ) : null}
          </p>
          <p>
            <strong>Gender: </strong>
            <span
              className="gender dd-privacy-hidden"
              data-dd-action-name="Veteran's gender"
            >
              {genderLabels?.[gender] || ''}
            </span>
          </p>
        </va-card>
      </div>

      <br role="presentation" />

      <p className="vads-u-margin-bottom--4">
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, Social Security number, date of
        birth, or gender. If you need to change this information, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact="711" tty />
        ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m. ET.
        We’ll give you instructions for how to change your information. Or you
        can learn how to change your legal name on file with VA.{' '}
        <va-link
          external
          href={APP_URLS.facilities}
          text="Learn how to change your legal name (opens in new tab)"
        />
      </p>
    </>
  );
};

VeteranInformation.propTypes = {
  formData: PropTypes.shape({
    // veteran: PropTypes.shape({
    //   ssnLastFour: PropTypes.string,
    //   vaFileLastFour: PropTypes.string,
    // }),
    // veteran: PropTypes.object,
  }),
};

export default VeteranInformation;
