/**
 * This page is for testing the compatibility of running v1 and v3 components on the same page.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  VaRadio,
  VaRadioOption,
  VaSelect,
  VaTextInput,
  VaCheckboxGroup,
  VaCheckbox,
  VaMemorableDate,
  VaTextarea,
  VaButtonPair,
  VaNumberInput,
  VaModal,
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

  const checkboxValueStore = {
    v1: [],
    v3: [],
  };

  /**
   * @param {string} id
   * @param {{value: string}} value
   */
  const handleClick = (id, value) => {
    document.getElementById(id).innerHTML = `${value} button was clicked!`;
  };

  /**
   * @param {{value: string}} value
   * @param {string} id
   */
  const updateCheckboxValue = (e, id) => {
    const { value, checked } = e.srcElement;
    const valueStore = checkboxValueStore[id];
    if (checked) {
      valueStore.push(value);
    } else {
      const index = valueStore.indexOf(value);
      valueStore.splice(index, 1);
    }
    const display = document.getElementById(`${id}CheckboxValue`);
    if (display) display.innerText = valueStore.sort().join(', ');
  };

  const [isVisibleV1, setIsVisibleV1] = useState();
  const onCloseEventV1 = () => setIsVisibleV1(!isVisibleV1);
  const openModalV1 = () => setIsVisibleV1(true);

  const [isVisibleV3, setIsVisibleV3] = useState();
  const onCloseEventV3 = () => setIsVisibleV3(!isVisibleV3);
  const openModalV3 = () => setIsVisibleV3(true);

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

        {/* Number Input Comparison */}
        <div className="vads-l-row">
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <VaNumberInput
                name="v1NumberInput"
                label="V1 Number Input"
                hint="This is a hint"
                inputmode="numeric"
                onInput={e => updateValue(e)}
              />
              <ValueDisplay label="V1 Number Input" id="v1NumberInputValue" />
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <VaNumberInput
                uswds
                name="v3NumberInput"
                label="V3 Number Input"
                hint="This is a hint"
                inputmode="numeric"
                onInput={e => updateValue(e)}
              />
              <ValueDisplay label="V3 Number Input" id="v3NumberInputValue" />
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

        {/* Checkbox Comparison */}
        <div className="vads-l-row">
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <VaCheckboxGroup
                label="V1 Checkbox Group"
                onVaChange={e => updateCheckboxValue(e, 'v1')}
              >
                <VaCheckbox
                  label="Checkbox 1"
                  name="v1Checkbox"
                  value="Checkbox 1"
                />
                <VaCheckbox
                  label="Checkbox 2"
                  name="v1Checkbox"
                  value="Checkbox 2"
                />
                <VaCheckbox
                  label="Checkbox 3"
                  name="v1Checkbox"
                  value="Checkbox 3"
                />
              </VaCheckboxGroup>
              <ValueDisplay label="V1 Checkbox Group" id="v1CheckboxValue" />
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <VaCheckboxGroup
                uswds
                label="V3 Checkbox Group"
                onVaChange={e => updateCheckboxValue(e, 'v3')}
              >
                <VaCheckbox
                  uswds
                  label="Checkbox 1"
                  name="v3Checkbox"
                  value="Checkbox 1"
                />
                <VaCheckbox
                  uswds
                  label="Checkbox 2"
                  name="v3Checkbox"
                  value="Checkbox 2"
                />
                <VaCheckbox
                  uswds
                  label="Checkbox 3"
                  name="v3Checkbox"
                  value="Checkbox 3"
                />
              </VaCheckboxGroup>
              <ValueDisplay label="V3 Checkbox Group" id="v3CheckboxValue" />
            </div>
          </div>
        </div>

        {/* Memorable Date Comparison */}
        <div className="vads-l-row">
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <VaMemorableDate
                name="v1MemorableDate"
                label="V1 Memorable date"
                hint="This is a hint"
                onDateBlur={e => updateValue(e)}
                onDateChange={e => updateValue(e)}
              />
              <ValueDisplay
                label="V1 Memorable date"
                id="v1MemorableDateValue"
              />
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <VaMemorableDate
                name="v3MemorableDate"
                label="V3 Memorable date"
                onDateBlur={e => updateValue(e)}
                onDateChange={e => updateValue(e)}
                uswds
              />
              <ValueDisplay
                label="V3 Memorable date"
                id="v3MemorableDateValue"
              />
            </div>
          </div>
        </div>

        {/* TextArea Comparison */}
        <div className="vads-l-row">
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <VaTextarea
                name="v1TextArea"
                label="V1 Text Area"
                hint="This is a hint"
                onInput={e => updateValue(e)}
              />
              <ValueDisplay label="V1 Text Area" id="v1TextAreaValue" />
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <VaTextarea
                name="v3TextArea"
                label="V3 Text Area"
                hint="This is a hint"
                onInput={e => updateValue(e)}
                uswds
              />
              <ValueDisplay label="V3 Text Area" id="v3TextAreaValue" />
            </div>
          </div>
        </div>

        {/* Button pair Comparison */}
        <div className="vads-l-row">
          <h4>Button pair</h4>
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <VaButtonPair
                continue
                onPrimaryClick={() =>
                  handleClick('v1ButtonPairValue', 'V1 continue')
                }
                onSecondaryClick={() =>
                  handleClick('v1ButtonPairValue', 'V1 back')
                }
              />
              <ValueDisplay label="V1 button pair" id="v1ButtonPairValue" />
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <VaButtonPair
                continue
                onPrimaryClick={() =>
                  handleClick('v3ButtonPairValue', 'V3 continue')
                }
                onSecondaryClick={() =>
                  handleClick('v3ButtonPairValue', 'V3 back')
                }
                uswds
              />
              <ValueDisplay label="V3 button pair" id="v3ButtonPairValue" />
            </div>
          </div>
        </div>

        {/* Button Comparison */}
        <div className="vads-l-row">
          <h4>Button</h4>
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <va-button
                onClick={() => handleClick('v1ButtonValue', 'V1 edit')}
                text="Edit"
              />
              <ValueDisplay label="V1 button" id="v1ButtonValue" />
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <va-button
                onClick={() => handleClick('v3ButtonValue', 'V3 edit')}
                text="Edit"
                uswds
              />
              <ValueDisplay label="V3 button" id="v3ButtonValue" />
            </div>
          </div>
        </div>

        {/* Modal Comparison */}
        <div className="vads-l-row">
          <h4>Modal</h4>
          <div className="vads-u-display--flex vads-l-col--12 vads-u-align-items--center">
            <div className="vads-l-col--6 vads-u-margin--1">
              <va-button
                onClick={openModalV1}
                text="Click here to open V1 modal"
              />
              <VaModal
                modalTitle="Are you sure you want to continue?"
                primaryButtonText="Continue without saving"
                secondaryButtonText="Go back"
                onCloseEvent={onCloseEventV1}
                onPrimaryButtonClick={onCloseEventV1}
                onSecondaryButtonClick={onCloseEventV1}
                visible={isVisibleV1}
              >
                <p>You have unsaved changes that will be lost.</p>
              </VaModal>
            </div>

            <div className="vads-l-col--6 vads-u-margin--1">
              <va-button
                onClick={openModalV3}
                text="Click here to open V3 modal"
              />
              <VaModal
                modalTitle="Are you sure you want to continue?"
                primaryButtonText="Continue without saving"
                secondaryButtonText="Go back"
                onCloseEvent={onCloseEventV3}
                onPrimaryButtonClick={onCloseEventV3}
                onSecondaryButtonClick={onCloseEventV3}
                visible={isVisibleV3}
                uswds
              >
                <p>You have unsaved changes that will be lost.</p>
              </VaModal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
