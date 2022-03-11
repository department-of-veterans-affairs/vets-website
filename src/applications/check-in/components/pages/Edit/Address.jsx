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
import Footer from '../../Footer';
import BackToHome from '../../BackToHome';

export default function Address(props) {
  const { router } = props;
  const { jumpToPage } = useFormRouting(router);
  const selectEditContext = useMemo(makeSelectEditContext, []);
  const { editing } = useSelector(selectEditContext);
  const { editingPage, originatingUrl, value } = editing;
  const [addressValue, setAddressValue] = useState(value);
  const [baseOutsideUS, setBaseOutsideUS] = useState(false);
  const [outsideUS, setOutsideUS] = useState(false);

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

  const onChange = useCallback(
    event => {
      setAddressValue(prevState => ({
        ...prevState,
        [event.target.name]: event.detail.value,
      }));
    },
    [setAddressValue],
  );

  const handleMilitaryBase = useCallback(
    () => {
      setBaseOutsideUS(!baseOutsideUS);
      setAddressValue(prevState => ({ ...prevState, city: null, state: null }));
    },
    [setBaseOutsideUS, setAddressValue, baseOutsideUS],
  );

  const handleCountryChange = useCallback(event => {
    if (event.detail.value !== 'USA') {
      setOutsideUS(true);
      setAddressValue(prevState => ({
        ...prevState,
        country: event.detail.value,
        state: null,
      }));
    } else {
      setOutsideUS(false);
      setAddressValue(prevState => ({
        ...prevState,
        country: 'USA',
        province: null,
      }));
    }
  }, []);

  let title = '';
  switch (editingPage) {
    case 'nextOfKin':
      title = "Edit next of kin's address";
      break;
    case 'emergencyContact':
      title = "Edit your contact's address";
      break;
    default:
      title = 'Edit address';
  }
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 edit-address-page">
      <h1 data-testid="header">{title}</h1>
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
        label="Street address"
        name="street1"
        value={addressValue.street1}
        onVaChange={onChange}
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
            error={null}
            label="APO/FPO/DPO"
            name="city"
            required
            onVaSelect={onChange}
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
            error={null}
            label="State"
            name="state"
            required
            onVaSelect={onChange}
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
            label="City"
            name="city"
            value={addressValue.city}
            onVaChange={onChange}
            required
          />
          {outsideUS ? (
            <VaTextInput
              label="State/Province/Region"
              name="province"
              value={addressValue.province}
              onVaChange={onChange}
            />
          ) : (
            <VaSelect
              error={null}
              label="State"
              name="state"
              required
              onVaSelect={onChange}
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

      <VaTextInput
        label={outsideUS ? 'International postal code' : 'Zip code'}
        name={outsideUS ? 'internationalPostalCode' : 'zip'}
        value={
          outsideUS ? addressValue.internationalPostalCode : addressValue.zip
        }
        onVaChange={onChange}
        required
        className="vads-u-margin-bottom--3"
      />
      <UpdateButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
        handleUpdate={handleUpdate}
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
