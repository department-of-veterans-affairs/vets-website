import React from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import {
  FORMAT_READABLE_DATE_FNS,
  FORMAT_YMD_DATE_FNS,
  mask,
  parseDateToDateObj,
} from '../helpers';

const applicantFullnameReviewPage = ({ data }) => {
  const { applicantFullName: fullName, dateOfBirth, ssn } = data;

  const dobDateObj = parseDateToDateObj(
    dateOfBirth || null,
    FORMAT_YMD_DATE_FNS,
  );
  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Name and date of birth
        </h4>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Name</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="Veteran's name"
          >
            {`${fullName.first} ${fullName.middle} ${fullName.last}`}
          </dd>
        </div>
        <div className="review-row">
          <dt>Last 4 digits of Social Security number</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="Veteran's SSN">
            {mask(ssn)}
          </dd>
        </div>
        <div className="review-row">
          <dt>Date of birth</dt>
          {isValid(dobDateObj) ? (
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="Veteran's date of birth"
            >
              {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
            </dd>
          ) : null}
        </div>
      </dl>
    </div>
  );
};
applicantFullnameReviewPage.propTypes = {
  data: PropTypes.object,
};
export default applicantFullnameReviewPage;
