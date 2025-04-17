import {
  VaButton,
  VaCheckbox,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { snakeCase } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { useDispatch } from 'react-redux';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import { TOGGLE_VALUES_RESET } from 'platform/site-wide/feature-toggles/actionTypes';
import { VADXContext } from '../../../context/vadx';

/**
 * @component TogglesTab
 *
 * @description A tab component that manages and displays feature toggles
 * This component provides functionality to:
 * - Search through feature toggles
 * - Reset toggles to their default values
 * - Fetch toggles from the staging environment
 * - Toggle individual features on/off
 *
 * @requires VADXContext - Context providing toggle state management and other VADX utilities
 *
 * @requires Redux - For global state management of feature toggles
 *
 * @note
 * - Only displays toggles with underscore naming convention
 * - Excludes toggles containing 'vadx' in their names
 * - Maintains both camelCase and snake_case versions of toggle names for compatibility within state
 *
 */
export const TogglesTab = () => {
  const dispatch = useDispatch();
  const {
    preferences,
    updateDevLoading,
    updateLocalToggles,
    updateClearLocalToggles,
    debouncedSetSearchQuery,
    togglesLoading,
    togglesState,
  } = useContext(VADXContext);

  const handleResetToggles = useCallback(() => {
    updateDevLoading(true);
    updateClearLocalToggles();
    dispatch({ type: TOGGLE_VALUES_RESET });
    dispatch(connectFeatureToggle);
    updateDevLoading(false);
  }, [dispatch, updateDevLoading, updateClearLocalToggles]);

  const { searchQuery, isDevLoading } = preferences;

  useEffect(() => {
    if (preferences?.localToggles) {
      updateLocalToggles(preferences.localToggles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDevToggles = useCallback(async () => {
    try {
      updateDevLoading(true);

      const response = await fetch(
        'https://staging-api.va.gov/v0/feature_toggles',
      );
      const {
        data: { features },
      } = await response.json();

      const formattedToggles = features
        .filter(toggle => {
          return toggle.name.includes('_') && !toggle.name.includes('vadx');
        })
        .reduce(
          (acc, toggle) => {
            acc[toggle.name] = toggle.value;
            return acc;
          },
          {
            [FEATURE_FLAG_NAMES.aedpVADX]: true,
          },
        );

      updateLocalToggles(formattedToggles);

      updateDevLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dev toggles:', error);
    }
  }, [updateDevLoading, updateLocalToggles]);

  const filteredToggles = useMemo(() => {
    return Object.keys(togglesState).filter(toggle => {
      const toggleName = toggle.toLowerCase();
      const searchQueryLower = searchQuery?.toLowerCase() || '';

      return (
        toggle.includes('_') &&
        toggleName.includes(searchQueryLower) &&
        !toggleName.includes('vadx') &&
        toggle !== 'loading'
      );
    });
  }, [togglesState, searchQuery]);

  if (togglesLoading || isDevLoading) {
    return <div>Loading...</div>;
  }

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
        <VaButton onClick={handleResetToggles} text="Reset Toggles" primary />

        <VaButton
          onClick={fetchDevToggles}
          text={isDevLoading ? 'Loading...' : 'Fetch Dev Toggles'}
          disabled={isDevLoading}
          secondary
        />

        <span className="vads-u-font-size--sm vads-u-margin-top--1 vads-u--padding-top--1">
          {filteredToggles?.length} toggles
        </span>
      </div>

      {Object.keys(togglesState).length < 2 && (
        <div className="vads-u-margin-top--1">
          <p className="vads-u-display--flex vads-u-align-items--center vads-u-margin--0">
            <va-icon icon="error_outline" size={4} />
            No toggles found.
          </p>
        </div>
      )}

      {filteredToggles.map(toggle => {
        const snakeCaseToggle = snakeCase(toggle);
        return (
          <span key={toggle}>
            <VaCheckbox
              label={toggle}
              checked={!!togglesState[toggle]}
              enable-analytics={false}
              onVaChange={e => {
                const updatedToggles = {
                  ...togglesState,
                  [toggle]: e.target.checked,
                  [snakeCaseToggle]: e.target.checked,
                };
                updateLocalToggles(updatedToggles);
              }}
            />
          </span>
        );
      })}
    </>
  );
};
