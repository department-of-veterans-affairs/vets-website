import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { scrollToTop } from 'platform/utilities/scroll';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { showV3Picklist } from '../config/utilities';

const ReviewDependents = ({
  data = {},
  setFormData,
  goBack,
  goForward,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const hasApiError = useSelector(state => state.dependents?.error || false);

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
        setFormData({ ...data, 'view:addOrRemoveDependents': { add: true } });
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
      <div
        key={index}
        className="vads-u-border--1px vads-u-border-color-gray-light vads-u-padding--2 vads-u-margin-bottom--2"
      >
        <h4 className="vads-u-margin-top--0">{name}</h4>
        <span>
          {relationship}, {labeledAge}
        </span>
      </div>
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
            You can add dependents using this form, but you won’t be able to
            remove dependents at this time.
          </p>
          <p>
            If you need to remove a dependent, please try again later or call us
            at <va-telephone contact="8008271000" /> (
            <va-telephone contact="711" />
            ).
          </p>
        </va-alert>
      )}

      {isDependentsArray &&
        dependents.length === 0 && (
          <va-alert status="info">
            <div>
              We don’t have any dependents on file for your VA benefits.
            </div>
          </va-alert>
        )}

      {hasDependents && (
        <>
          <h5>Check if your current dependents still qualify</h5>
          <p>Remove dependents if these life changes occurred:</p>
          <ul>
            <li>
              You got divorced or became widowed, <strong>or</strong>
            </li>
            <li>
              Your child died, <strong>or</strong>
            </li>
            <li>
              Your child over age 18 left full-time school, <strong>or</strong>
            </li>
            <li>Your child (either a minor or a student) got married</li>
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

      <p>Add a dependent if these changes occurred:</p>
      <ul>
        <li>
          You got married, <strong>or</strong>
        </li>
        <li>
          You gave birth or adopted a child, <strong>or</strong>
        </li>
        <li>Your child over age 18 is enrolled in school full-time</li>
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
