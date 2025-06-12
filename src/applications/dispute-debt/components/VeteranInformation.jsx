import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';

import { selectProfile } from '~/platform/user/selectors';

import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';

import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from '../constants';

import { parseDateToDateObj } from '../utils';

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
  const { ssnLastFour } = formData?.veteranInformation || {};
  const { dob, userFullName = {} } = useSelector(selectProfile);
  const { first, middle, last, suffix } = userFullName;

  const dobDateObj = parseDateToDateObj(dob || null, FORMAT_YMD_DATE_FNS);

  return (
    <>
      <div>
        <h2 className="vads-u-margin-top--0">Your personal information</h2>
        <p>This is the personal information we have on file for you</p>
        <div className="personal-information-box">
          <h4 className="vads-u-margin-top--0">Personal information</h4>
          <p>
            <strong
              className="name dd-privacy-hidden"
              data-dd-action-name="Veteran's name"
            >
              Name:
            </strong>{' '}
            {`${first || ''} ${middle || ''} ${last || ''}`}
            {suffix ? `, ${suffix}` : null}
          </p>
          {ssnLastFour ? (
            <p className="ssn">
              Last 4 digits of Social Security number{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Veteran's SSN"
              >
                {mask(ssnLastFour)}
              </span>
            </p>
          ) : null}
          <p className="vads-u-margin-bottom--0">
            <strong>Date of birth:</strong>{' '}
            {isValid(dobDateObj) ? (
              <span
                className="dob dd-privacy-mask"
                data-dd-action-name="Veteran's date of birth"
              >
                {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <br role="presentation" />

      <p>
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, date of birth, or VA file number. If
        you need to update your personal information, call our VA benefits
        hotline at <va-telephone contact="8008271000" />(
        <va-telephone contact="711" tty="true" />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>
    </>
  );
};

VeteranInformation.propTypes = {
  formData: PropTypes.shape({
    veteranInformation: PropTypes.shape({
      ssnLastFour: PropTypes.string,
      vaFileLastFour: PropTypes.string,
    }),
  }),
};

export default VeteranInformation;
