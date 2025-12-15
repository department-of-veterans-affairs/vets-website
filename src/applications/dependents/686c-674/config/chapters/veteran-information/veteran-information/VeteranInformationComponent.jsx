import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { selectProfile } from '~/platform/user/selectors';

import {
  FORMAT_YMD_DATE_FNS,
  FORMAT_READABLE_DATE_FNS,
} from '../../../constants';

import { parseDateToDateObj } from '../../../utilities';
import { maskID } from '../../../../../shared/utils';

/**
 * @typedef {object} FormDataProps
 * @property {object} veteranInformation - Veteran information object
 * @property {string} veteranInformation.ssnLastFour - Last four digits of SSN
 * @property {string} veteranInformation.vaFileLastFour - Last four digits of VA file number
 *
 * @param {FormDataProps} props - form data
 * @returns {React.ReactElement} Veteran information component
 */
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
              {maskID(ssnLastFour, '')}
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
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone tty contact={CONTACTS['711']} />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>
      <va-link
        href="/resources/how-to-change-your-legal-name-on-file-with-va/"
        external
        text="Find more detailed instructions for how to change your legal name"
      />
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
