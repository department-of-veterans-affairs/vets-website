import React from 'react';
import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';

const maskSSN = ssnLastFour =>
  srSubstitute(
    `●●●–●●-${ssnLastFour}`,
    `ending with ${ssnLastFour.split('').join(' ')}`,
  );

const dependents = [
  {
    fullName: {
      first: 'Morty',
      middle: 'Charles',
      last: 'Smith',
      suffix: 'None',
    },
    relationship: 'Child',
    dob: 'January 4, 2011',
    ssnLastFour: '6791',
    age: 14,
  },
  {
    fullName: {
      first: 'Summer',
      middle: 'Susan',
      last: 'Smith',
      suffix: 'None',
    },
    relationship: 'Child',
    dob: 'August 1, 2008',
    ssnLastFour: '6790',
    age: 17,
    removalDate: 'August 1, 2026',
  },
];

const DependentsInformation = () => {
  return (
    <>
      <h3>Dependents on your VA benefits</h3>

      {dependents.map((dep, index) => (
        <div className="vads-u-margin-bottom--2" key={index}>
          <va-card>
            <h4 className="vads-u-font-size--h4 vads-u-margin-top--0">
              {`${dep.fullName.first} ${
                dep.fullName.middle ? `${dep.fullName.middle} ` : ''
              }${dep.fullName.last}`}
            </h4>
            <div>Relationship: {dep.relationship}</div>
            <div>Date of birth: {dep.dob}</div>
            {dep.age && <div>Age: {dep.age} years old</div>}
            <div>
              SSN:{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Dependent's SSN"
              >
                {maskSSN(dep.ssnLastFour)}
              </span>
            </div>
            {dep.removalDate && (
              <>
                <p>
                  <strong>Automatic removal date:</strong> {dep.removalDate}
                </p>
                <va-alert status="info" background-only visible>
                  <p>
                    <strong>Note:</strong> If no other action is taken, this
                    dependent will be removed automatically when they turn 18,
                    which may reduce the amount you receive each month. If this
                    child is continuing education, they need to be added back to
                    your benefits.{' '}
                    <va-link
                      href="https://www.va.gov/view-change-dependents/add-dependent/"
                      text="Learn about how to add a student"
                    />
                  </p>
                </va-alert>
              </>
            )}
          </va-card>
        </div>
      ))}

      <p>
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your dependents’ names, dates of birth, or
        Social Security numbers. If you need to change this information, call us
        at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>

      <va-link
        href="/resources/how-to-change-your-dependents-name/"
        external
        text="Find more detailed instructions for how to change your dependents’ name"
      />
    </>
  );
};

const DependentsInformationReview = ({ data, goToPath }) => {
  const { hasDependentsStatusChanged = '' } = data || {};

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

      {dependents.map((dep, index) => (
        <>
          <h4 className="vads-u-font-size--h5">
            {`${dep.fullName.first} ${dep.fullName.last}`}
          </h4>
          <dl key={index} className="review vads-u-margin-y--4">
            <div className="review-row">
              <dt>First name</dt>
              <dd>{dep.fullName.first}</dd>
            </div>
            <div className="review-row">
              <dt>Middle name</dt>
              <dd>{dep.fullName.middle}</dd>
            </div>
            <div className="review-row">
              <dt>Last name</dt>
              <dd>{dep.fullName.last}</dd>
            </div>
            <div className="review-row">
              <dt>Suffix</dt>
              <dd>{dep.fullName.suffix}</dd>
            </div>
            <div className="review-row">
              <dt>Social Security number</dt>
              <dd
                className="dd-privacy-hidden"
                data-dd-action-name="Dependent SSN"
              >
                {maskSSN(dep.ssnLastFour)}
              </dd>
            </div>
            <div className="review-row">
              <dt>Date of birth</dt>
              <dd>{dep.dob}</dd>
            </div>
            <div className="review-row">
              <dt>Age</dt>
              <dd>{dep.age} years old</dd>
            </div>
            <div className="review-row">
              <dt>Relationship</dt>
              <dd>{dep.relationship}</dd>
            </div>
          </dl>
        </>
      ))}

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
    hasDependentsStatusChanged: PropTypes.oneOf(['Y', 'N']),
  }),
  goToPath: PropTypes.func,
};

export { DependentsInformation, DependentsInformationReview };
