import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ProviderSelect from './ProviderSelect';
import ProviderList from './ProviderList';

const INITIAL_PROVIDER_DISPLAY_COUNT = 5;

export default function ProviderSelectionField({
  formData,
  onChange,
  idSchema,
}) {
  const [checkedProvider, setCheckedProvider] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showProvidersList, setShowProvidersList] = useState(false);
  const [providersListLength, setProvidersListLength] = useState(
    INITIAL_PROVIDER_DISPLAY_COUNT,
  );

  const providerSelected = 'id' in formData;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showProvidersList) {
      scrollAndFocus('#providerSelectionHeader');
    } else if (mounted && !providerSelected) {
      scrollAndFocus('.va-button-link');
    } else if (mounted) {
      scrollAndFocus('#providerPostSelectionHeader');
    }
  }, [providerSelected, showProvidersList]);

  if (!showProvidersList) {
    return (
      <ProviderSelect
        formData={formData}
        initialProviderDisplayCount={INITIAL_PROVIDER_DISPLAY_COUNT}
        onChange={onChange}
        providerSelected={providerSelected}
        setCheckedProvider={setCheckedProvider}
        setProvidersListLength={setProvidersListLength}
        setShowProvidersList={setShowProvidersList}
      />
    );
  }

  return (
    <>
      <ProviderList
        checkedProvider={checkedProvider}
        idSchema={idSchema}
        initialProviderDisplayCount={INITIAL_PROVIDER_DISPLAY_COUNT}
        onChange={onChange}
        providersListLength={providersListLength}
        setCheckedProvider={setCheckedProvider}
        setProvidersListLength={setProvidersListLength}
        setShowProvidersList={setShowProvidersList}
        showProvidersList={showProvidersList}
      />
    </>
  );
}

ProviderSelectionField.propTypes = {
  formData: PropTypes.object.isRequired,
  idSchema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
