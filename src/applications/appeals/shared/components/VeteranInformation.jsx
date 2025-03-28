import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { selectProfile } from '~/platform/user/selectors';

import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';

import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from '../constants';

import { parseDateToDateObj } from '../utils/dates';

// separate each number so the screenreader reads "1 2 3 4"
// instead of "1,234"
const mask = value => {
  const number = (value || '').toString().slice(-4);
  return srSubstitute(number, `ending with ${number.split('').join(' ')}`);
};

const VeteranInformation = ({ formData }) => {
  const { ssnLastFour } = formData?.veteran || {};
  const { dob, userFullName = {} } = useSelector(selectProfile);
  const { first, middle, last, suffix } = userFullName;

  const dobDateObj = parseDateToDateObj(dob || null, FORMAT_YMD_DATE_FNS);

  return (
    <>
      <h3 className="vads-u-margin-y--2">
        Confirm the personal information we have on file for you.
      </h3>
      <va-card>
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Personal information
        </h4>
        <p className="name">
          <strong>Name:</strong>{' '}
          <span
            className="name dd-privacy-hidden"
            data-dd-action-name="Veteran's name"
          >
            {`${first || ''} ${middle || ''} ${last || ''}`}
            {suffix ? `, ${suffix}` : null}
          </span>
        </p>
        {ssnLastFour ? (
          <p className="ssn">
            <strong>Last 4 digits of Social Security number:</strong>{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran's SSN"
            >
              {mask(ssnLastFour)}
            </span>
          </p>
        ) : null}
        <p className="dob vads-u-margin-bottom--0">
          <strong>Date of birth:</strong>{' '}
          {isValid(dobDateObj) ? (
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran's date of birth"
            >
              {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
            </span>
          ) : null}
        </p>
      </va-card>

      <p className="vads-u-margin-top--2">
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, date of birth, or Social Security
        number. If you need to change this information, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ). We’re here Monday through Friday, between 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>
      <p className="vads-u-margin-bottom--4">
        <va-link
          external
          href="/resources/how-to-change-your-legal-name-on-file-with-va/"
          text="Find more detailed instructions for how to change your legal name on file"
        />
      </p>
    </>
  );
};

VeteranInformation.propTypes = {
  formData: PropTypes.shape({
    veteran: PropTypes.shape({
      ssnLastFour: PropTypes.string,
      vaFileLastFour: PropTypes.string,
    }),
  }),
};

export default VeteranInformation;
