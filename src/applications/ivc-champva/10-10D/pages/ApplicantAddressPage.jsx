import React, { useState, useEffect } from 'react';
import {
  VaButton,
  VaRadio,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';

import { applicantWording } from '../helpers/wordingCustomization';

const KEYNAME = 'applicantAddress';

const relationshipStructure = {
  relationshipToVeteran: undefined,
  otherRelationshipToVeteran: undefined,
};

export function ApplicantAddressCopyPage({
  data,
  setFormData,
  goBack,
  goForward,
  keyname = KEYNAME,
  pagePerItemIndex,
  updatePage,
  onReviewPage,
}) {
  const [checkValue, setCheckValue] = useState(
    data?.applicants?.[pagePerItemIndex]?.[keyname] || relationshipStructure,
  );
  const [address, setAddress] = useState({});
  const [checkError, setCheckError] = useState(undefined);
  const [inputError, setInputError] = useState(undefined);
  const [dirty, setDirty] = useState(false);
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
  const updateButton = <button type="submit">Update page</button>;

  const options = [
    {
      value: true,
      label: 'Yes',
    },
    {
      value: false,
      label: 'No',
    },
  ];

  function selectUpdate(event) {
    const { target = {} } = event;
    // const fieldName = target.name;

    // detail.value from va-select &
    // target.value from va-text-input & va-memorable-date
    const value = event.detail?.value || target.value || '';
    // empty va-memorable-date may return '--'
    console.log('V: ', JSON.parse(value));
    // TODO: verify the parsed result is a valid address object before setting, else default to nothing.
    setAddress(JSON.parse(value));
  }
  const handlers = {
    validate() {
      return true;
    },
    radioUpdate: ({ detail }) => {
      console.log(detail.value);
      setDirty(true);
      setCheckValue(detail.value);
      handlers.validate();
    },

    onGoForward: event => {
      event.preventDefault();
      console.log('Go forward');
      goForward(data);
      if (!handlers.validate()) return;
      const testVal = { ...data };
      testVal.applicants[pagePerItemIndex][keyname] = address;
      console.log(testVal);
      setFormData(testVal);
      if (onReviewPage) updatePage();
      goForward(data);
    },
  };

  useEffect(
    () => {
      console.log(address);
      if (dirty) handlers.validate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, checkValue],
  );
  return (
    <>
      {
        titleUI(
          ({ formData }) => `${applicantWording(formData)} address screener`,
        )['ui:title']
      }

      <form onSubmit={handlers.onGoForward}>
        <VaRadio
          class="vads-u-margin-y--2"
          label="Do you share an address with another applicant?"
          hint="If yes, you will need to tell us who's address you share."
          required
          error={checkError}
          onVaValueChange={handlers.radioUpdate}
        >
          {options.map(option => (
            <va-radio-option
              key={option.value}
              name="pre-address-info"
              label={option.label}
              value={option.value}
              checked={checkValue === option.value}
              uswds
              aria-describedby={
                checkValue === option.value ? option.value : null
              }
            />
          ))}
        </VaRadio>
        {checkValue === 'true' && (
          <div
            className={
              checkValue === 'true'
                ? 'form-expanding-group form-expanding-group-open'
                : ''
            }
          >
            <div className="form-expanding-group-inner-enter-done">
              <div className="schemaform-expandUnder-indent">
                <VaSelect onVaSelect={selectUpdate}>
                  <option disabled selected value>
                    --
                  </option>
                  {data.applicants
                    .filter(
                      person => person.applicantAddress.country !== undefined,
                    )
                    .map(el => (
                      <option
                        key={el.applicantName.first}
                        value={JSON.stringify(el.applicantAddress)}
                      >
                        {el.applicantName.first}
                      </option>
                    ))}
                </VaSelect>
              </div>
            </div>
          </div>
        )}
        {onReviewPage ? updateButton : navButtons}
      </form>
    </>
  );
}

ApplicantAddressCopyPage.propTypes = {
  data: PropTypes.object,
  genOp: PropTypes.func,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  keyname: PropTypes.string,
  pagePerItemIndex: PropTypes.string || PropTypes.number,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
