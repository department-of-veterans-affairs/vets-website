import React, { useState, useEffect } from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import PropTypes from 'prop-types';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { CustomPageNavButtons } from '../CustomPageNavButtons';
import { applicantWording } from '../../utilities';

export function ApplicantAddressCopyPage(props) {
  const {
    contentBeforeButtons,
    contentAfterButtons,
    customAddressKey, // optional override of `applicantAddress` so we can target arbitrary addresses in the form
    data,
    fullData,
    setFormData,
    goForward,
    pagePerItemIndex,
    updatePage,
    onReviewPage,
    customTitle,
    customDescription,
    customSelectText,
    positivePrefix,
    negativePrefix,
  } = props;
  const addressKey = customAddressKey ?? 'applicantAddress';
  // Get the current applicant from list, OR if we don't have a list of
  // applicants, just treat the whole form data object as a single applicant
  let currentApp =
    pagePerItemIndex && data?.applicants
      ? data?.applicants?.[pagePerItemIndex]
      : data;

  // If currentApp is undefined just use empty object to prevent
  // array builder error when clicking "cancel" on first applicant
  if (!currentApp) currentApp = {};

  const [selectValue, setSelectValue] = useState(currentApp?.sharesAddressWith);
  const [address, setAddress] = useState(
    data?.[addressKey] ?? currentApp?.[addressKey],
  );
  // const [radioError, setRadioError] = useState(undefined);
  const [selectError, setSelectError] = useState(undefined);
  const [dirty, setDirty] = useState(false);

  const navButtons = CustomPageNavButtons(props);

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
    return person?.[addressKey]?.country !== undefined && person !== currentApp;
  }

  // Gets the veteran/sponsor address and third party address
  // (if available), as well as any addresses belonging to other
  // applicants so we can display in <select> down below
  function getSelectOptions() {
    // fullData is present when this component is used inside the Array Builder
    const fullOrItemData = fullData ?? data;

    const allAddresses = [];
    if (fullOrItemData.certifierAddress?.street && fullOrItemData.certifierName)
      allAddresses.push({
        originatorName: fullName(fullOrItemData.certifierName),
        originatorAddress: fullOrItemData.certifierAddress,
        displayText: `${fullOrItemData.certifierAddress.street} ${fullOrItemData
          .certifierAddress?.state ?? ''}`,
      });
    if (
      fullOrItemData.sponsorAddress?.street &&
      (fullOrItemData.veteransFullName ?? fullOrItemData.sponsorName)
    )
      allAddresses.push({
        originatorName: fullName(
          fullOrItemData.veteransFullName ?? fullOrItemData.sponsorName,
        ),
        originatorAddress: fullOrItemData.sponsorAddress,
        displayText: `${fullOrItemData.sponsorAddress.street} ${fullOrItemData
          .sponsorAddress?.state ?? ''}`,
      });

    if (fullOrItemData?.applicants)
      fullOrItemData.applicants.filter(app => isValidOrigin(app)).forEach(app =>
        allAddresses.push({
          originatorName: fullName(app.applicantName),
          originatorAddress: app?.[addressKey],
          displayText: `${app?.[addressKey].street} ${app?.[addressKey]
            ?.state ?? ''}`,
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
      // fullData is present when in Array Builder flows
      const fullOrItemData = fullData ?? data;
      const tmpVal = { ...fullOrItemData };
      // Either use the current list loop applicant, or treat whole form data as an applicant
      const tmpApp =
        pagePerItemIndex && fullOrItemData?.applicants
          ? tmpVal?.applicants[pagePerItemIndex]
          : tmpVal;
      tmpApp.sharesAddressWith = selectValue;
      if (selectValue !== 'not-shared') {
        tmpApp[addressKey] = address;
      }
      setFormData(tmpVal);
      if (onReviewPage) updatePage();
      goForward({ formData: data });
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
  const selectWording =
    customSelectText ??
    `${
      pagePerItemIndex === 0 && data.certifierRole === 'applicant'
        ? 'Do you'
        : `Does the applicant`
    } have the same mailing address as another person listed in this application?`;

  return (
    <>
      <form onSubmit={handlers.onGoForward}>
        {
          titleUI(
            customTitle ?? (
              <>
                <span className="dd-privacy-hidden">
                  {applicantWording(currentApp)}
                </span>{' '}
                address selection
              </>
            ),
            customDescription ??
              'We’ll send any important information about your application to this address.',
          )['ui:title']
        }
        <VaSelect
          onVaSelect={handlers.selectUpdate}
          error={selectError}
          required
          value={selectValue}
          label={selectWording}
          name="shared-address-select"
          className="dd-privacy-hidden"
        >
          <option value="not-shared">
            {negativePrefix ?? 'No, use a new address'}
          </option>
          {getSelectOptions().map(el => (
            <option
              className="dd-privacy-hidden"
              key={el.originatorName}
              value={JSON.stringify(el)}
            >
              {`${positivePrefix ?? 'Use'} `}
              {el.displayText}
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
  arrayBuilder: PropTypes.object,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  customAddressKey: PropTypes.string,
  customDescription: PropTypes.string,
  customSelectText: PropTypes.string,
  customTitle: PropTypes.string,
  data: PropTypes.object,
  fullData: PropTypes.object,
  genOp: PropTypes.func,
  goForward: PropTypes.func,
  keyname: PropTypes.string,
  negativePrefix: PropTypes.string,
  pagePerItemIndex: PropTypes.string || PropTypes.number,
  positivePrefix: PropTypes.string,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
