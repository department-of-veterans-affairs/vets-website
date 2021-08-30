import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import ProviderSelect from './ProviderSelect';
import ProviderList from './ProviderList';

const INITIAL_PROVIDER_DISPLAY_COUNT = 5;

export default function ProviderSelectionField({
  formData,
  onChange,
  idSchema,
}) {
  const { showCCIterations } = useSelector(
    selectProviderSelectionInfo,
    shallowEqual,
  );
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
    [showProvidersList],
  );

  useEffect(
    () => {
      if (mounted && Object.keys(formData).length === 0) {
        if (showCCIterations) {
          scrollAndFocus('select');
        } else {
          scrollAndFocus('.va-button-link');
        }
      }
    },
    [formData],
  );

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
  );
}
