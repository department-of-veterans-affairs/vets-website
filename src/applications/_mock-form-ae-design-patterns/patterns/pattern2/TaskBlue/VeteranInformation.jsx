import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';

import { genderLabels } from '~/platform/static-data/labels';
import { selectProfile } from '~/platform/user/selectors';

import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';

import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from './constants';

import { parseDateToDateObj } from '../../../utils/dates';

import { APP_URLS } from '../../../utils/constants';

// separate each number so the screenreader reads "number ending with 1 2 3 4"
// instead of "number ending with 1,234"
const mask = value => {
  const number = (value || '').toString().slice(-4);
  return srSubstitute(
    `●●●–●●–${number}`,
    `ending with ${number.split('').join(' ')}`,
  );
};

const VeteranInformation = ({ formData }) => {
  const { veteranSocialSecurityNumber } = formData || {};
  const { dob, gender, userFullName = {} } = useSelector(selectProfile);
  const { first, middle, last, suffix } = userFullName;

  const dobDateObj = parseDateToDateObj(dob || null, FORMAT_YMD_DATE_FNS);

  return (
    <>
      <h3 className="vads-u-margin-y--2">
        Confirm the personal information we have on file for you.
      </h3>
      <va-card background="true">
        <strong
          className="name dd-privacy-hidden"
          data-dd-action-name="Veteran's name"
        >
          {`${first || ''} ${middle || ''} ${last || ''}`}
          {suffix ? `, ${suffix}` : null}
        </strong>
        {veteranSocialSecurityNumber ? (
          <p className="ssn">
            <strong>Social Security number: </strong>
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran's SSN"
            >
              {mask(veteranSocialSecurityNumber)}
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

      <br role="presentation" />

      <p>
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, date of birth, or Social Security
        number. If you need to change this information for your health benefits,
        call your VA health facility.{' '}
        <va-link
          href={APP_URLS.facilities}
          text="Find your VA health facility"
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
