import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import {
  VaTextInput,
  VaCheckbox,
  VaSelect,
} from 'web-components/react-bindings';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEditContext } from '../../../selectors';
import {
  createClearEditContext,
  createSetPendingEditedData,
} from '../../../actions/edit';
import CancelButton from './shared/CancelButton';
import UpdateButton from './shared/UpdateButton';
import Header from './shared/Header';
import Footer from '../../Footer';
import BackToHome from '../../BackToHome';

import { getLabelForEditField } from '../../../utils/appConstants';

export default function Address(props) {
  const { router } = props;
  const { jumpToPage } = useFormRouting(router);
  const selectEditContext = useMemo(makeSelectEditContext, []);
  const { editing } = useSelector(selectEditContext);
  const { editingPage, originatingUrl, value, key } = editing;
  const [addressValue, setAddressValue] = useState(value);
  const [baseOutsideUS, setBaseOutsideUS] = useState(false);
  const [outsideUS, setOutsideUS] = useState(false);

  const [addressError, setAddressError] = useState({
    city: null,
    state: null,
    zip: null,
    street1: null,
    province: null,
    internationalPostalCode: null,
  });

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

  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  const onBlur = useCallback(
    event => {
      const fieldName = event.target.name;
      const newValue = event.detail?.value || event.target.value;
      if (event.target.required) {
        if (!newValue) {
          setAddressError(prevState => ({
            ...prevState,
            [fieldName]: `${event.target.label} is required`,
          }));
        } else if (
          fieldName === 'zip' &&
          (!newValue.match(/^[0-9]+$/) || newValue.length !== 5)
        ) {
          setAddressError(prevState => ({
            ...prevState,
            zip: 'Zip code must be 5 digits',
          }));
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
    [setAddressValue, setAddressError],
  );
  const onChange = useCallback(
    event => {
      const fieldName = event.target.name;
      const newValue = event.detail.value;
      if (!isUpdatable) {
        if (fieldName === 'zip') {
          if (newValue && newValue.match(/^[0-9]+$/) && newValue.length === 5) {
            setAddressError(prevState => ({
              ...prevState,
              zip: null,
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
    [setAddressValue, setAddressError, addressError],
  );
  const handleMilitaryBase = useCallback(
    () => {
      setBaseOutsideUS(!baseOutsideUS);
      setAddressValue(prevState => ({ ...prevState, city: '', state: '' }));
      setAddressError(prevState => ({
        ...prevState,
        city: 'City is required',
        state: 'State is required',
      }));
    },
    [setBaseOutsideUS, setAddressValue, setAddressError, baseOutsideUS],
  );

  const handleCountryChange = useCallback(
    event => {
      if (event.detail.value !== 'USA') {
        setOutsideUS(true);
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
          province: 'State/Province/Region is required.',
          internationalPostalCode: 'International postal code is required.',
        }));
      } else {
        setOutsideUS(false);
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
          state: 'State is required',
          zip: 'Zip code is required',
        }));
      }
    },
    [setOutsideUS, setAddressValue, setAddressError],
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 edit-address-page">
      <Header
        what={getLabelForEditField(key)}
        editingPage={editingPage}
        value={value}
      />
      <VaCheckbox
        label="I live on a United States military base outside of the United States."
        onVaChange={handleMilitaryBase}
        className="vads-u-margin-left--neg3"
      />
      <VaSelect
        error={null}
        label="Country"
        name="country"
        required
        onVaSelect={handleCountryChange}
        value={addressValue.country}
        disabled={baseOutsideUS}
      >
        <option key="usa" value="USA">
          United States
        </option>
        <option key="other" value="other">
          Other
        </option>
      </VaSelect>
      <VaTextInput
        error={addressError.street1}
        label="Street address"
        name="street1"
        value={addressValue.street1}
        onVaBlur={onBlur}
        onVaChange={onChange}
        required
      />
      <VaTextInput
        label="Street address line 2"
        name="street2"
        value={addressValue.street2}
        onVaChange={onChange}
      />
      <VaTextInput
        label="Street address line 3"
        name="street3"
        value={addressValue.street3}
        onVaChange={onChange}
      />
      {baseOutsideUS ? (
        <>
          <VaSelect
            error={addressError.city}
            label="APO/FPO/DPO"
            name="city"
            required
            onVaSelect={onBlur}
            value={addressValue.city}
          >
            <option value="" />
            <option key="apo" value="apo">
              APO
            </option>
            <option key="fpo" value="fpo">
              FPO
            </option>
            <option key="dpo" value="dpo">
              DPO
            </option>
          </VaSelect>
          <VaSelect
            error={addressError.state}
            label="State"
            name="state"
            required
            onVaSelect={onBlur}
            value={addressValue.state}
          >
            <option value="" />
            <option value="AA">Armed Forces Americas (AA)</option>
            <option value="AP">Armed Forces Pacific (AP)</option>
            <option value="AE">Armed Forces Europe (AE)</option>
          </VaSelect>
        </>
      ) : (
        <>
          <VaTextInput
            error={addressError.city}
            label="City"
            name="city"
            value={addressValue.city}
            onBlur={onBlur}
            onVaChange={onChange}
            required
          />
          {outsideUS ? (
            <VaTextInput
              error={addressError.province}
              label="State/Province/Region"
              name="province"
              value={addressValue.province}
              onVaChange={onChange}
              onVaBlur={onBlur}
              required
            />
          ) : (
            <VaSelect
              error={addressError.state}
              label="State"
              name="state"
              required
              onVaSelect={onBlur}
              value={addressValue.state}
            >
              <option value="" />
              <option key="az" value="Arizona">
                AZ
              </option>
              <option key="al" value="Alabama">
                AL
              </option>
              <option key="nm" value="New Mexico">
                NM
              </option>
            </VaSelect>
          )}
        </>
      )}
      {outsideUS ? (
        <VaTextInput
          error={addressError.internationalPostalCode}
          label="International postal code"
          name="internationalPostalCode"
          value={addressValue.internationalPostalCode}
          onVaBlur={onBlur}
          onVaChange={onChange}
          required
          className="vads-u-margin-bottom--3"
        />
      ) : (
        <VaTextInput
          error={addressError.zip}
          label="Zip code"
          name="zip"
          value={addressValue.zip}
          onVaBlur={onBlur}
          onVaChange={onChange}
          required
          className="vads-u-margin-bottom--3"
          inputmode="numeric"
          // maxLength="5"
        />
      )}

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
