import React, { useState, useEffect } from 'react';
import environment from 'platform/utilities/environment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Back from './Back';
import ProgressButton from '../../components/ProgressButton';
import { Column, Row } from 'platform/forms/components/common/grid';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import { focusAndScrollToReviewElement } from '../../utilities/ui';
import { openReviewChapter, setEditMode } from '../../actions';

import { VA_FORM_IDS } from 'platform/forms/constants';

function ValidationError(props) {
  const { appType, formConfig, onBack, onSubmit, testId, formErrors } = props;

  const errors = formErrors?.errors || [];
  const errorsLen = errors.length;
  const [hadErrors, setHadErrors] = useState(false);

  useEffect(() => {
    // Move focus
    const errorFocus = document.querySelector('.error-message-focus');
    if (errorFocus && !errorFocus.classList.contains('has-focused')) {
      // focus on legend immediately above error links
      errorFocus.focus();
      errorFocus.classList.add('has-focused');
    }
  });

  // check if we're using form 526 (will make this globally apply later)
  const isForm526 = formConfig.formId === VA_FORM_IDS.FORM_21_526EZ;
  // error links need evaluation & testing before production
  const renderErrors =
    errorsLen > 0 && isForm526 && !environment.isProduction();

  if (!hadErrors && errorsLen > 0) {
    setHadErrors(true);
  }

  const resolved = hadErrors && errorsLen === 0;

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
            className="error-message-focus vads-u-font-size--base"
            tabIndex={-1}
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
          <ErrorMessage active title={errorTitle} message={errorMessage} />
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
            buttonText={`Submit ${appType}`}
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
