// Node modules.
import React, { useState } from 'react';
import './styles.scss';

export const App = () => {
  // useState hooks
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showFeedbackReport, setShowFeedbackReport] = useState(true);
  const [showProblemReport, setShowProblemReport] = useState(false);

  // const deriveOptionLabel = (goodChecked, badChecked) => {
  //   if (goodChecked) {
  //     return 'Good';
  //   }

  //   if (badChecked) {
  //     return 'Bad';
  //   }
  //   return undefined;
  // };

  // function to submit the checkbox feedback for issue reporting on the page
  const submitProblemFeedback = () => {
    const checkboxBrokenLink = document.getElementById('feedback-broken-link');
    const checkboxTypo = document.getElementById('feedback-typo');
    const checkboxMissingInfo = document.getElementById(
      'feedback-missing-info',
    );
    const checkboxNotAccessible = document.getElementById(
      'feedback-not-accessible',
    );

    const brokenLinkChecked = checkboxBrokenLink && checkboxBrokenLink.checked;
    const typoChecked = checkboxTypo && checkboxTypo.checked;
    const missingInfoChecked =
      checkboxMissingInfo && checkboxMissingInfo.checked;
    const notAccessibleChecked =
      checkboxNotAccessible && checkboxNotAccessible.checked;

    const result = [];
    if (brokenLinkChecked) {
      result.push('brokenLink');
    }
    if (typoChecked) {
      result.push('typo');
    }
    if (missingInfoChecked) {
      result.push('missingInfo');
    }
    if (notAccessibleChecked) {
      result.push('notAccessible');
    }

    // console.log(`submitted the following errors: ${result}`);
    setShowProblemReport(false);

    // recordEvent({
    //   'event': 'int-radio-button-option-click',
    //   'radio-button-label': "Report a problem on this page",
    //   'radio-button-optionLabel': result.join(', ')
    //   'radio-button-required': false,
    // })

    return result;
  };

  // function to handle submitting "good bad feedback"
  const submitFeedBack = () => {
    const badElement = document.getElementById('bad');
    const goodElement = document.getElementById('good');

    // Derive the radio button fields checked status.
    const goodChecked = goodElement && goodElement.checked;
    const badChecked = badElement && badElement.checked;

    // Show error message if neither good nor bad is checked.
    if (!goodChecked && !badChecked) {
      setShowErrorMessage(true);
      return;
    }

    // recordEvent({
    //   'event': 'int-radio-button-option-click',
    //   'radio-button-label': "How do you rate your experience on this page?",
    //   'radio-button-optionLabel': deriveOptionLabel(goodChecked, badChecked), // "Good" | "Bad"
    //   'radio-button-required': false,
    // })
    setShowFeedbackReport(false);

    if (badChecked) {
      setShowProblemReport(true);
    }

    // console.log('submitted feedback');
  };

  return (
    <>
      {/* Original Good / Bad Rating component functionality */}
      {showFeedbackReport && (
        <div className="vads-u-margin-top--2">
          <legend>
            <h2 className="vads-u-margin--0 vads-u-margin-bottom--1p5 vads-u-font-size--h3">
              How do you rate your experience on this page?
            </h2>
          </legend>

          {showErrorMessage && (
            <span
              className="usa-input-error-message"
              role="alert"
              id="rating-error-message"
            >
              <span className="sr-only">Error</span> Please select an answer
            </span>
          )}

          <div
            id="rating-buttons"
            className="vads-u-display--flex vads-u-align-items--center"
          >
            <div className="radio-button">
              <input id="good" name="rating" type="radio" value="Good" />
              <label
                className="vads-u-margin--0 vads-u-margin-right--2"
                htmlFor="good"
              >
                Good
              </label>
            </div>

            <div className="radio-button">
              <input id="bad" name="rating" type="radio" value="Bad" />
              <label className="vads-u-margin--0" htmlFor="bad">
                Bad
              </label>
            </div>
          </div>
          <button
            className="usa-button usa-button-secondary vads-u-width--full medium-screen:vads-u-width--auto vads-u-margin--0 vads-u-margin-top--2p5"
            id="rating-submit"
            type="button"
            onClick={() => submitFeedBack()}
          >
            Submit Feedback
          </button>
        </div>
      )}

      {/* 2nd Question / Submit an error questions */}
      {showProblemReport && (
        <div className="vads-u-margin-top--2">
          <legend>
            <h2 className="vads-u-margin--0 vads-u-margin-bottom--1p5 vads-u-font-size--h3">
              Report a problem on this page
            </h2>
          </legend>

          <span
            className="vads-u-display--none usa-input-error-message"
            role="alert"
            id="rating-error-message"
          >
            <span className="sr-only">Error</span> Please select an answer
          </span>

          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-items--left">
            <div className="vads-u-display--flex vads-u-align-items--center">
              <input
                type="checkbox"
                id="feedback-broken-link"
                name="BrokenLink"
                value="BrokenLink"
              />
              <label
                className="vads-u-margin-y--1 vads-u-margin-right--2"
                htmlFor="BrokenLink"
              >
                Broken link or image
              </label>
            </div>

            <div className="vads-u-display--flex vads-u-align-items--center">
              <input
                type="checkbox"
                id="feedback-typo"
                name="Typo"
                value="Typo"
              />
              <label
                htmlFor="Typo"
                className="vads-u-margin-y--1 vads-u-margin-right--2"
              >
                Typo
              </label>
            </div>

            <div className="vads-u-display--flex vads-u-align-items--center">
              <input
                type="checkbox"
                id="feedback-missing-info"
                name="MissingInfo"
                value="MissingInfo"
              />
              <label
                htmlFor="MissingInfo"
                className="vads-u-margin-y--1 vads-u-margin-right--2"
              >
                Missing or outdated information
              </label>
            </div>

            <div className="vads-u-display--flex vads-u-align-items--center">
              <input
                type="checkbox"
                id="feedback-not-accessible"
                name="NotAccessible"
                value="NotAccessible"
              />
              <label
                htmlFor="NotAccessible"
                className="vads-u-margin-y--1 vads-u-margin-right--2"
              >
                Not 508 accessible
              </label>
            </div>
          </div>

          <button
            className="usa-button usa-button-secondary vads-u-width--full medium-screen:vads-u-width--auto vads-u-margin--0 vads-u-margin-top--2p5"
            id="rating-submit"
            type="button"
            onClick={() => submitProblemFeedback()}
          >
            Submit
          </button>
        </div>
      )}

      {/* Thankyou message */}
      {!showFeedbackReport &&
        !showProblemReport && (
          <div>
            <p className="vads-u-margin--0 vads-u-margin-top--2">
              Thank you for your feedback.
            </p>
          </div>
        )}
    </>
  );
};

App.propTypes = {};

export default App;
