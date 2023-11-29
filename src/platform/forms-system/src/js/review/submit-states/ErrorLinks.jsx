import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  scrollToReviewElement,
  openAndEditChapter,
} from '../../utilities/review';

const ErrorLinks = props => {
  const { appType, testId, errors } = props;
  const errorRef = useRef(null);
  const [hadErrors, setHadErrors] = useState(false);

  const resolved = hadErrors && errors.length === 0;

  if (!hadErrors && errors.length > 0) {
    setHadErrors(true);
  }

  useEffect(
    () => {
      // Move focus to legend
      if (
        errors.length > 0 &&
        !errorRef.current.classList.contains('has-focused')
      ) {
        // initially focus on alert legend immediately above error links
        errorRef.current.focus();
        errorRef.current.classList.add('has-focused');
      }
    },
    [errors, errorRef],
  );

  return (
    <div
      className="usa-alert usa-alert-error schemaform-failure-alert"
      data-testid={testId}
    >
      <div className="usa-alert-body">
        <h3
          aria-describedby="missing-info-alert-legend"
          className="schemaform-warning-header vads-u-margin-top--0"
          tabIndex={-1}
          ref={errorRef}
        >
          {resolved
            ? `Thank you for completing your ${appType}`
            : `Your ${appType} is missing some information`}
        </h3>
        {resolved ? (
          `Try submitting your ${appType} again.`
        ) : (
          <>
            <p aria-describedby="missing-info-alert-legend">
              You’ll need to fill in the missing information before you can
              submit your {appType}
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
                {errors.map(error => (
                  <li key={error.name}>
                    {error.chapterKey ? (
                      <a // eslint-disable-line jsx-a11y/anchor-is-valid
                        href="#"
                        onClick={event => {
                          event.preventDefault();
                          scrollToReviewElement(error);
                          openAndEditChapter(error);
                        }}
                      >
                        {error.message}
                      </a>
                    ) : (
                      error.message
                    )}
                  </li>
                ))}
              </ul>
            </fieldset>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  errors: state.form?.formErrors?.errors || [],
});

ErrorLinks.propTypes = {
  appType: PropTypes.string,
  errors: PropTypes.array,
  testId: PropTypes.string,
};

export default connect(mapStateToProps)(ErrorLinks);

export { ErrorLinks };
