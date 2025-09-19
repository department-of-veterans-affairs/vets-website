import { cloneDeep } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { applicantWording } from '../../../shared/utilities';
import { VaRadio, VaRadioOption } from '../../imports';

// declare reusable constants
export const FIELD_NAME = 'view:sharesAddressWith';
export const NOT_SHARED = 'na';

// declare option content
const OPTION_NO_LABEL = 'No, use a new address';
const OPTION_YES_LABEL = 'Yes, use';

// convert address objects to formatted strings
const formatAddress = ({ street, street2, city, state, country } = {}) =>
  [street, street2, [city, state].filter(Boolean).join(', '), country]
    .filter(Boolean)
    .join(', ');

// build unique radio options from form data
const buildAddressOptions = ({
  certifierAddress,
  sponsorAddress,
  applicants,
  excludeIndex,
}) => {
  const addUnique = (map, addr) => {
    const formatted = formatAddress(addr);
    if (formatted && !map.has(formatted)) {
      map.set(formatted, { label: formatted, val: JSON.stringify(addr) });
    }
  };
  const m = new Map();
  addUnique(m, certifierAddress);
  addUnique(m, sponsorAddress);
  (applicants ?? []).forEach((a, i) => {
    if (i !== excludeIndex) addUnique(m, a?.applicantAddress);
  });

  return [...m.values()];
};

// declare a safety helper for parsing JSON string
const safeParse = str => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

// apply radio option selection to correct data object
const applyOptionSelection = (src, nextValue, dataKey) => {
  const clonedSrc = cloneDeep(src);
  const base = { ...clonedSrc, [FIELD_NAME]: nextValue };

  if (nextValue === NOT_SHARED) {
    delete base[dataKey];
    return base;
  }

  const parsed = safeParse(nextValue);
  return parsed ? { ...base, [dataKey]: parsed } : base;
};

const AddressSelectionPage = props => {
  const {
    NavButtons,
    contentAfterButtons,
    contentBeforeButtons,
    data,
    dataKey,
    fullData,
    goForward,
    pagePerItemIndex,
    onChange,
  } = props;

  // `fullData` is populated when inside the ArrayBuilder flow
  const fullOrItemData = fullData ?? data;

  // `pagePerItemIndex` is a string, we need to convert it to a number
  const itemIndex = useMemo(
    () => {
      const n = Number(pagePerItemIndex);
      return Number.isFinite(n) && n >= 0 ? n : null;
    },
    [pagePerItemIndex],
  );
  const isArrayMode = itemIndex !== null;

  // data can be the root dataset or from an array item
  const localData = useMemo(
    () =>
      isArrayMode && data.applicants
        ? data.applicants?.[itemIndex] ?? {}
        : data,
    [data, isArrayMode, itemIndex],
  );
  const currentValue = localData[FIELD_NAME];

  const [error, setError] = useState(undefined);

  const handleChange = useCallback(
    e => {
      const nextValue = e?.detail?.value;
      setError(undefined);

      const dataToUpdate = isArrayMode ? localData : fullOrItemData;
      const nextData = applyOptionSelection(dataToUpdate, nextValue, dataKey);
      onChange(nextData);
    },
    [dataKey, fullOrItemData, isArrayMode, localData, onChange],
  );

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      if (!currentValue) return setError('You must provide a response');
      return goForward({ formData: data });
    },
    [currentValue, data, goForward],
  );

  const addressOpts = useMemo(
    () =>
      buildAddressOptions({
        certifierAddress: fullOrItemData.certifierAddress,
        sponsorAddress: fullOrItemData.sponsorAddress,
        applicants: fullOrItemData.applicants,
        excludeIndex: isArrayMode ? itemIndex : -1,
      }),
    [
      fullOrItemData.certifierAddress,
      fullOrItemData.sponsorAddress,
      fullOrItemData.applicants,
      isArrayMode,
      itemIndex,
    ],
  );

  const vaRadioOpts = useMemo(
    () => (
      <>
        <VaRadioOption
          key="not_shared"
          name={`root_${FIELD_NAME}`}
          label={OPTION_NO_LABEL}
          value={NOT_SHARED}
          checked={currentValue === NOT_SHARED}
        />
        {addressOpts.map(({ label, val }) => (
          <VaRadioOption
            key={label}
            name={`root_${FIELD_NAME}`}
            label={`${OPTION_YES_LABEL} ${label}`}
            value={val}
            checked={val === currentValue}
            data-dd-privacy="hidden"
          />
        ))}
      </>
    ),
    [addressOpts, currentValue],
  );

  const pageTitle = useMemo(
    () => {
      const party = isArrayMode ? applicantWording(localData) : 'Veteran’s';
      return titleUI(
        <>
          <span data-dd-privacy="hidden">{party}</span> address selection
        </>,
        'We’ll send any important information about this application to this address.',
      )['ui:title'];
    },
    [isArrayMode, localData],
  );

  const inputLabel = useMemo(
    () => {
      const party = isArrayMode ? 'applicant' : 'Veteran';
      const prompt =
        data.certifierRole === 'applicant' && itemIndex === 0
          ? 'Do you'
          : `Does the ${party}`;
      return `${prompt} have the same mailing address as one previously entered in this application?`;
    },
    [data.certifierRole, isArrayMode, itemIndex],
  );

  return (
    <form className="rjsf" onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-bottom--2">
        <legend className="schemaform-block-title">{pageTitle}</legend>

        <VaRadio
          id={`root_${FIELD_NAME}`}
          name={`root_${FIELD_NAME}`}
          label={inputLabel}
          onVaValueChange={handleChange}
          error={error}
          required
        >
          {vaRadioOpts}
        </VaRadio>
      </fieldset>

      {contentBeforeButtons}
      <NavButtons submitToContinue />
      {contentAfterButtons}
    </form>
  );
};

AddressSelectionPage.propTypes = {
  NavButtons: PropTypes.func,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  dataKey: PropTypes.string,
  fullData: PropTypes.object,
  goForward: PropTypes.func,
  pagePerItemIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
};

export default AddressSelectionPage;
