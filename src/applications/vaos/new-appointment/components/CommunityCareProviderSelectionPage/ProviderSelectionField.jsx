import React, { useEffect, useState } from 'react';
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
  const descriptionText =
    'We’ll call you to confirm your provider choice or to help you choose a provider if you skip this step.';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(
    () => {
      if (showProvidersList) {
        scrollAndFocus('#providerSelectionHeader');
      } else if (mounted && !providerSelected) {
        scrollAndFocus('.va-button-link');
      } else if (mounted) {
        scrollAndFocus('#providerPostSelectionHeader');
      }
    },
    [providerSelected, showProvidersList],
  );

  if (!showProvidersList) {
    return (
      <>
        {<p>{descriptionText}</p>}
        <ProviderSelect
          formData={formData}
          initialProviderDisplayCount={INITIAL_PROVIDER_DISPLAY_COUNT}
          onChange={onChange}
          providerSelected={providerSelected}
          setCheckedProvider={setCheckedProvider}
          setProvidersListLength={setProvidersListLength}
          setShowProvidersList={setShowProvidersList}
        />
      </>
    );
  }

  return (
    <>
      {<p>{descriptionText}</p>}
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
