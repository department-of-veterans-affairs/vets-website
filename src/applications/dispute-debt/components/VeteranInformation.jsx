import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
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
  const { ssn } = formData?.veteran || {};
  const { dob, userFullName = {} } = useSelector(selectProfile);
  const { first, middle, last, suffix } = userFullName;

  const dobDateObj = parseDateToDateObj(dob || null, FORMAT_YMD_DATE_FNS);

  return (
    <>
      <va-card
        data-testid="veteran-information-card"
        class="vads-u-margin-y--3 gray-task contact-info-card"
        uswds
      >
        <div>
          <h3 className="vads-u-margin-top--0  vads-u-font-size--h2">
            Your personal information
          </h3>
          <p>This is the personal information we have on file for you.</p>
          <div className="vads-u-padding-left--1">
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
            {ssn ? (
              <p className="ssn" data-testid="ssn-display">
                <strong>Last 4 digits of Social Security number: </strong>{' '}
                <span
                  className="dd-privacy-mask"
                  data-dd-action-name="Veteran's SSN"
                >
                  {mask(ssn)}
                </span>
              </p>
            ) : null}
            <p>
              <strong>Date of birth:</strong>{' '}
              {isValid(dobDateObj) ? (
                <span
                  className="dob dd-privacy-mask"
                  data-dd-action-name="Veteran's date of birth"
                  data-testid="dob-display"
                >
                  {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </va-card>

      <p>
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, date of birth, or VA file number. If
        you need to update your personal information, call our VA benefits
        hotline at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS['711']} tty />
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
    veteran: PropTypes.shape({
      ssn: PropTypes.string,
      vaFileLastFour: PropTypes.string,
    }),
  }),
};

export default VeteranInformation;
