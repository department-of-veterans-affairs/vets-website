import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { scrollToTop } from 'platform/utilities/scroll';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { showV3Picklist } from '../config/utilities';

/**
 * @typedef {object} ReviewDependentsProps
 * @property {object} data Form data
 * @property {function} setFormData Function to update form data
 * @property {function} goBack Function to navigate to the previous page
 * @property {function} goForward Function to navigate to the next page
 * @property {React.ReactNode} contentBeforeButtons Content to render before navigation buttons
 * @property {React.ReactNode} contentAfterButtons Content to render after navigation buttons
 *
 * ReviewDependents component
 * @param {ReviewDependentsProps} props Component props
 * @returns {React.ReactElement} Review dependents component
 */
const ReviewDependents = ({
  data = {},
  setFormData,
  goBack,
  goForward,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const hasApiError = useSelector(state => !!state.dependents?.error || false);

  const dependents = data?.dependents?.awarded;
  const isDependentsArray = Array.isArray(dependents);
  const hasDependents = isDependentsArray && dependents.length > 0;
  // Check for API error or if dependents from prefill has an error
  const hasDependentError = hasApiError || !isDependentsArray;
  const showPicklist = showV3Picklist(data);

  useEffect(
    () => {
      scrollToTop();
      if (showPicklist && (hasApiError || !hasDependents)) {
        // Only allow adding dependents, not removing if dependents array is
        // empty
        setFormData({
          ...data,
          'view:addOrRemoveDependents': { add: true },
          'view:dependentsApiError': hasApiError,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showPicklist, hasApiError, hasDependents],
  );

  const renderDependentCard = (dependent, index) => {
    const { fullName, relationshipToVeteran, labeledAge } = dependent;
    const name = `${fullName?.first || ''} ${fullName?.last || ''}`.trim();
    const relationship = relationshipToVeteran || '';

    return (
      <va-card key={index} class="vads-u-padding--2 vads-u-margin-bottom--2">
        <h4
          className="vads-u-margin-top--0 dd-privacy-mask"
          data-dd-action-name="dependent name"
        >
          {name}
        </h4>
        <span>
          {relationship},{' '}
          <span className="dd-privacy-mask" data-dd-action-name="dependent age">
            {labeledAge}
          </span>
        </span>
      </va-card>
    );
  };

  return (
    <>
      <h3>Review your VA dependents</h3>

      {hasDependentError && (
        <va-alert status="error">
          <h4 slot="headline">
            We can’t access your dependent records right now
          </h4>
          <p>We’re sorry. Something went wrong on our end.</p>
          <p>
            You can add dependents using this application, but you won’t be able
            to remove dependents at this time.
          </p>
          <p>
            If you need to remove a dependent, please try again later or call us
            at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ).
          </p>
        </va-alert>
      )}

      {!hasDependentError &&
        isDependentsArray &&
        dependents.length === 0 && (
          <va-alert status="info">
            <div>
              We don’t have any dependents on file for your VA benefits.
            </div>
          </va-alert>
        )}

      {!hasDependentError &&
        hasDependents && (
          <>
            <p>
              Remove a dependent from your VA benefits if these changes
              occurred:
            </p>
            <ul>
              <li>
                You got divorced, <strong>or</strong>
              </li>
              <li>
                Your child died, <strong>or</strong>
              </li>
              <li>
                Your child (either a minor or a student) got married,{' '}
                <strong>or</strong>
              </li>
              <li>Your parent died</li>
            </ul>
            <p>
              Not reporting changes could lead to a benefit overpayment. You’d
              have to repay that money.
            </p>

            {dependents.map(renderDependentCard)}

            <h4>Check if someone is missing on your VA benefits</h4>
          </>
        )}

      <p>Add a dependent to your VA benefits if these changes occurred:</p>
      <ul>
        <li>
          You got married, <strong>or</strong>
        </li>
        <li>
          You gave birth or adopted a child, <strong>or</strong>
        </li>
        <li>
          Your unmarried child between ages 18 and 23 is enrolled in school
        </li>
      </ul>

      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} useWebComponents />
      {contentAfterButtons}
    </>
  );
};

ReviewDependents.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default ReviewDependents;
