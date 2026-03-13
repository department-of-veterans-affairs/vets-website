/**
 * This page is for testing the compatibility of running v3 components without Formation styling.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaAdditionalInfo,
  VaAlert,
  VaButton,
  VaButtonPair,
  VaButtonSegmented,
  VaCheckbox,
  VaCheckboxGroup,
  VaMemorableDate,
  VaModal,
  VaPrivacyAgreement,
  VaRadio,
  VaRadioOption,
  VaSegmentedProgressBar,
  VaSelect,
  VaTextarea,
  VaTextInput,
  VaProcessList,
  VaProcessListItem,
  VaPagination,
  VaIcon,
  VaLanguageToggle,
  VaSort,
} from '@department-of-veterans-affairs/web-components/react-bindings';

import VaFileInputMultiple from './VaFileInputMultiple';

export default function V3BasePage() {
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
  updateRadioValue({ value: 'Radio One' }, 'v3');

  /**
   * @param {string} id
   * @param {string} value
   */
  const handleClick = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `${value} button was clicked!`;
  };

  const checkboxValueStore = { v3: [] };

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

  const [isVisibleV3, setIsVisibleV3] = useState(false);
  const onCloseEventV3 = () => setIsVisibleV3(!isVisibleV3);
  const openModalV3 = () => setIsVisibleV3(true);

  const hideHeader = () => {
    const el = document.createElement('style');
    el.innerText =
      'header.header { display: none; } footer.footer { display: none; }';
    document.body.appendChild(el);
  };
  hideHeader();

  const langToggleUrl = new URL(window.parent.location.href);
  langToggleUrl.hash = 'langToggle';

  const lang = sessionStorage.getItem('va-language-toggle-lang') ?? 'en';
  function handleLanguageToggle(e) {
    const { language } = e.detail;
    sessionStorage.setItem('va-language-toggle-lang', language);
  }

  return (
    <>
      <div className="vads-grid-container vads-font-sans">
        <div className="vads-grid-row">
          <h1>VA Design System Component Demos</h1>
        </div>
        <div className="border-bottom vads-u-padding-bottom--2">
          <h2 id="vaFileInputMultipl" className="vads-grid-col font-ui-md">
            File Input Multiple
          </h2>
          <VaFileInputMultiple />
        </div>
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaIcon" className="vads-grid-col font-ui-md">
            Icon Component
          </h2>
          <VaIcon
            icon="alarm"
            size={4}
            srtext="add some text for a screen reader to describe the icon's semantic meaning"
          />
        </div>
        {/* Text Input */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaPagination" className="vads-grid-col font-ui-md">
            Pagination component
          </h2>
          <div className="vads-grid-col">
            <VaPagination
              onPageSelect={function noRefCheck() {}}
              page={3}
              pages={6}
              showLastPage
            />
          </div>
        </div>
        {/* Text Input */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaTextInput" className="vads-grid-col font-ui-md">
            Text input component
          </h2>
          <div className="vads-grid-col">
            <VaTextInput
              name="v3Input"
              label="V3 Input"
              hint="This is a hint"
              onInput={e => updateValue(e)}
            />
            <ValueDisplay label="V3 Input" id="v3InputValue" />
          </div>
        </div>

        {/* Select */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaSelect" className="vads-grid-col font-ui-md">
            Select component
          </h2>
          <div className="vads-grid-col">
            <VaSelect
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

        {/* Sort */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaSort" className="vads-grid-col font-ui-md">
            Sort component
          </h2>
          <div className="vads-grid-col">
            <VaSort
              message-aria-describedby="Optional description text for screen readers"
              value=""
              width="lg"
              onVaSortSelect={updateValue}
            >
              <option value="relevance">Relevance</option>
              <option value="az">A to Z</option>
              <option value="za">Z to A</option>
              <option value="newestoldest">Newest to Oldest</option>
              <option value="oldestnewest">Oldest to Newest</option>
            </VaSort>
            <ValueDisplay label="Sort" id="sortValue" />
          </div>
        </div>

        {/* Radio */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaRadio" className="vads-grid-col font-ui-md">
            Radio component
          </h2>
          <div className="vads-grid-col">
            <VaRadio
              label="V3 Radio"
              onVaValueChange={e => updateRadioValue(e.detail, 'v3')}
            >
              <VaRadioOption
                label="Radio One"
                name="v3RadioOptOne"
                value="Radio One"
                checked
              />
              <VaRadioOption
                label="Radio Two"
                name="v3RadioOptTwo"
                value="Radio Two"
              />
              <VaRadioOption
                label="Radio Three"
                name="v3RadioOptThree"
                value="Radio Three"
              />
            </VaRadio>
            <ValueDisplay label="V3 Radio" id="v3RadioValue" />
          </div>
        </div>

        {/* Checkbox */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaCheckbox" className="vads-grid-col font-ui-md">
            Checkbox component
          </h2>
          <div className="vads-grid-col">
            <VaCheckboxGroup
              label="V3 Checkbox Group"
              onVaChange={e => updateCheckboxValue(e, 'v3')}
            >
              <VaCheckbox label="Checkbox 1" value="Checkbox 1" />
              <VaCheckbox label="Checkbox 2" value="Checkbox 2" />
              <VaCheckbox label="Checkbox 3" value="Checkbox 3" />
            </VaCheckboxGroup>
            <ValueDisplay label="V3 Checkbox Group" id="v3CheckboxValue" />
          </div>
        </div>

        {/* Memorable Date */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaMemorableDate" className="vads-grid-col font-ui-md">
            Memorable date component
          </h2>
          <div className="vads-grid-col">
            <VaMemorableDate
              name="v3MemorableDate"
              label="V3 Memorable date"
              hint="This is a hint"
              onDateBlur={e => updateValue(e)}
              onDateChange={e => updateValue(e)}
            />
            <ValueDisplay label="V3 Memorable date" id="v3MemorableDateValue" />
          </div>
        </div>

        {/* Textarea */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaTextarea" className="vads-grid-col font-ui-md">
            Textarea component
          </h2>
          <div className="vads-grid-col">
            <VaTextarea
              name="v3TextArea"
              label="V3 Textarea"
              hint="This is a hint"
              onInput={e => updateValue(e)}
            />
            <ValueDisplay label="V3 Text Area" id="v3TextAreaValue" />
          </div>
        </div>

        {/* Button pair */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaButtonPair" className="vads-grid-col font-ui-md">
            Button pair
          </h2>
          <div className="vads-grid-col">
            <VaButtonPair
              continue
              onPrimaryClick={() =>
                handleClick('v3ButtonPairValue', 'V3 continue')
              }
              onSecondaryClick={() =>
                handleClick('v3ButtonPairValue', 'V3 back')
              }
            />
            <ValueDisplay label="V3 button pair" id="v3ButtonPairValue" />
          </div>
        </div>

        {/* Button */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaButton" className="vads-grid-col font-ui-md">
            Button
          </h2>
          <div className="vads-grid-col">
            <VaButton
              onClick={() => handleClick('v3ButtonValue', 'V3 edit')}
              text="Edit"
            />
            <ValueDisplay label="V3 button" id="v3ButtonValue" />
          </div>
        </div>

        <div className="border-bottom vads-u-padding-bottom--2">
          <h2 id="vaButtonSegmented" className="vads-grid-col font-ui-md">
            Segmented Button
          </h2>
          <VaButtonSegmented
            buttons={[
              { label: 'Option 1', value: 'option-1' },
              { label: 'Option 2', value: 'option-2' },
              { label: 'Option 3', value: 'option-3' },
            ]}
          />
        </div>

        {/* Modal */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaModal" className="vads-grid-col font-ui-md">
            Modal
          </h2>
          <div className="vads-grid-col padding-bottom-2">
            <VaButton
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
            >
              <p>You have unsaved changes that will be lost.</p>
            </VaModal>
          </div>
        </div>

        {/* Privacy Agreement */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaPrivacyAgreement" className="vads-grid-col font-ui-md">
            Privacy Agreement
          </h2>
          <div className="vads-grid-col">
            <VaPrivacyAgreement
              id="v3PrivacyAgreement"
              onVaChange={e =>
                updatePrivacyAgreementValue(
                  e,
                  'v3PrivacyAgreementValue',
                  'v3PrivacyAgreement',
                )
              }
            />
            <ValueDisplay
              label="V3 Privacy Agreement"
              id="v3PrivacyAgreementValue"
            />
          </div>
        </div>

        {/* Alert */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom vads-u-padding-bottom--2">
          <h2 id="vaAlert" className="vads-grid-col font-ui-md">
            Alert
          </h2>
          <div className="vads-grid-col">
            <h3>Statuses</h3>
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
            <h3>Not Closable</h3>
            <VaAlert status="continue" showIcon="true">
              <h2 slot="headline">Alert - Not Closable</h2>
              <div>
                <p>This is an alert that cannot be closed</p>
              </div>
            </VaAlert>
            <h3>Background Only with Icon</h3>
            <VaAlert status="continue" showIcon="true" backgroundOnly="true">
              <h2 slot="headline">Alert - Background Only With Icon</h2>
              <div>
                <p>This is an alert with only a background and icon</p>
              </div>
            </VaAlert>
            <br />
            <h3>Slim Alerts</h3>
            <VaAlert status="info" slim="true">
              <p className="margin-y-0">This is a slim info alert</p>
            </VaAlert>
            <br />
            <VaAlert status="error" slim="true">
              <p className="margin-y-0">This is a slim error alert</p>
            </VaAlert>
            <br />
            <VaAlert status="success" slim="true">
              <p className="margin-y-0">This is a slim success alert</p>
            </VaAlert>
            <br />
            <VaAlert status="warning" slim="true">
              <p className="margin-y-0">This is a slim warning alert</p>
            </VaAlert>
            <br />
            <VaAlert status="continue" slim="true">
              <p className="margin-y-0">This is a slim continue alert</p>
            </VaAlert>
          </div>
        </div>

        {/* Progress bar - segmented */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom">
          <h2 id="vaProgressBarSegmented" className="vads-grid-col font-ui-md">
            Progress bar - segmented
          </h2>
          <div className="vads-grid-col">
            <h3>V3 VA Benefits</h3>
            <VaSegmentedProgressBar
              centered-labels
              counters="small"
              current={2}
              label="Label is here"
              labels="Personal Information;Household Status;Supporting Documents;Signature;Review and Submit"
              total={5}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="vads-grid-row vads-flex-direction-column border-bottom">
          <h2 id="vaAdditionalInfo" className="vads-grid-col font-ui-md">
            Additional Info
          </h2>
          <div className="vads-grid-col">
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
        </div>

        {/* Process List */}
        <div className="grid-row flex-column border-bottom">
          <h2 id="vaProcessList" className="grid-col font-ui-md">
            Process List
          </h2>
          <div className="grid-col">
            <VaProcessList>
              <VaProcessListItem>
                <h3>Check to be sure you can request a Board Appeal</h3>
                <p>
                  You can request a Board Appeal up to 1 year from the date on
                  your decision notice. (Exception: if you have a contested
                  claim, you have only 60 days from the date on your decision
                  notice to request a Board Appeal.)
                </p>
                <p>You can request a Board Appeal for these claim decisions:</p>
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
                    The VA decision date for each issue you’d like us to review
                    (this is the date on the decision notice you got in the
                    mail)
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
        {/* Language Toggle */}
        <div className="grid-row flex-column border-bottom">
          <h2 className="grid-col font-ui-md">Language Toggle</h2>
          <div className="grid-col">
            <VaLanguageToggle
              language={lang}
              enHref={langToggleUrl}
              esHref={langToggleUrl}
              tlHref={langToggleUrl}
              onVaLanguageToggle={handleLanguageToggle}
            />
          </div>
        </div>
      </div>
    </>
  );
}
