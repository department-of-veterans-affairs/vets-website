import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { selectProfile } from 'platform/user/selectors';
import { formatDateParsedZoneLong } from 'platform/utilities/date/index';

import { maskID, getFullName } from '../../shared/utils';

/**
 * Veteran Information Review Component
 * @typedef {object} VeteranInformationReviewProps
 * @property {object} formData - form data
 *
 * @param {VeteranInformationReviewProps} props - Component props
 * @returns {React.Component} - Veteran information review page
 */
export const VeteranInformation = ({ formData }) => {
  const { ssnLastFour } = formData?.veteranInformation || {};
  const { dob, userFullName = {} } = useSelector(selectProfile);

  const dobDate = dob ? formatDateParsedZoneLong(dob) : null;

  return (
    <>
      <h3>Your personal information</h3>
      <p>
        This is part of the information we’ll submit on your behalf for your
        verification of dependents (VA Form 21-0538).
      </p>
      <va-card>
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--1">
          Personal information
        </h4>
        <dl>
          <div className="item vads-u-display--flex vads-u-justify-content--start">
            <dt className="vads-u-margin-bottom--1">
              <strong>Name:&nbsp;</strong>
            </dt>
            <dd
              className="name dd-privacy-hidden"
              data-dd-action-name="Veteran’s name"
            >
              {getFullName(userFullName)}
            </dd>
          </div>
          {ssnLastFour ? (
            <div className="item vads-u-display--flex vads-u-justify-content--start">
              <dt className="ssn vads-u-margin-bottom--1">
                <strong>Last 4 digits of Social Security number:&nbsp;</strong>
              </dt>
              <dd
                className="dd-privacy-mask"
                data-dd-action-name="Veteran’s SSN"
              >
                {maskID(ssnLastFour, '')}
              </dd>
            </div>
          ) : null}
          <div className="item vads-u-display--flex vads-u-justify-content--start">
            <dt>
              <strong>Date of birth:&nbsp;</strong>
            </dt>
            <dd
              className="dob dd-privacy-mask"
              data-dd-action-name="Veteran’s date of birth"
            >
              {dobDate}
            </dd>
          </div>
        </dl>
      </va-card>

      <p className="vads-u-margin-top--2">
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, date of birth, or Social Security
        number. If you need to change this information, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone tty contact="711" />
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
      <div className="vads-u-padding-bottom--2" />
    </>
  );
};

VeteranInformation.propTypes = {
  formData: PropTypes.shape({
    veteranInformation: PropTypes.shape({
      ssnLastFour: PropTypes.string,
    }),
  }),
};

export default VeteranInformation;
