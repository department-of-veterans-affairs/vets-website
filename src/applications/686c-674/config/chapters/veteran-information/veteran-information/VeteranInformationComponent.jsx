import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { selectProfile } from 'platform/user/selectors';
import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

import {
  FORMAT_YMD_DATE_FNS,
  FORMAT_READABLE_DATE_FNS,
} from '../../../constants';

import { parseDateToDateObj } from '../../../utilities';

// separate each number so the screen reader reads "number ending with 1 2 3 4"
// instead of "number ending with 1,234"
const mask = value => {
  const number = (value || '').toString().slice(-4);
  return srSubstitute(`${number}`, `ending with ${number.split('').join(' ')}`);
};

export const VeteranInformation = ({ formData }) => {
  const { ssnLastFour } = formData?.veteranInformation || {};
  const { dob, userFullName = {} } = useSelector(selectProfile);
  const { first, middle, last, suffix } = userFullName;

  const dobDateObj = parseDateToDateObj(dob || null, FORMAT_YMD_DATE_FNS);

  return (
    <>
      <div className="vads-u-border--1px vads-u-border-color--gray-medium vads-u-padding-x--2 vads-u-padding-y--1">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--1">
          Personal information
        </h4>
        <p
          className="name dd-privacy-hidden"
          data-dd-action-name="Veteran's name"
        >
          <strong>Name:</strong>{' '}
          {`${first || ''} ${middle || ''} ${last || ''}`}
          {suffix ? `, ${suffix}` : null}
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
        <p>
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

      <br role="presentation" />

      <p>
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, date of birth, or Social Security
        number. If you need to change this information, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
        through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>
      <a
        href="/resources/how-to-change-your-legal-name-on-file-with-va/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Find more detailed instructions for how to change your legal name (opens
        in new tab)
      </a>
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
