import React, { useState, useEffect } from 'react';
import {
  VaRadio,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';

import { applicantWording } from '../helpers/wordingCustomization';

export function ApplicantAddressCopyPage({
  data,
  setFormData,
  goBack,
  goForward,
  pagePerItemIndex,
  updatePage,
  onReviewPage,
}) {
  const currentApp = data?.applicants?.[pagePerItemIndex];
  const [checkValue, setCheckValue] = useState(currentApp?.sharedAddress);
  const [selectValue, setSelectValue] = useState(currentApp?.addressOriginator);
  const [address, setAddress] = useState(currentApp?.applicantAddress);

  // TODO: Do we want/need this functionality?
  // If we copied an address but then edited on next screen,
  // add an indicator if the user ever comes back to this screen.
  const [hasEditedAddress, setHasEditedAddress] = useState(
    currentApp?.addressOriginator &&
      JSON.stringify(currentApp?.applicantAddress) !==
        currentApp?.addressOriginator,
  );

  const [checkError, setCheckError] = useState(undefined);
  const [selectError, setSelectError] = useState(undefined);
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

  function isValidOrigin(person) {
    // Make sure that our <select> only shows options
    // that are:
    // 1. Have a valid address we can copy
    // 2. NOT the current applicant
    return (
      person?.applicantAddress?.country !== undefined && person !== currentApp
    );
  }

  function selectUpdate(event) {
    const { target = {} } = event;
    const value = event.detail?.value || target.value || '';
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(value);
    } catch (e) {
      // TODO: this just means they chose the default <select> value of "-- select --"
      // Don't really see a reason to log this, but we might want to do something... TBD
    }
    if (parsedAddress) {
      setAddress(parsedAddress);
      setSelectValue(value);
    }
  }
  const handlers = {
    validate() {
      // TODO: fill this out
      let isValid = true;
      if (checkValue === undefined) {
        setCheckError('This field is required');
        isValid = false;
      } else if (checkValue && selectValue === undefined) {
        setSelectError('This field is required');
        isValid = false;
      } else {
        setCheckError(null);
        setSelectError(null);
      }
      return isValid;
    },
    onBlur(args) {
      console.log(args.target.value);
      // TODO: fill this out
      setDirty(true);
      // handlers.validate();
    },
    radioUpdate: ({ detail }) => {
      setDirty(true);
      setCheckValue(detail.value === 'true'); // convert from string to bool
      // handlers.validate();
    },

    onGoForward: event => {
      event.preventDefault();
      if (!handlers.validate()) return;
      const testVal = { ...data };
      const testApp = testVal.applicants[pagePerItemIndex];
      testApp.sharedAddress = checkValue;
      testApp.addressOriginator = selectValue;
      testApp.applicantAddress = address;
      setFormData(testVal);
      if (onReviewPage) updatePage();
      goForward(data);
    },
  };

  useEffect(
    () => {
      console.log(hasEditedAddress);
      if (dirty) handlers.validate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, checkValue, selectValue],
  );
  return (
    <>
      {titleUI('Address screener')['ui:title']}

      <form onSubmit={handlers.onGoForward}>
        <VaRadio
          class="vads-u-margin-y--2"
          label="Do you share an address with another applicant?"
          hint="If yes, you will need to tell us whose address you share."
          required
          error={checkError}
          onBlur={handlers.onBlur}
          onVaValueChange={handlers.radioUpdate}
          value={checkValue}
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
        {checkValue && (
          <div
            className={
              checkValue ? 'form-expanding-group form-expanding-group-open' : ''
            }
          >
            <div className="form-expanding-group-inner-enter-done">
              <div className="schemaform-expandUnder-indent">
                <VaSelect
                  onVaSelect={selectUpdate}
                  error={selectError}
                  onBlur={handlers.onBlur}
                  required
                  value={selectValue}
                >
                  {data.applicants
                    .filter(person => isValidOrigin(person))
                    .map(el => (
                      <option
                        key={`${el.applicantName.first}${
                          el.applicantName.last
                        }`}
                        value={JSON.stringify(el.applicantAddress)}
                      >
                        {el.applicantName.first} {el.applicantName.last}{' '}
                        {el.applicantName.suffix} - {el.applicantAddress.street}
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
