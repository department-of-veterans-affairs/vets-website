import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import { requestProvidersList } from '../../redux/actions';
import { FETCH_STATUS, FACILITY_SORT_METHODS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import SelectedProvider from './SelectedProvider';
import ProviderList from './ProviderList';

const INITIAL_PROVIDER_DISPLAY_COUNT = 5;

export default function ProviderSelectionField({
  formData,
  onChange,
  idSchema,
}) {
  const dispatch = useDispatch();
  const {
    address,
    communityCareProviderList,
    currentLocation,
    requestStatus,
    requestLocationStatus,
    sortMethod,
  } = useSelector(state => selectProviderSelectionInfo(state));
  const [checkedProvider, setCheckedProvider] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showProvidersList, setShowProvidersList] = useState(false);
  const [providersListLength, setProvidersListLength] = useState(
    INITIAL_PROVIDER_DISPLAY_COUNT,
  );
  const loadingProviders =
    !communityCareProviderList && requestStatus !== FETCH_STATUS.failed;

  const loadingLocations = requestLocationStatus === FETCH_STATUS.loading;

  const providerSelected = 'id' in formData;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(
    () => {
      if (sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation) {
        dispatch(requestProvidersList(currentLocation));
      } else {
        dispatch(requestProvidersList(address));
      }

      if (communityCareProviderList) {
        scrollAndFocus('#providerSelectionHeader');
      }
    },
    [sortMethod],
  );

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
        scrollAndFocus('.va-button-link');
      }
    },
    [formData],
  );

  useEffect(
    () => {
      if (
        showProvidersList &&
        providersListLength > INITIAL_PROVIDER_DISPLAY_COUNT
      ) {
        scrollAndFocus(
          `#${idSchema.$id}_${providersListLength -
            INITIAL_PROVIDER_DISPLAY_COUNT +
            1}`,
        );
      }
    },
    [providersListLength],
  );

  useEffect(
    () => {
      if (showProvidersList && (loadingProviders || loadingLocations)) {
        scrollAndFocus('.loading-indicator');
      } else if (
        showProvidersList &&
        !loadingProviders &&
        requestLocationStatus === FETCH_STATUS.failed
      ) {
        scrollAndFocus('#providerSelectionBlockedLocation');
      } else if (showProvidersList && !loadingProviders && !loadingLocations) {
        scrollAndFocus('#providerSelectionHeader');
      }
    },
    [loadingProviders, loadingLocations],
  );

  if (!showProvidersList) {
    return (
      <SelectedProvider
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
      loadingLocations={loadingLocations}
      loadingProviders={loadingProviders}
      onChange={onChange}
      providersListLength={providersListLength}
      setCheckedProvider={setCheckedProvider}
      setProvidersListLength={setProvidersListLength}
      setShowProvidersList={setShowProvidersList}
    />
  );
}
