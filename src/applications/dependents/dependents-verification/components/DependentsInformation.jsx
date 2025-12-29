import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from 'platform/utilities/ui';

import { DEPENDENT_CHOICES, DEPENDENT_TITLE } from '../constants';
import { maskID, calculateAge } from '../../shared/utils';

import { removeEditContactInformation } from '../util/contact-info';

/**
 * Display Dependent Information
 * @typedef {object} DependentsInformationProps
 * @property {object} data - form data
 * @property {function} goForward - function to go to next page
 * @property {function} goToPath - function to go to specific path
 * @property {function} setFormData - function to set form data
 * @property {node} contentBeforeButtons - content to render before buttons
 * @property {node} contentAfterButtons - content to render after buttons
 *
 * @param {DependentsInformationProps} props - Component props
 * @returns {React.Component} - Dependents information page
 */
export const DependentsInformation = ({
  data = {},
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dependents = useSelector(state => state.dependents?.data || []);
  const [showError, setShowError] = useState(false);
  removeEditContactInformation(); // clearing edit flag just in case

  const handlers = {
    onValueChange: ({ detail }) => {
      setFormData({
        ...data,
        dependents,
        hasDependentsStatusChanged: detail.value,
      });
      setShowError(false);
    },
    onSubmit: () => {
      if (!data.hasDependentsStatusChanged) {
        setShowError(true);
        setTimeout(() => {
          // Scroll to & focus on role="alert" error inside radio group
          scrollToFirstError({ focusOnAlertRole: true });
        });
        return;
      }
      if (data.hasDependentsStatusChanged === 'Y') {
        goToPath('/exit-form', { force: true });
      } else {
        goForward(data);
      }
    },
    goBack: () => {
      goToPath('/veteran-contact-information', { force: true });
    },
  };

  return (
    <>
      <h3>Dependents on your disability benefits</h3>
      <h4>Check if your current dependents still qualify</h4>
      <p>
        These life changes may affect your dependents’ status and their
        eligibility:
      </p>
      <ul>
        <li>
          You got divorced or became widowed, <strong>or</strong>
        </li>
        <li>
          Your child passed away, <strong>or</strong>
        </li>
        <li>
          Your child over age 18 left full-time school, <strong>or</strong>
        </li>
        <li>Your child (either a minor or a student) got married</li>
      </ul>
      <p>
        Not reporting changes could lead to a benefit overpayment. You’d have to
        repay that money.
      </p>

      {dependents.length > 0 ? (
        dependents.map((dependent = {}, index) => {
          return (
            <div className="vads-u-margin-bottom--2" key={index}>
              <va-card>
                <h4
                  className="vads-u-font-size--h4 vads-u-margin-top--0 dd-privacy-hidden"
                  data-dd-action-name="Dependent's name"
                >
                  {dependent.fullName}
                </h4>
                <dl>
                  <div className="item vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
                    <dt>Relationship:&nbsp;</dt>
                    <dd
                      className="dd-privacy-hidden"
                      data-dd-action-name="Dependent's relationship"
                    >
                      {dependent.relationship}
                    </dd>
                  </div>
                  <div className="item vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
                    <dt>Date of birth:&nbsp;</dt>
                    <dd
                      className="dd-privacy-hidden"
                      data-dd-action-name="Dependent's date of birth"
                    >
                      {dependent.dob}
                    </dd>
                  </div>
                  {dependent.dob && (
                    <div className="item vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
                      <dt>Age:&nbsp;</dt>
                      <dd
                        className="dd-privacy-hidden"
                        data-dd-action-name="Dependent's age"
                      >
                        {calculateAge(dependent.dateOfBirth).labeledAge ||
                          'Unable to determine'}
                      </dd>
                    </div>
                  )}
                  <div className="item vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
                    <dt>SSN:&nbsp;</dt>
                    <dd
                      className="dd-privacy-hidden"
                      data-dd-action-name="Dependent's last four of SSN"
                    >
                      {maskID(dependent.ssn)}
                    </dd>
                  </div>
                  {dependent.removalDate && (
                    <div className="removal-date vads-u-margin-top--2">
                      <dt className="vads-u-display--inline-block vads-u-width--auto">
                        <strong>Automatic removal date:&nbsp;</strong>
                      </dt>
                      <dd className="vads-u-display--inline-block vads-u-width--auto">
                        <span
                          className="dd-privacy-hidden"
                          data-dd-action-name="Dependent's removal date"
                        >
                          {dependent.removalDate}
                        </span>
                      </dd>
                      <dd className="vads-u-margin-top--1">
                        <va-alert status="info" background-only visible>
                          <strong>Note:</strong> If no other action is taken,
                          this dependent will be removed automatically when they
                          turn 18, which may reduce the amount you receive each
                          month. If this child is continuing education, they
                          need to be added back to your benefits.{' '}
                          <va-link
                            href="/exit-form"
                            text="Learn about how to add a dependent"
                          />
                        </va-alert>
                      </dd>
                    </div>
                  )}
                </dl>
              </va-card>
            </div>
          );
        })
      ) : (
        <h4>No dependents found</h4>
      )}
      <h4>Check if someone is missing on your VA benefits</h4>
      <p>You may be able to add a dependent if these changes occurred:</p>
      <ul>
        <li>
          You got married, <strong>or</strong>
        </li>
        <li>
          You gave birth or adopted a child, <strong>or</strong>
        </li>
        <li>
          Your child became seriously disabled before turning 18,{' '}
          <strong>or</strong>
        </li>
        <li>
          Your child over age 18 is enrolled in school full-time,{' '}
          <strong>or</strong>
        </li>
        <li>You became the caregiver for a parent</li>
      </ul>

      <VaRadio
        label={DEPENDENT_TITLE}
        required
        onVaValueChange={handlers.onValueChange}
        label-header-level="3"
        class="vads-u-margin-top--2"
        error={showError ? 'Select an option' : null}
      >
        <va-radio-option
          name="hasDependentsStatusChanged"
          value="Y"
          label={DEPENDENT_CHOICES.Y}
          tile
          checked={data.hasDependentsStatusChanged === 'Y'}
        />
        <va-radio-option
          name="hasDependentsStatusChanged"
          value="N"
          label={DEPENDENT_CHOICES.N}
          tile
          checked={data.hasDependentsStatusChanged === 'N'}
        />
      </VaRadio>

      <p className="vads-u-margin-top--4" />
      {contentBeforeButtons}
      <FormNavButtons
        goBack={handlers.goBack}
        goForward={handlers.onSubmit}
        submitToContinue
        useWebComponents
      />
      {contentAfterButtons}
    </>
  );
};

DependentsInformation.propTypes = {
  contentAfterButtons: PropTypes.node.isRequired,
  contentBeforeButtons: PropTypes.node.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,

  data: PropTypes.shape({
    dependents: PropTypes.arrayOf(
      PropTypes.shape({
        fullName: PropTypes.string,
        relationship: PropTypes.string,
        dob: PropTypes.string,
        age: PropTypes.number,
        ssnLastFour: PropTypes.string,
        removalDate: PropTypes.string,
      }),
    ),
    hasDependentsStatusChanged: PropTypes.string,
  }),
};
