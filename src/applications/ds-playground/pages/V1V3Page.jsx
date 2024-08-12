/**
 * This page is for testing the compatibility of running v1 and v3 components on the same page.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaButton,
  VaButtonPair,
  VaCheckbox,
  VaCheckboxGroup,
  VaMemorableDate,
  VaModal,
  VaPrivacyAgreement,
  VaRadio,
  VaRadioOption,
  VaSelect,
  VaTextarea,
  VaTextInput,
  VaAlert,
  VaSegmentedProgressBar,
  VaAdditionalInfo,
  VaAccordion,
  VaAccordionItem,
  VaBreadcrumbs,
  VaProcessList,
  VaProcessListItem,
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

  const checkboxValueStore = { v1: [], v3: [] };

  /**
   * @param {string} id
   * @param {string} value
   */
  const handleClick = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `${value} button was clicked!`;
  };

  /**
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

  /**
   * @param {string} id
   * @param {string} agreementComponentId
   */
  const updatePrivacyAgreementValue = (e, id, agreementComponentId) => {
    const { checked } = e.srcElement;
    let valueString = `Agreement checked`;
    const el = document.querySelector(`#${agreementComponentId}`);
    if (el) {
      if (checked) {
        el.setAttribute('show-error', '');
      } else {
        valueString = `Agreement un-checked`;
        el.setAttribute('show-error', 'true');
      }
    }
    const display = document.getElementById(id);
    if (display) display.innerText = valueString;
  };

  const ValueDisplay = ({ id, label }) => {
    return (
      <p>
        <b>{label} Value:</b> <span id={id} />
      </p>
    );
  };
  ValueDisplay.propTypes = { id: PropTypes.string, label: PropTypes.string };

  const [isVisibleV1, setIsVisibleV1] = useState(false);
  const onCloseEventV1 = () => setIsVisibleV1(!isVisibleV1);
  const openModalV1 = () => setIsVisibleV1(true);

  const [isVisibleV3, setIsVisibleV3] = useState(false);
  const onCloseEventV3 = () => setIsVisibleV3(!isVisibleV3);
  const openModalV3 = () => setIsVisibleV3(true);

  return (
    <>
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row">
          <h1>V1 and V3 Side-by-Side Demo</h1>
        </div>

        {/* Text Input Comparison */}
        <div className="vads-l-row vads-u-padding-y--2">
          <h3>Text input component</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--gray-light-alt medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaTextInput
                name="v1Input"
                label="V1 Input"
                hint="This is a hint"
                onInput={e => updateValue(e)}
              />
              <ValueDisplay label="V1 Input" id="v1InputValue" />
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
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
          <h3>Number input component</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--gray-light-alt medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaTextInput
                name="v1NumberInput"
                label="V1 Number Input"
                hint="This is a hint"
                inputmode="numeric"
                onInput={e => updateValue(e)}
              />
              <ValueDisplay label="V1 Number Input" id="v1NumberInputValue" />
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1 vads-u-border-color--primary">
              <VaTextInput
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
          <h3>Select component</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
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

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
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
          <h3>Radio component</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
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

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
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
          <h3>Checkbox component</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaCheckboxGroup
                label="V1 Checkbox Group"
                onVaChange={e => updateCheckboxValue(e, 'v1')}
              >
                <VaCheckbox label="Checkbox 1" value="Checkbox 1" />
                <VaCheckbox label="Checkbox 2" value="Checkbox 2" />
                <VaCheckbox label="Checkbox 3" value="Checkbox 3" />
              </VaCheckboxGroup>
              <ValueDisplay label="V1 Checkbox Group" id="v1CheckboxValue" />
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaCheckboxGroup
                uswds
                label="V3 Checkbox Group"
                onVaChange={e => updateCheckboxValue(e, 'v3')}
              >
                <VaCheckbox uswds label="Checkbox 1" value="Checkbox 1" />
                <VaCheckbox uswds label="Checkbox 2" value="Checkbox 2" />
                <VaCheckbox uswds label="Checkbox 3" value="Checkbox 3" />
              </VaCheckboxGroup>
              <ValueDisplay label="V3 Checkbox Group" id="v3CheckboxValue" />
            </div>
          </div>
        </div>

        {/* Memorable Date Comparison */}
        <div className="vads-l-row">
          <h3>Memorable date component</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
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

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaMemorableDate
                name="v3MemorableDate"
                label="V3 Memorable date"
                hint="This is a hint"
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
          <h3>Textarea component</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaTextarea
                name="v1TextArea"
                label="V1 Text Area"
                hint="This is a hint"
                onInput={e => updateValue(e)}
              />
              <ValueDisplay label="V1 Text Area" id="v1TextAreaValue" />
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
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
          <h3>Button pair</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
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

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
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
          <h3>Button</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaButton
                onClick={() => handleClick('v1ButtonValue', 'V1 edit')}
                text="Edit"
              />
              <ValueDisplay label="V1 button" id="v1ButtonValue" />
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaButton
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
          <h3>Modal</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaButton
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
              <VaButton
                onClick={openModalV3}
                text="Click here to open V3 modal"
                uswds
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

        {/* Privacy Agreement Comparison */}
        <div className="vads-l-row">
          <h3>Privacy Agreement</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaPrivacyAgreement
                id="v1PrivacyAgreement"
                onVaChange={e =>
                  updatePrivacyAgreementValue(
                    e,
                    'v1PrivacyAgreementValue',
                    'v1PrivacyAgreement',
                  )
                }
              />
              <ValueDisplay
                label="V1 Privacy Agreement"
                id="v1PrivacyAgreementValue"
              />
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaPrivacyAgreement
                id="v3PrivacyAgreement"
                onVaChange={e =>
                  updatePrivacyAgreementValue(
                    e,
                    'v3PrivacyAgreementValue',
                    'v3PrivacyAgreement',
                  )
                }
                uswds
              />
              <ValueDisplay
                label="V3 Privacy Agreement"
                id="v3PrivacyAgreementValue"
              />
            </div>
          </div>
        </div>

        {/* Alert Comparison */}
        <div className="vads-l-row">
          <h3>Alert</h3>
          <div className="vads-l-col--12 vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <h4>Statuses</h4>
              <VaAlert
                status="info"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
              >
                <h2 slot="headline">Info Alert</h2>
                <div>
                  <p>This is an info alert</p>
                </div>
              </VaAlert>
              <br />
              <VaAlert
                status="error"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
              >
                <h2 slot="headline">Error Alert</h2>
                <div>
                  <p>This is an error alert</p>
                </div>
              </VaAlert>
              <br />
              <VaAlert
                status="success"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
              >
                <h2 slot="headline">Success Alert</h2>
                <div>
                  <p>This is a success alert</p>
                </div>
              </VaAlert>
              <br />
              <VaAlert
                status="warning"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
              >
                <h2 slot="headline">Warning Alert</h2>
                <div>
                  <p>This is a warning alert</p>
                </div>
              </VaAlert>
              <br />
              <VaAlert
                status="continue"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
              >
                <h2 slot="headline">Continue Alert</h2>
                <div>
                  <p>This is a continue alert</p>
                </div>
              </VaAlert>
              <br />
              <h4>Not Closable</h4>
              <VaAlert status="continue" showIcon="true">
                <h2 slot="headline">Alert - Not Closable</h2>
                <div>
                  <p>This is an alert that cannot be closed</p>
                </div>
              </VaAlert>
              <h4>Background Only with Icon</h4>
              <VaAlert status="continue" showIcon="true" backgroundOnly="true">
                <h2 slot="headline">Alert - Background Only With Icon</h2>
                <div>
                  <p>This is an alert with only a background and icon</p>
                </div>
              </VaAlert>
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <h4>Statuses</h4>
              <VaAlert
                status="info"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
                uswds="true"
              >
                <h2 slot="headline">Info Alert</h2>
                <div>
                  <p>This is an info alert</p>
                </div>
              </VaAlert>
              <br />
              <VaAlert
                status="error"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
                uswds="true"
              >
                <h2 slot="headline">Error Alert</h2>
                <div>
                  <p>This is an error alert</p>
                </div>
              </VaAlert>
              <br />
              <VaAlert
                status="success"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
                uswds="true"
              >
                <h2 slot="headline">Success Alert</h2>
                <div>
                  <p>This is a success alert</p>
                </div>
              </VaAlert>
              <br />
              <VaAlert
                status="warning"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
                uswds="true"
              >
                <h2 slot="headline">Warning Alert</h2>
                <div>
                  <p>This is a warning alert</p>
                </div>
              </VaAlert>
              <br />
              <VaAlert
                status="continue"
                showIcon="true"
                closeBtnAriaLabel="Close"
                closeable="true"
                uswds="true"
              >
                <h2 slot="headline">Continue Alert</h2>
                <div>
                  <p>This is a continue alert</p>
                </div>
              </VaAlert>
              <br />
              <h4>Not Closable</h4>
              <VaAlert status="continue" showIcon="true" uswds="true">
                <h2 slot="headline">Alert - Not Closable</h2>
                <div>
                  <p>This is an alert that cannot be closed</p>
                </div>
              </VaAlert>
              <h4>Background Only with Icon</h4>
              <VaAlert
                status="continue"
                showIcon="true"
                backgroundOnly="true"
                uswds="true"
              >
                <h2 slot="headline">Alert - Background Only With Icon</h2>
                <div>
                  <p>This is an alert with only a background and icon</p>
                </div>
              </VaAlert>
              <br />
              <h4>Slim Alerts</h4>
              <VaAlert status="info" slim="true" uswds="true">
                <p className="vads-u-margin-y--0">This is a slim info alert</p>
              </VaAlert>
              <br />
              <VaAlert status="error" slim="true" uswds="true">
                <p className="vads-u-margin-y--0">This is a slim error alert</p>
              </VaAlert>
              <br />
              <VaAlert status="success" slim="true" uswds="true">
                <p className="vads-u-margin-y--0">
                  This is a slim success alert
                </p>
              </VaAlert>
              <br />
              <VaAlert status="warning" slim="true" uswds="true">
                <p className="vads-u-margin-y--0">
                  This is a slim warning alert
                </p>
              </VaAlert>
              <br />
              <VaAlert status="continue" slim="true" uswds="true">
                <p className="vads-u-margin-y--0">
                  This is a slim continue alert
                </p>
              </VaAlert>
            </div>
          </div>
        </div>

        {/* Progress bar - segmented */}
        <div className="vads-l-row">
          <h3>Progress bar - segmented</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaSegmentedProgressBar
                current={2}
                label="V1 VA Benefits"
                total={5}
              />
              <div
                className="schemaform-chapter-progress"
                style={{
                  paddingLeft: '2rem',
                }}
              >
                <div className="nav-header">
                  <h2
                    className="vads-u-font-size--h4"
                    id="nav-form-header"
                    tabIndex="-1"
                  >
                    Step 2 of 5: VA Benefits
                  </h2>
                </div>
              </div>
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaSegmentedProgressBar
                centered-labels
                counters="small"
                current={2}
                heading-text="V3 VA Benefits"
                label="Label is here"
                labels="Personal Information;Household Status;Supporting Documents;Signature;Review and Submit"
                total={5}
                uswds
              />
            </div>
          </div>
        </div>

        {/* Additional Info Comparison */}
        <div className="vads-l-row">
          <h3>Additional Info</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaAdditionalInfo trigger="Expand Additional Information">
                <div>Here are some items</div>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                  <li>Item 3</li>
                  <li>Item 4</li>
                </ul>
              </VaAdditionalInfo>
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaAdditionalInfo trigger="Expand Additional Information" uswds>
                <div>Here are some items</div>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                  <li>Item 3</li>
                  <li>Item 4</li>
                </ul>
              </VaAdditionalInfo>
            </div>
          </div>
        </div>

        {/* Accordion Comparison */}
        <div className="vads-l-row">
          <h3>Accordion</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaAccordion open-single>
                <VaAccordionItem id="first">
                  <h6 slot="headline">First Amendment Headline</h6>
                  Congress shall make no law respecting an establishment of
                  religion, or prohibiting the free exercise thereof; or
                  abridging the freedom of speech, or of the press; or the right
                  of the people peaceably to assemble, and to petition the
                  Government for a redress of grievances.
                </VaAccordionItem>
                <VaAccordionItem header="Second Amendment" id="second">
                  A well regulated Militia, being necessary to the security of a
                  free State, the right of the people to keep and bear Arms,
                  shall not be infringed.
                </VaAccordionItem>
                <VaAccordionItem header="Third Amendment" id="third">
                  No Soldier shall, in time of peace be quartered in any house,
                  without the consent of the Owner, nor in time of war, but in a
                  manner to be prescribed by law.
                </VaAccordionItem>
              </VaAccordion>
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaAccordion uswds open-single>
                <VaAccordionItem header="First Amendment" id="first" uswds>
                  <p>
                    Congress shall make no law respecting an establishment of
                    religion, or prohibiting the free exercise thereof; or
                    abridging the freedom of speech, or of the press; or the
                    right of the people peaceably to assemble, and to petition
                    the Government for a redress of grievances.
                  </p>
                </VaAccordionItem>
                <VaAccordionItem header="Second Amendment" id="second" uswds>
                  <p>
                    A well regulated Militia, being necessary to the security of
                    a free State, the right of the people to keep and bear Arms,
                    shall not be infringed.
                  </p>
                </VaAccordionItem>
                <VaAccordionItem header="Third Amendment" id="third" uswds>
                  <p>
                    No Soldier shall, in time of peace be quartered in any
                    house, without the consent of the Owner, nor in time of war,
                    but in a manner to be prescribed by law.
                  </p>
                </VaAccordionItem>
              </VaAccordion>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="vads-l-row">
          <h3>Breadcrumbs</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaBreadcrumbs label="Breadcrumb">
                <a href="#home">Home</a>
                <a href="#one">Level one</a>
                <a href="#two">Level two</a>
              </VaBreadcrumbs>
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaBreadcrumbs
                breadcrumbList={[
                  {
                    href: '#one',
                    label: 'Level one',
                  },
                  {
                    href: '#two',
                    label: 'Level two',
                  },
                  {
                    href: '#three',
                    label: 'Level three',
                  },
                ]}
                label="Breadcrumb"
                uswds
              />
            </div>
          </div>
        </div>

        {/* Process List Comparison */}
        <div className="vads-l-row">
          <h3>Process List</h3>
          <div className="vads-l-col--12 vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--primary medium-screen:vads-u-display--flex">
            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaProcessList>
                <li>
                  <h3>Check to be sure you can request a Board Appeal</h3>
                  <p>
                    You can request a Board Appeal up to 1 year from the date on
                    your decision notice. (Exception: if you have a contested
                    claim, you have only 60 days from the date on your decision
                    notice to request a Board Appeal.)
                  </p>
                  <p>
                    You can request a Board Appeal for these claim decisions:
                  </p>
                  <ul>
                    <li>An initial claim</li>
                    <li>A Supplemental Claim</li>
                    <li>A Higher-Level Review</li>
                  </ul>
                  <p>
                    <strong>Note: </strong>
                    You can’t request a Board Appeal if you’ve already requested
                    one for this same claim.
                  </p>
                </li>
                <li>
                  <h3>Gather your information</h3>
                  <p>Here’s what you’ll need to apply:</p>
                  <ul>
                    <li>Your mailing address</li>
                    <li>
                      The VA decision date for each issue you’d like us to
                      review (this is the date on the decision notice you got in
                      the mail)
                    </li>
                  </ul>
                </li>
                <li>
                  <h3>Start your request</h3>
                  <p>
                    We’ll take you through each step of the process. It should
                    take about 30 minutes.
                  </p>
                </li>
              </VaProcessList>
            </div>

            <div className="vads-l-col--12 small-screen:vads-l-col--6 vads-u-margin--1">
              <VaProcessList uswds>
                <VaProcessListItem>
                  <h3>Check to be sure you can request a Board Appeal</h3>
                  <p>
                    You can request a Board Appeal up to 1 year from the date on
                    your decision notice. (Exception: if you have a contested
                    claim, you have only 60 days from the date on your decision
                    notice to request a Board Appeal.)
                  </p>
                  <p>
                    You can request a Board Appeal for these claim decisions:
                  </p>
                  <ul>
                    <li>An initial claim</li>
                    <li>A Supplemental Claim</li>
                    <li>A Higher-Level Review</li>
                  </ul>
                  <p>
                    <strong>Note: </strong>
                    You can’t request a Board Appeal if you’ve already requested
                    one for this same claim.
                  </p>
                </VaProcessListItem>
                <VaProcessListItem>
                  <h3>Gather your information</h3>
                  <p>Here’s what you’ll need to apply:</p>
                  <ul>
                    <li>Your mailing address</li>
                    <li>
                      The VA decision date for each issue you’d like us to
                      review (this is the date on the decision notice you got in
                      the mail)
                    </li>
                  </ul>
                </VaProcessListItem>
                <VaProcessListItem>
                  <h3>Start your request</h3>
                  <p>
                    We’ll take you through each step of the process. It should
                    take about 30 minutes.
                  </p>
                </VaProcessListItem>
              </VaProcessList>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
