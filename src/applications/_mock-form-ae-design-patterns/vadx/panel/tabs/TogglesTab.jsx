import {
  VaButton,
  VaCheckbox,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useContext } from 'react';
import environment from '~/platform/utilities/environment';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { VADXContext } from '../../context/vadx';

export const TogglesTab = () => {
  const {
    preferences,
    updateDevLoading,
    updateLocalToggles,
    updateClearLocalToggles,
    debouncedSetSearchQuery,
    togglesLoading,
    togglesState,
  } = useContext(VADXContext);

  const { searchQuery, isDevLoading } = preferences;

  if (togglesLoading) {
    return <div>Loading...</div>;
  }

  const fetchDevToggles = async () => {
    try {
      updateDevLoading(true);

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

      updateLocalToggles(formattedToggles);

      updateDevLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dev toggles:', error);
    }
  };

  const filteredToggles = Object.keys(togglesState).filter(toggle => {
    const toggleName = toggle?.toLowerCase?.() || '';
    const searchQueryLower = searchQuery?.toLowerCase?.() || '';
    return toggleName.includes(searchQueryLower) && toggle !== 'loading';
  });

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
            updateClearLocalToggles();
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

      {Object.keys(togglesState).length < 2 && (
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
              checked={!!togglesState[toggle]}
              enable-analytics={false}
              onVaChange={e => {
                const updatedToggles = {
                  ...togglesState,
                  [toggle]: e.target.checked,
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
