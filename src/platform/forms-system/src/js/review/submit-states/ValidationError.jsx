import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Back from './Back';
import ProgressButton from '../../components/ProgressButton';
import { Column, Row } from 'platform/forms/components/common/grid';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';

import { focusAndScrollToReviewElement } from '../../utilities/ui';
import { openReviewChapter, setEditMode } from '../../actions';

function ValidationError(props) {
  const {
    appType,
    buttonText,
    formConfig,
    onBack,
    onSubmit,
    testId,
    form,
  } = props;

  const errorRef = useRef(null);
  const errors = form.formErrors?.errors || [];
  const errorsLen = errors.length;
  const [hadErrors, setHadErrors] = useState(false);

  // error links need evaluation & testing before production
  const renderErrors =
    (errorsLen > 0 && formConfig.showReviewErrors?.()) || false;

  useEffect(
    () => {
      // Move focus to legend
      if (renderErrors && !errorRef.current.classList.contains('has-focused')) {
        // initially focus on alert legend immediately above error links
        errorRef.current.focus();
        errorRef.current.classList.add('has-focused');
      }
    },
    [renderErrors],
  );

  if (!hadErrors && errorsLen > 0) {
    setHadErrors(true);
  }
  const resolved = hadErrors && errorsLen === 0;

  // Once all errors have been resolved, we can update the message
  const errorTitle = resolved
    ? `The information in your ${appType} now appears to be valid`
    : `We’re sorry. Some information in your ${appType} is missing or
      not valid.`;

  const errorMessage = resolved ? (
    `please try resubmitting your ${appType} now.`
  ) : (
    <>
      {renderErrors && (
        <fieldset>
          <legend
            className="vads-u-font-size--base"
            tabIndex={-1}
            ref={errorRef}
          >
            The following required
            {errorsLen === 1 ? ' item is ' : ' items are '}
            preventing submission:
          </legend>
          <ul className="vads-u-margin-left--3">
            {errors.map(error => (
              <li key={error.name} className="error-message-list-item">
                {error.chapterKey ? (
                  <a
                    href="#"
                    className="error-message-list-link"
                    onClick={event => {
                      event.preventDefault();
                      props.openReviewChapter(error.chapterKey);
                      props.setEditMode(
                        error.pageKey,
                        true, // enable edit mode
                        error.index || null,
                      );
                      // props.formContext.onError();
                      focusAndScrollToReviewElement(error);
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
      )}
      <p>
        Please check each section of your {appType} to make sure you’ve filled
        out all the information that is required.
      </p>
    </>
  );

  return (
    <>
      <Row>
        <Column role="alert" testId={testId}>
          <ErrorMessage active title={errorTitle}>
            {errorMessage}
          </ErrorMessage>
        </Column>
      </Row>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons">
        <Column classNames="small-6 medium-5">
          <Back onButtonClick={onBack} />
        </Column>
        <Column classNames="small-6 medium-5">
          <ProgressButton
            onButtonClick={onSubmit}
            buttonText={buttonText}
            buttonClass="usa-button-primary"
          />
        </Column>
        <Column classNames="small-1 medium-1 end">
          <div className="hidden">&nbsp;</div>
        </Column>
      </Row>
    </>
  );
}

const mapDispatchToProps = {
  openReviewChapter,
  setEditMode,
};

ValidationError.propTypes = {
  appType: PropTypes.string,
  buttonText: PropTypes.string,
  formConfig: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  openReviewChapter: PropTypes.func,
  setEditMode: PropTypes.func,
};

export default connect(
  state => state,
  mapDispatchToProps,
)(ValidationError);

export { ValidationError };
