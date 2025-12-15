import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  scrollToReviewElement,
  openAndEditChapter,
} from '../../utilities/review';

const ErrorLinks = props => {
  const { appType, testId, errors, router, formConfig } = props;
  const errorRef = useRef(null);
  const [hadErrors, setHadErrors] = useState(false);

  useEffect(
    () => {
      // Update hadErrors state based on errors
      if (!hadErrors && errors.length > 0) {
        setHadErrors(true);
      }
      // Note: We don't reset hadErrors when errors are cleared because we want to
      // show the "resolved" message. The early return below handles the case where
      // there are no errors and we haven't had errors before.

      // Move focus to legend
      if (
        errors.length > 0 &&
        errorRef.current &&
        !errorRef.current.classList.contains('has-focused')
      ) {
        // initially focus on alert legend immediately above error links
        errorRef.current.focus();
        errorRef.current.classList.add('has-focused');
      }
    },
    [errors, errorRef, hadErrors],
  );

  const resolved = hadErrors && errors.length === 0;

  // Don't render alert if there are no errors and we haven't had errors before
  // Only show alert when there are actual errors or when errors were resolved
  if (errors.length === 0 && !hadErrors) {
    return null;
  }

  return (
    <va-alert
      status="error"
      class="schemaform-failure-alert vads-u-margin-top--4"
      data-testid={testId}
    >
      <h2
        slot="headline"
        aria-describedby="missing-info-alert-legend"
        className="schemaform-warning-header vads-u-margin-top--0"
        tabIndex={-1}
        ref={errorRef}
      >
        {resolved
          ? `Thank you for completing your ${appType}`
          : `Your ${appType} is missing some information`}
      </h2>
      {resolved ? (
        `Try submitting your ${appType} again.`
      ) : (
        <>
          <p aria-describedby="missing-info-alert-legend">
            You’ll need to fill in the missing information before you can submit
            your {appType}
          </p>
          <fieldset>
            <legend
              id="missing-info-alert-legend"
              className="vads-u-font-size--base"
            >
              {`Please return to the following ${
                errors.length === 1 ? 'part' : `${errors.length} parts`
              } of the form:`}
            </legend>
            <ul className="vads-u-margin-left--2 error-message-list">
              {errors.map(error => {
                const handleClick = event => {
                  event.preventDefault();
                  // Redirect for newDisabilities or condition errors that should go to claimType page
                  // Other errors on the claimType page should use default behavior
                  if (
                    (error.name === 'newDisabilities' ||
                      error.name === 'condition') &&
                    error.pageKey === 'claimType' &&
                    router &&
                    formConfig
                  ) {
                    const chapter = formConfig.chapters?.[error.chapterKey];
                    const page = chapter?.pages?.[error.pageKey];
                    if (page?.path) {
                      const urlPrefix = formConfig.urlPrefix || '/';
                      router.push(`${urlPrefix}${page.path}`);
                      return;
                    }
                  }
                  // Otherwise use default behavior (open in edit mode)
                  scrollToReviewElement(error);
                  openAndEditChapter(error);
                };

                return (
                  <li key={error.name}>
                    {error.chapterKey ? (
                      <a // eslint-disable-line jsx-a11y/anchor-is-valid
                        href="#"
                        onClick={handleClick}
                      >
                        {error.message}
                      </a>
                    ) : (
                      error.message
                    )}
                  </li>
                );
              })}
            </ul>
          </fieldset>
        </>
      )}
    </va-alert>
  );
};

const mapStateToProps = state => ({
  errors: state.form?.formErrors?.errors || [],
});

ErrorLinks.propTypes = {
  appType: PropTypes.string,
  errors: PropTypes.array,
  formConfig: PropTypes.object,
  router: PropTypes.object,
  testId: PropTypes.string,
};

export default withRouter(connect(mapStateToProps)(ErrorLinks));

export { ErrorLinks };
