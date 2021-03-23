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
    [renderErrors, errorRef],
  );

  let alert;
  if (renderErrors) {
    if (!hadErrors && errorsLen > 0) {
      setHadErrors(true);
    }

    const resolved = hadErrors && errorsLen === 0;

    // Once all errors have been resolved, we can update the message
    const errorMessage = resolved ? (
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
              errorsLen === 1 ? 'part' : `${errorsLen} parts`
            } of the form:`}
          </legend>
          <ul className="vads-u-margin-left--2 error-message-list">
            {errors.map(error => (
              <li key={error.name}>
                {error.chapterKey ? (
                  <a
                    href="#"
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
      </>
    );
    alert = (
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
          {errorMessage}
        </div>
      </div>
    );
  } else {
    alert = (
      <ErrorMessage
        active
        title={`We’re sorry. Some information in your ${appType} is missing or not valid.`}
      >
        <p>
          Please check each section of your {appType} to make sure you’ve filled
          out all the information that is required.
        </p>
      </ErrorMessage>
    );
  }

  return (
    <>
      <Row>
        <Column role="alert" testId={testId}>
          {alert}
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
