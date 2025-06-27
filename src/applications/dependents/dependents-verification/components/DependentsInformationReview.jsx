import React from 'react';
import PropTypes from 'prop-types';

import { maskID } from '../../shared/utils';

export const DependentsInformationReview = ({ data, goToPath }) => {
  const { dependents, hasDependentsStatusChanged = '' } = data || {};

  const onEditClick = () => {
    sessionStorage.setItem('onReviewPage', 'true');
    goToPath('/dependents', { force: true });
  };

  return (
    <div className="form-review-panel-page">
      <va-additional-info trigger="Why you can’t edit your dependents’ personal information online">
        <p>
          To protect your dependent’s personal information, we don’t allow
          online changes to your dependents’ names, dates of birth, or Social
          Security numbers. If you need to change this information,{' '}
          <strong>
            call us at <va-telephone contact="8008271000" />
          </strong>
          . We’re here
          <strong> Monday through Friday, 8:00 a.m to 9:00 p.m ET</strong>. If
          you have hearing loss, call <va-telephone contact="711" tty />
        </p>
      </va-additional-info>

      {dependents?.length > 0 ? (
        dependents?.map((dep, index) => (
          <React.Fragment key={index}>
            <h4 className="vads-u-font-size--h5">
              {`${dep.fullName.first} ${dep.fullName.last}`}
            </h4>
            <dl key={index} className="review vads-u-margin-y--4">
              <div className="review-row">
                <dt>First name</dt>
                <dd
                  className="dd-privacy-mask"
                  data-dd-action-name="Dependent's first name"
                >
                  {dep.fullName.first}
                </dd>
              </div>
              {dep.fullName.middle && (
                <div className="review-row">
                  <dt>Middle name</dt>
                  <dd
                    className="dd-privacy-mask"
                    data-dd-action-name="Dependent's middle name"
                  >
                    {dep.fullName.middle}
                  </dd>
                </div>
              )}
              <div className="review-row">
                <dt>Last name</dt>
                <dd
                  className="dd-privacy-mask"
                  data-dd-action-name="Dependent's last name"
                >
                  {dep.fullName.last}
                </dd>
              </div>
              {dep.fullName.suffix && (
                <div className="review-row">
                  <dt>Suffix</dt>
                  <dd
                    className="dd-privacy-mask"
                    data-dd-action-name="Dependent's name suffix"
                  >
                    {dep.fullName.suffix}
                  </dd>
                </div>
              )}
              <div className="review-row">
                <dt>Social Security number</dt>
                <dd
                  className="dd-privacy-hidden"
                  data-dd-action-name="Dependent SSN"
                >
                  {maskID(dep.ssnLastFour)}
                </dd>
              </div>
              <div className="review-row">
                <dt>Date of birth</dt>
                <dd
                  className="dd-privacy-mask"
                  data-dd-action-name="Dependent's date of birth"
                >
                  {dep.dob}
                </dd>
              </div>
              <div className="review-row">
                <dt>Age</dt>
                <dd
                  className="dd-privacy-mask"
                  data-dd-action-name="Dependent's age"
                >
                  {dep.age} years old
                </dd>
              </div>
              <div className="review-row">
                <dt>Relationship</dt>
                <dd
                  className="dd-privacy-mask"
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
          Status of dependents
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
          <dt>Has the status of your dependents changed</dt>
          <dd>{hasDependentsStatusChanged === 'Y' ? 'Yes' : 'No'}</dd>
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
