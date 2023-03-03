/**
 * This page is for testing the compatibility of running v1 and v3 components on the same page.
 */

import React from 'react';
import PropTypes from 'prop-types';
// import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  VaRadio,
  VaRadioOption,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/web-components/react-bindings';

export default function V1V3Page() {
  /** @param {import('react').FormEvent | import('@department-of-veterans-affairs/web-components/dist/types/components').VaSelectCustomEvent } evt */
  function updateValue(evt) {
    const { value, name } = /** @type {HTMLInputElement} */ (evt.target);
    const display = document.getElementById(`${name}Value`);
    if (display) display.innerText = value;
  }

  /**
   * @param {{value: string}} value
   * @param {string} id
   */
  function updateRadioValue({ value }, id) {
    const display = document.getElementById(`${id}RadioValue`);
    if (display) display.innerText = value;
  }
  updateRadioValue({ value: 'Radio One' }, 'v1');
  updateRadioValue({ value: 'Radio One' }, 'v3');

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
          <h1>V1 and V3 Side-by-Side Demo</h1>
        </div>

        {/* Text Input Comparison */}
        <div className="vads-l-row">
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <VaTextInput
                name="v1Input"
                label="V1 Input"
                hint="This is a hint"
                onInput={e => updateValue(e)}
              />
              <ValueDisplay label="V1 Input" id="v1InputValue" />
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <VaTextInput
                uswds
                name="v3Input"
                label="V3 Input"
                hint="This is a hint"
                onInput={e => updateValue(e)}
              />
              <ValueDisplay label="V3 Input" id="v3InputValue" />
            </div>
          </div>
        </div>

        {/* Select Comparison */}
        <div className="vads-l-row">
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <VaSelect
                name="v1Select"
                label="V1 Select"
                onVaSelect={updateValue}
              >
                <option value=""> </option>
                <option value="Select One">Select One</option>
                <option value="Select Two">Select Two</option>
                <option value="Select Three">Select Three</option>
              </VaSelect>
              <ValueDisplay label="V1 Select" id="v1SelectValue" />
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <VaSelect
                uswds
                name="v3Select"
                label="V3 Select"
                onVaSelect={updateValue}
              >
                <option value="Select One">Select One</option>
                <option value="Select Two">Select Two</option>
                <option value="Select Three">Select Three</option>
              </VaSelect>
              <ValueDisplay label="V3 Select" id="v3SelectValue" />
            </div>
          </div>
        </div>

        {/* Radio Comparison */}
        <div className="vads-l-row">
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <VaRadio
                label="V1 Radio"
                onVaValueChange={e => updateRadioValue(e.detail, 'v1')}
              >
                <VaRadioOption
                  label="Radio One"
                  name="v1RadioOptOne"
                  value="Radio One"
                  checked
                />
                <VaRadioOption
                  label="Radio Two"
                  name="v1RadioOptTwo"
                  value="Radio Two"
                />
                <VaRadioOption
                  label="Radio Three"
                  name="v1RadioOptThree"
                  value="Radio Three"
                />
              </VaRadio>
              <ValueDisplay label="V1 Radio" id="v1RadioValue" />
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <VaRadio
                uswds
                label="V3 Radio"
                onVaValueChange={e => updateRadioValue(e.detail, 'v3')}
              >
                <VaRadioOption
                  uswds
                  label="Radio One"
                  name="v3RadioOptOne"
                  value="Radio One"
                  checked
                />
                <VaRadioOption
                  uswds
                  label="Radio Two"
                  name="v3RadioOptTwo"
                  value="Radio Two"
                />
                <VaRadioOption
                  uswds
                  label="Radio Three"
                  name="v3RadioOptThree"
                  value="Radio Three"
                />
              </VaRadio>
              <ValueDisplay label="V3 Radio" id="v3RadioValue" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
