import React, { useState, useEffect } from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { applicantWording } from '../../utilities';

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
  const [selectValue, setSelectValue] = useState(currentApp?.sharesAddressWith);
  const [address, setAddress] = useState(currentApp?.applicantAddress);
  // const [radioError, setRadioError] = useState(undefined);
  const [selectError, setSelectError] = useState(undefined);
  const [dirty, setDirty] = useState(false);
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;

  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
  const updateButton = <button type="submit">Update page</button>;

  function fullName(name) {
    return `${name?.first} ${name?.middle || ''} ${name?.last} ${name?.suffix ||
      ''}`;
  }

  /**
   * Removes objects from the array if they have an identical [property] as an
   * earlier object in the array.
   *
   * @param {array} array List containing objects
   * @param {string} property Target property for determining uniqueness
   * @returns original array minus objects with duplicate [property] values
   */
  function eliminateDuplicatesByKey(array, property) {
    return array.filter(
      (item, index) =>
        index ===
        array.findIndex(
          t => JSON.stringify(t[property]) === JSON.stringify(item[property]),
        ),
    );
  }

  function isValidOrigin(person) {
    // Make sure that our <select> only shows options that:
    // 1. Have a valid address we can copy
    // 2. Are NOT the current applicant
    return (
      person?.applicantAddress?.country !== undefined && person !== currentApp
    );
  }

  // Gets the veteran/sponsor address and third party address
  // (if available), as well as any addresses belonging to other
  // applicants so we can display in <select> down below
  function getSelectOptions() {
    const allAddresses = [];
    if (data.certifierAddress?.street && data.certifierName)
      allAddresses.push({
        originatorName: fullName(data.certifierName),
        originatorAddress: data.certifierAddress,
        displayText: data.certifierAddress.street,
      });
    if (data.sponsorAddress?.street && data.veteransFullName)
      allAddresses.push({
        originatorName: fullName(data.veteransFullName),
        originatorAddress: data.sponsorAddress,
        displayText: data.sponsorAddress.street,
      });

    data.applicants.filter(app => isValidOrigin(app)).forEach(app =>
      allAddresses.push({
        originatorName: fullName(app.applicantName),
        originatorAddress: app.applicantAddress,
        displayText: app.applicantAddress?.street,
      }),
    );
    // Drop any entries with duplicate addresses
    return eliminateDuplicatesByKey(allAddresses, 'originatorAddress');
  }

  const handlers = {
    validate() {
      let isValid = true;
      if (selectValue === undefined) {
        setSelectError('This field is required');
        isValid = false;
      } else {
        setSelectError(null);
      }
      return isValid;
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
        setAddress(parsedAddress.originatorAddress);
        setSelectValue(value);
      }
      if (value === 'not-shared') {
        setSelectValue(value);
      }
      setDirty(true);
    },
    onGoForward: event => {
      event.preventDefault();
      if (!handlers.validate()) return;
      const tmpVal = { ...data };
      const tmpApp = tmpVal.applicants[pagePerItemIndex];
      tmpApp.sharesAddressWith = selectValue;
      if (selectValue !== 'not-shared') {
        tmpApp.applicantAddress = address;
      }
      setFormData(tmpVal);
      if (onReviewPage) updatePage();
      goForward(data);
    },
  };

  useEffect(
    () => {
      const shadowSelect = $('va-select')?.shadowRoot;
      if (shadowSelect) {
        /* This adds padding to the .usa-select class inside the shadow dom,
        which prevents long <option> text from overlapping the expansion arrow
        on the right side of the <select>. (Needed for accessibility audit) */
        const sheet = new CSSStyleSheet();
        sheet.replaceSync('.usa-select {padding-right: 1.875rem}');
        shadowSelect.adoptedStyleSheets.push(sheet);
      }
      if (dirty) handlers.validate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, selectValue],
  );

  // We use this a few times, so compute now.
  const curAppFullName = fullName(currentApp.applicantName);
  const selectWording = `${
    pagePerItemIndex === 0 && data.certifierRole === 'applicant'
      ? 'Do you'
      : `Does ${curAppFullName}`
  } have the same mailing address as another person listed in this application?`;

  return (
    <>
      {
        titleUI(
          `${applicantWording(currentApp)} address selection`,
          'We’ll send any important information about your application to this address.',
        )['ui:title']
      }

      <form onSubmit={handlers.onGoForward}>
        <VaSelect
          onVaSelect={handlers.selectUpdate}
          error={selectError}
          required
          value={selectValue}
          label={selectWording}
          name="shared-address-select"
        >
          <option value="not-shared">No, use a new address</option>
          {getSelectOptions().map(el => (
            <option key={el.originatorName} value={JSON.stringify(el)}>
              Use {el.displayText}
            </option>
          ))}
        </VaSelect>
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
