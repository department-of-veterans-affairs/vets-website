import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { DEPENDENT_CHOICES } from '../constants';
import { maskID, calculateAge } from '../../shared/utils';

/**
 * Dependents Information Review Component
 * @typedef {object} DependentsInformationReviewProps
 * @property {object} data - form data
 * @property {function} goToPath - function to go to specific path
 *
 * @param {DependentsInformationReviewProps} props - Component props
 * @returns {React.Component} - Dependents information review page
 */
export const DependentsInformationReview = ({ data, goToPath }) => {
  const { hasDependentsStatusChanged = '' } = data || {};
  // Using dependents from Redux state because dependents are only set in the
  // form data on the dependents page; this change allows the mock server to
  // jump straight to the review page and still show dependents
  const dependents = useSelector(
    state => state.form?.data?.dependents || state.dependents?.data || [],
  );

  const onEditClick = () => {
    sessionStorage.setItem('onReviewPage', 'true');
    goToPath('/dependents', { force: true });
  };

  return (
    <div className="form-review-panel-page">
      <va-additional-info trigger="Why you can’t edit your dependents’ personal information online">
        <p>
          To protect your dependent’s personal information,{' '}
          <strong>
            we don’t allow online changes to your dependents’ names, dates of
            birth, or Social Security numbers.
          </strong>{' '}
          If you need to change this information,{' '}
          <strong>
            call us at <va-telephone contact="8008271000" />
          </strong>
          . We’re here Monday through Friday, 8:00 a.m to 9:00 p.m{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          . If you have hearing loss, call <va-telephone contact="711" tty />.
        </p>
        <p className="vads-u-padding-top--2">
          <va-link
            external
            href="/resources/how-to-change-your-legal-name-on-file-with-va/"
            text="Find more detailed instructions for how to change your dependents’ name"
          />
        </p>
      </va-additional-info>

      {dependents?.length > 0 ? (
        dependents?.map((dep, index) => (
          <React.Fragment key={index}>
            <h4
              className="vads-u-font-size--h5 dd-privacy-hidden"
              data-dd-action-name="Dependent SSN"
            >
              {dep.fullName}
            </h4>
            <dl key={index} className="review vads-u-margin-y--4">
              <div className="review-row">
                <dt>Social Security number</dt>
                <dd
                  className="dd-privacy-hidden"
                  data-dd-action-name="Dependent SSN"
                >
                  {maskID(dep.ssn)}
                </dd>
              </div>
              <div className="review-row">
                <dt>Date of birth</dt>
                <dd
                  className="dd-privacy-hidden"
                  data-dd-action-name="Dependent's date of birth"
                >
                  {dep.dob}
                </dd>
              </div>
              <div className="review-row">
                <dt>Age</dt>
                <dd
                  className="dd-privacy-hidden"
                  data-dd-action-name="Dependent's age"
                >
                  {calculateAge(dep.dateOfBirth).labeledAge ||
                    'Unable to determine'}
                </dd>
              </div>
              <div className="review-row">
                <dt>Relationship</dt>
                <dd
                  className="dd-privacy-hidden"
                  data-dd-action-name="Dependent's relationship"
                >
                  {dep.relationship}
                </dd>
              </div>
            </dl>
          </React.Fragment>
        ))
      ) : (
        <strong>No dependents found</strong>
      )}

      <div className="form-review-panel-page-header-row vads-u-margin-top--4">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Has the status of your dependents changed?
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={onEditClick}
          label="Edit dependent status"
          text="Edit"
        />
      </div>

      <dl className="review">
        <div className="review-row">
          <dt>Has the status of your dependents changed?</dt>
          <dd>{DEPENDENT_CHOICES[hasDependentsStatusChanged]}</dd>
        </div>
      </dl>
    </div>
  );
};

DependentsInformationReview.propTypes = {
  data: PropTypes.shape({
    dependents: PropTypes.arrayOf(
      PropTypes.shape({
        fullName: PropTypes.shape({
          first: PropTypes.string,
          middle: PropTypes.string,
          last: PropTypes.string,
          suffix: PropTypes.string,
        }),
        relationship: PropTypes.string,
        dob: PropTypes.string,
        ssnLastFour: PropTypes.string,
        age: PropTypes.number,
        removalDate: PropTypes.string,
      }),
    ),
    hasDependentsStatusChanged: PropTypes.oneOf(['Y', 'N']),
  }),
  goToPath: PropTypes.func,
};
