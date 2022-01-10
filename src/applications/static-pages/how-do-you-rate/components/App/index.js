// Node modules.
import React from 'react';
import './styles.scss';

export const App = () => {
  const submitFeedback = () => {
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
    return result;

    // recordEvent({
    //   'event': 'int-radio-button-option-click',
    //   'radio-button-label': "Report a problem on this ",
    //   'radio-button-optionLabel': result.join(','), // "Good" | "Bad"
    //   'radio-button-required': false,
    // })
  };
  return (
    <form onSubmit={() => submitFeedback()} className="vads-u-margin-top--2">
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
          <input type="checkbox" id="feedback-typo" name="Typo" value="Typo" />
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
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

App.propTypes = {};

export default App;
