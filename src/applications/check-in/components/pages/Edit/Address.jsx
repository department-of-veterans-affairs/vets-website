import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import {
  VaTextInput,
  VaCheckbox,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEditContext } from '../../../selectors';
import {
  createClearEditContext,
  createSetPendingEditedData,
} from '../../../actions/edit';
import CancelButton from './shared/CancelButton';
import UpdateButton from './shared/UpdateButton';
import Header from './shared/Header';
import Footer from '../../layout/Footer';
import BackToHome from '../../BackToHome';

import {
  getLabelForEditField,
  addressFormFields,
  baseCities,
} from '../../../utils/appConstants';
import { countryList } from '../../../utils/appConstants/countryList';

export default function Address(props) {
  const { router } = props;
  const { jumpToPage } = useFormRouting(router);
  const { t } = useTranslation();
  const selectEditContext = useMemo(makeSelectEditContext, []);
  const { editing } = useSelector(selectEditContext);
  const { editingPage, originatingUrl, value, key } = editing;
  const [addressValue, setAddressValue] = useState(
    typeof value !== 'object' || value === null ? {} : value,
  );
  const [addressFields, setAddressFields] = useState(addressFormFields.US);
  const [outsideBase, setOutsideBase] = useState(false);
  const [addressError, setAddressError] = useState({});

  const isUpdatable = useMemo(
    () => {
      return !Object.values(addressError).some(val => val !== null);
    },
    [addressError],
  );

  const dispatch = useDispatch();
  const clearEditContext = useCallback(
    () => {
      dispatch(createClearEditContext());
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    () => {
      dispatch(
        createSetPendingEditedData({ address: addressValue }, editingPage),
      );
    },
    [dispatch, editingPage, addressValue],
  );

  useEffect(
    () => {
      focusElement('h1');
      scrollToTop('topScrollElement');

      if (value.country && value.country !== 'USA') {
        setAddressFields(addressFormFields.OUTSIDE_US);
      } else if (baseCities.some(city => city.value === value.city)) {
        setAddressFields(addressFormFields.BASE);
        setOutsideBase(true);
      }
    },
    [value.country, value.city],
  );

  const onBlur = useCallback(
    (event, extraValidation = false) => {
      const fieldName = event.target.name;
      const newValue = event.detail?.value || event.target.value;
      if (event.target.required) {
        if (!newValue) {
          setAddressError(prevState => ({
            ...prevState,
            [fieldName]: `${event.target.label} ${t('is-required')}`,
          }));
        } else if (newValue && extraValidation) {
          const validate = extraValidation(newValue);
          if (!validate.valid) {
            setAddressError(prevState => ({
              ...prevState,
              [fieldName]: validate.msg,
            }));
          }
        } else {
          setAddressError(prevState => ({
            ...prevState,
            [fieldName]: null,
          }));
        }
      }
      setAddressValue(prevState => ({
        ...prevState,
        [fieldName]: newValue,
      }));
    },
    [setAddressValue, setAddressError, t],
  );
  const onInput = useCallback(
    (event, extraValidation = false) => {
      const fieldName = event.target.name;
      const newValue = event.target?.value;
      if (!isUpdatable) {
        if (extraValidation && newValue) {
          const validate = extraValidation(newValue);
          if (validate.valid) {
            setAddressError(prevState => ({
              ...prevState,
              [fieldName]: null,
            }));
          }
        } else if (newValue) {
          setAddressError(prevState => ({
            ...prevState,
            [fieldName]: null,
          }));
        }
      }
      setAddressValue(prevState => ({
        ...prevState,
        [fieldName]: newValue,
      }));
    },
    [setAddressValue, setAddressError, isUpdatable],
  );
  const handleMilitaryBase = useCallback(
    event => {
      if (event.detail.checked) {
        setAddressFields(addressFormFields.BASE);
      } else {
        setAddressFields(addressFormFields.US);
      }
      setOutsideBase(event.detail.checked);
      setAddressValue(prevState => ({
        ...prevState,
        city: '',
        state: '',
        country: 'USA',
      }));
      setAddressError(prevState => ({
        ...prevState,
        city: t('city-is-required'),
        state: t('state-is-required'),
      }));
    },
    [setAddressValue, setAddressError, t],
  );

  const handleCountryChange = useCallback(
    event => {
      if (event.detail.value !== 'USA') {
        setAddressFields(addressFormFields.OUTSIDE_US);
        setAddressValue(prevState => ({
          ...prevState,
          country: event.detail.value,
          state: null,
          zip: null,
        }));
        setAddressError(prevState => ({
          ...prevState,
          state: null,
          zip: null,
          province: t('state-province-region-is-required'),
          internationalPostalCode: t('international-postal-code-is-required'),
        }));
      } else {
        setAddressFields(addressFormFields.US);
        setAddressValue(prevState => ({
          ...prevState,
          country: 'USA',
          province: null,
          internationalPostalCode: null,
        }));
        setAddressError(prevState => ({
          ...prevState,
          country: event.detail.value,
          province: null,
          internationalPostalCode: null,
          state: t('state-is-required'),
          zip: t('zip-code-is-required'),
        }));
      }
    },
    [setAddressValue, setAddressError, t],
  );

  const renderedFields = (
    <>
      {addressFields.map(addressField => {
        switch (addressField.type) {
          case 'text': {
            return (
              <VaTextInput
                error={addressError[addressField.name]}
                label={addressField.label}
                name={addressField.name}
                key={addressField.name}
                value={addressValue[addressField.name]}
                onBlur={
                  addressField.options?.extraValidation
                    ? event =>
                        onBlur(event, addressField.options.extraValidation)
                    : onBlur
                }
                onInput={
                  addressField.options?.extraValidation
                    ? event =>
                        onInput(event, addressField.options.extraValidation)
                    : onInput
                }
                required={addressField.options?.required}
                inputmode={addressField.options?.inputMode || 'text'}
                data-testid={_.camelCase(addressField.label)}
                // maxLength={addressField.options?.maxLength || null}
              />
            );
          }
          case 'select': {
            return (
              <VaSelect
                error={addressError[addressField.name]}
                label={addressField.label}
                name={addressField.name}
                key={addressField.name}
                value={addressValue[addressField.name]}
                required={addressField.options?.required}
                onVaSelect={
                  addressField.options?.extraValidation
                    ? event =>
                        onBlur(event, addressField.options.extraValidation)
                    : onBlur
                }
                data-testid={_.camelCase(addressField.label)}
              >
                <option value="" />
                {addressField.options.options.map(option => (
                  <option value={option.value} key={option.key}>
                    {option.label}
                  </option>
                ))}
              </VaSelect>
            );
          }
          default:
            return '';
        }
      })}
    </>
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 edit-address-page">
      <Header
        what={getLabelForEditField(key)}
        editingPage={editingPage}
        value={Object.values(value).some(x => x !== null && x !== '')}
      />
      <VaCheckbox
        label={t(
          'i-live-on-a-united-states-military-base-outside-of-the-united-states',
        )}
        onVaChange={handleMilitaryBase}
        className="vads-u-margin-left--neg3"
        checked={outsideBase}
      />
      <VaSelect
        error={null}
        label={t('country')}
        name="country"
        required
        onVaSelect={handleCountryChange}
        value={addressValue.country}
      >
        {outsideBase ? (
          <option key="usa" value="USA">
            {t('united-states')}
          </option>
        ) : (
          countryList.map(country => (
            <>
              <option key={country.key} value={country.value}>
                {country.label}
              </option>
            </>
          ))
        )}
      </VaSelect>
      {renderedFields}
      <UpdateButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
        handleUpdate={handleUpdate}
        isUpdatable={isUpdatable}
      />
      <CancelButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
      />
      <Footer />
      <BackToHome />
    </div>
  );
}

Address.propTypes = {
  router: PropTypes.object,
};
