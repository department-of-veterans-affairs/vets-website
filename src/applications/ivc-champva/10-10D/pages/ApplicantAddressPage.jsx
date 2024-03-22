import React, { useState, useEffect } from 'react';
import {
  VaRadio,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';

export function ApplicantAddressCopyPage({
  contentBeforeButtons,
  contentAfterButtons,
  data,
  setFormData,
  goBack,
  goForward,
  pagePerItemIndex,
  updatePage,
  onReviewPage,
}) {
  const currentApp = data?.applicants?.[pagePerItemIndex];
  const [radioValue, setRadioValue] = useState(currentApp.hasSharedAddress);
  const [selectValue, setSelectValue] = useState(currentApp?.addressOriginator);
  const [address, setAddress] = useState(currentApp?.applicantAddress);

  // TODO: Do we want/need this functionality? Commenting out for now.
  // If we copied an address but then edited on next screen, track that
  // info if the user ever comes back to this screen and we want to notify.
  /*
  const [hasEditedAddress, setHasEditedAddress] = useState(
    currentApp?.addressOriginator &&
      JSON.stringify(currentApp?.applicantAddress) !==
        currentApp?.addressOriginator,
  );
  */

  const [radioError, setRadioError] = useState(undefined);
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
    // Make sure that our <select> only shows options that:
    // 1. Have a valid address we can copy
    // 2. Are NOT the current applicant
    return (
      person?.applicantAddress?.country !== undefined && person !== currentApp
    );
  }

  const handlers = {
    validate() {
      let isValid = true;
      if (radioValue === undefined) {
        setRadioError('This field is required');
        isValid = false;
      } else if (radioValue && selectValue === undefined) {
        setRadioError(null);
        setSelectError('This field is required');
        isValid = false;
      } else {
        setRadioError(null);
        setSelectError(null);
      }
      return isValid;
    },
    radioUpdate: ({ detail }) => {
      setRadioValue(detail.value === 'true'); // convert from string to bool
      setDirty(true);
    },
    selectUpdate: event => {
      const { target = {} } = event;
      const value = event.detail?.value || target.value || '';
      let parsedAddress;
      try {
        parsedAddress = JSON.parse(value);
      } catch (e) {
        // We selected "-Select-" or somehow otherwise fouled up.
        // Clear any previously set value
        setAddress(undefined);
        setSelectValue(undefined);
      }
      if (parsedAddress) {
        setAddress(parsedAddress);
        setSelectValue(value);
      }
      setDirty(true);
    },
    onGoForward: event => {
      event.preventDefault();
      if (!handlers.validate()) return;
      const tmpVal = { ...data };
      const tmpApp = tmpVal.applicants[pagePerItemIndex];
      tmpApp.hasSharedAddress = radioValue;
      if (radioValue) {
        tmpApp.addressOriginator = selectValue;
        tmpApp.applicantAddress = address;
      }
      setFormData(tmpVal);
      if (onReviewPage) updatePage();
      goForward(data);
    },
  };

  useEffect(
    () => {
      if (dirty) handlers.validate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, radioValue, selectValue],
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
          error={radioError}
          onVaValueChange={handlers.radioUpdate}
          value={radioValue}
        >
          {options.map(option => (
            <va-radio-option
              key={option.value}
              name="pre-address-info"
              label={option.label}
              value={option.value}
              checked={radioValue === option.value}
              uswds
              aria-describedby={
                radioValue === option.value ? option.value : null
              }
            />
          ))}
        </VaRadio>
        {radioValue && (
          <div
            className={
              radioValue ? 'form-expanding-group form-expanding-group-open' : ''
            }
          >
            <div className="form-expanding-group-inner-enter-done">
              <div className="schemaform-expandUnder-indent">
                <VaSelect
                  onVaSelect={handlers.selectUpdate}
                  error={selectError}
                  required
                  value={selectValue}
                  label="Select the user with whom you share an address"
                  name="shared-address-select"
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
        <div className="vads-u-margin-top--4">
          {contentBeforeButtons}
          {onReviewPage ? updateButton : navButtons}
          {contentAfterButtons}
        </div>
      </form>
    </>
  );
}

ApplicantAddressCopyPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
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
