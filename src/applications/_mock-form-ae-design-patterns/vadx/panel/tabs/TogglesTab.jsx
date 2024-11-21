import {
  VaButton,
  VaCheckbox,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, isEqual } from 'lodash';
import environment from '~/platform/utilities/environment';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { setPowerToolsToggles } from '../actions';

export const TogglesTab = ({ panelApi }) => {
  const {
    isDevLoading,
    setIsDevLoading,
    localToggles,
    setLocalToggles,
    clearLocalToggles,
    searchQuery,
    setSearchQuery,
  } = panelApi;

  const debouncedSetSearchQuery = useMemo(() => debounce(setSearchQuery, 300), [
    setSearchQuery,
  ]);

  const loading = useSelector(state => state?.featureToggles?.loading);

  const toggles = useSelector(state => state?.featureToggles);

  const dispatch = useDispatch();

  const localTogglesAreEmpty = useMemo(() => isEqual(localToggles, {}), [
    localToggles,
  ]);
  const customLocalToggles =
    !localTogglesAreEmpty && !isEqual(localToggles, toggles);

  useEffect(
    () => {
      if (localTogglesAreEmpty) {
        setLocalToggles(toggles);
      }
    },
    [localTogglesAreEmpty, toggles, setLocalToggles],
  );

  useEffect(
    () => {
      if (customLocalToggles) {
        dispatch(setPowerToolsToggles(localToggles));
      }
    },
    [customLocalToggles, localToggles, dispatch],
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const fetchDevToggles = async () => {
    try {
      setIsDevLoading(true);

      const response = await fetch(
        'https://staging-api.va.gov/v0/feature_toggles',
      );
      const {
        data: { features },
      } = await response.json();

      const formattedToggles = features
        .filter(toggle => toggle.name.includes('_'))
        .reduce((acc, toggle) => {
          acc[toggle.name] = toggle.value;
          return acc;
        }, {});

      setLocalToggles(formattedToggles);

      setIsDevLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dev toggles:', error);
    }
  };

  const filteredToggles = Object.keys(toggles).filter(
    toggle =>
      toggle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      toggle !== 'loading',
  );

  return (
    <>
      <VaSearchInput
        buttonText="Search"
        label="Search Toggles"
        onInput={e => debouncedSetSearchQuery(e.target.value)}
        onSubmit={e => debouncedSetSearchQuery(e.target.value)}
        small
        value={searchQuery}
      />
      <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
        <VaButton
          onClick={() => {
            clearLocalToggles();
            window.location.reload();
          }}
          text="Reset Toggles"
          primary
        />

        {isDevLoading ? (
          <LoadingButton text="Loading..." />
        ) : (
          <VaButton
            onClick={fetchDevToggles}
            text="Fetch Dev Toggles"
            secondary
          />
        )}
        <span className="vads-u-font-size--sm vads-u-margin-top--1 vads-u--padding-top--1">
          {filteredToggles?.length} toggles
        </span>
      </div>

      {Object.keys(toggles).length < 2 && (
        <div className="vads-u-margin-top--1">
          <p className="vads-u-display--flex vads-u-align-items--center vads-u-margin--0">
            <va-icon icon="error_outline" size={4} />
            No toggles found.
          </p>
          <p className="vads-u-margin--0">
            Is your api running at {environment.API_URL}?
          </p>
        </div>
      )}

      {filteredToggles.map(toggle => {
        return (
          <span key={toggle}>
            <VaCheckbox
              label={toggle}
              checked={!!toggles[toggle]}
              enable-analytics={false}
              onVaChange={e => {
                const updatedToggles = {
                  ...toggles,
                  [toggle]: e.target.checked,
                };
                setLocalToggles(updatedToggles);
              }}
            />
          </span>
        );
      })}
    </>
  );
};
