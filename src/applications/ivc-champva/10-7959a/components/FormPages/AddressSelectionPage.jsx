import { cloneDeep } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording } from '../../../shared/utilities';
import { VaRadio, VaRadioOption } from '../../utils/imports';
import content from '../../locales/en/content.json';

// declare reusable constants
export const FIELD_NAME = 'view:sharesAddressWith';
export const NOT_SHARED = 'na';

// declare static content
const ERROR_MSG_REQUIRED = content['error--required'];
const LABEL_TEXT = content['address-selection--label-text'];
const OPTION_NO_LABEL = content['address-selection--no-option'];
const OPTION_YES_LABEL = content['address-selection--yes-option'];
const PAGE_TITLE = content['address-selection--page-title'];
const PAGE_DESCRIPTION = content['address-selection--page-description'];
const PROMPT = content['address-selection--prompt'];

// convert address objects to formatted strings
const formatAddress = ({ street, street2, city, state, country } = {}) =>
  [street, street2, [city, state].filter(Boolean).join(', '), country]
    .filter(Boolean)
    .join(', ');

// build unique radio options from form data
const buildAddressOptions = ({ certifierAddress, sponsorAddress }) => {
  const addUnique = (map, addr) => {
    const formatted = formatAddress(addr);
    if (formatted && !map.has(formatted)) {
      map.set(formatted, { label: formatted, val: JSON.stringify(addr) });
    }
  };
  const m = new Map();
  addUnique(m, certifierAddress);
  addUnique(m, sponsorAddress);
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
    goForward,
    onChange,
  } = props;
  const currentValue = data[FIELD_NAME];

  const [error, setError] = useState(undefined);

  const handleChange = useCallback(
    e => {
      const nextValue = e?.detail?.value;
      setError(undefined);

      const nextData = applyOptionSelection(data, nextValue, dataKey);
      onChange(nextData);
    },
    [data, dataKey, onChange],
  );

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      if (!currentValue) return setError(ERROR_MSG_REQUIRED);
      return goForward({ formData: data });
    },
    [currentValue, data, goForward],
  );

  const addressOpts = useMemo(
    () =>
      buildAddressOptions({
        certifierAddress: data.certifierAddress,
        sponsorAddress: data.sponsorAddress,
      }),
    [data.certifierAddress, data.sponsorAddress],
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
      const applicantName = nameWording(data, undefined, undefined, true);
      return titleUI(
        <>
          <span data-dd-privacy="hidden">{applicantName}</span> {PAGE_TITLE}
        </>,
        PAGE_DESCRIPTION,
      )['ui:title'];
    },
    [data],
  );

  const inputLabel = useMemo(
    () => {
      const applicantName = nameWording(data, false, false, true);
      return `${PROMPT} ${applicantName} ${LABEL_TEXT}`;
    },
    [data],
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
  goForward: PropTypes.func,
  onChange: PropTypes.func,
};

export default AddressSelectionPage;
