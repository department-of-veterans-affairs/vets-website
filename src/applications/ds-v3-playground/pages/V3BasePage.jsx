/**
 * This page is for testing the compatibility of running v3 components without Formation styling.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { VaTextarea } from '@department-of-veterans-affairs/web-components/react-bindings';

export default function V3BasePage() {
  /** @param {import('react').FormEvent | import('@department-of-veterans-affairs/web-components/dist/types/components').VaSelectCustomEvent } evt */
  function updateValue(evt) {
    const { value, name } = /** @type {HTMLInputElement} */ (evt.target);
    const display = document.getElementById(`${name}Value`);
    if (display) display.innerText = value;
  }

  const ValueDisplay = ({ id, label }) => {
    return (
      <p>
        <b>{label} Value:</b> <span id={id} />
      </p>
    );
  };
  ValueDisplay.propTypes = { id: PropTypes.string, label: PropTypes.string };

  return (
    <>
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row">
          <h1>V3 Without Formation Demo</h1>
        </div>

        {/* Textarea */}
        <div className="vads-l-row">
          <h3>Textarea component</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12  vads-u-margin--1">
              <VaTextarea
                name="v3TextArea"
                label="V3 Textarea"
                hint="This is a hint"
                onInput={e => updateValue(e)}
                uswds
              />
              <ValueDisplay label="V3 Text Area" id="v3TextAreaValue" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
