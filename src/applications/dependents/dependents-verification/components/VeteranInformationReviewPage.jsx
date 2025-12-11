import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { selectProfile } from 'platform/user/selectors';
import { formatDateParsedZoneLong } from 'platform/utilities/date';

import { maskID } from '../../shared/utils';

/**
 * Veteran information Review Component
 * @typedef {object} VeteranInformationReviewProps
 * @property {object} formData - form data
 *
 * @param {VeteranInformationReviewProps} props - Component props
 * @returns {React.Component} - Veteran information review page
 */
const VeteranInformationReviewPage = ({ formData }) => {
  const { ssnLastFour } = formData?.veteranInformation || {};
  const { dob, userFullName = {} } = useSelector(selectProfile);
  const { first, middle, last, suffix } = userFullName;

  const dobDateObj = dob ? formatDateParsedZoneLong(dob) : null;

  const showError = message => (
    <span className="usa-input-error-message">{message}</span>
  );

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <va-additional-info trigger="Why you can’t edit your personal information online">
          <div className="vads-u-padding-bottom--2">
            To protect your personal information,{' '}
            <strong>
              we don’t allow online changes to your name, date of birth, or
              Social Security number
            </strong>
            . If you need to change this information,{' '}
            <strong>
              call us at <va-telephone contact="8008271000" />
            </strong>
            . We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you
            have hearing loss, call <va-telephone contact="771" tty />.
          </div>
          <va-link
            href="/resources/how-to-change-your-legal-name-on-file-with-va/"
            external
            text="Find more detailed instructions for how to change your legal name"
            class="vads-u-margin-top--1"
          />
        </va-additional-info>

        <h4 className="form-review-panel-page-header vads-u-margin--0 vads-u-padding-top--2">
          Your personal information
        </h4>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>First Name</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="first name">
            {first || ''}
          </dd>
        </div>
        {middle ? (
          <div className="review-row">
            <dt>Middle name</dt>
            <dd className="dd-privacy-hidden" data-dd-action-name="middle name">
              <strong>{middle}</strong>
            </dd>
          </div>
        ) : null}
        <div className="review-row">
          <dt>Last name</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="last name">
            <strong>{last || showError('Missing last name')}</strong>
          </dd>
        </div>
        {suffix ? (
          <div className="review-row">
            <dt>Suffix</dt>
            <dd className="dd-privacy-hidden" data-dd-action-name="name suffix">
              <strong>{suffix}</strong>
            </dd>
          </div>
        ) : null}
        <div className="review-row">
          <dt>Social Security number</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="SSN">
            <strong>
              {(ssnLastFour && maskID(ssnLastFour)) || showError('Missing SSN')}
            </strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Date of birth</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="date of birth">
            <strong>{dobDateObj ?? showError('Missing date of birth')}</strong>
          </dd>
        </div>
      </dl>
    </div>
  );
};

VeteranInformationReviewPage.propTypes = {
  formData: PropTypes.shape({
    veteranInformation: PropTypes.shape({
      ssnLastFour: PropTypes.string,
    }),
  }),
};

export default VeteranInformationReviewPage;
