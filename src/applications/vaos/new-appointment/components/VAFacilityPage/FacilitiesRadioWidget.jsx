import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getCernerURL } from 'platform/utilities/cerner';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import { selectFacilitiesRadioWidget } from '../../redux/selectors';
import State from '../../../components/State';
import InfoAlert from '../../../components/InfoAlert';
import NewTabAnchor from '../../../components/NewTabAnchor';
import {
  FACILITY_SORT_METHODS,
  FETCH_STATUS,
  GA_PREFIX,
} from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { isCernerLocation } from '../../../services/location';

const INITIAL_FACILITY_DISPLAY_COUNT = 5;

/*
 * This is a copy of the form system RadioWidget, but with custom
 * code to disable certain options. This isn't currently supported by the
 * form system.
 */
export default function FacilitiesRadioWidget({
  id,
  options,
  value,
  onChange,
  formContext,
}) {
  const {
    cernerSiteIds,
    requestLocationStatus,
    sortMethod,
    loadingEligibility,
  } = useSelector(state => selectFacilitiesRadioWidget(state), shallowEqual);
  const { hasUserAddress, sortOptions, updateFacilitySortMethod } = formContext;
  const { enumOptions } = options;
  const selectedIndex = enumOptions.findIndex(o => o.value === value);
  const sortedByText = sortMethod
    ? sortOptions.find(type => type.value === sortMethod).label
    : sortOptions[0].label;
  const requestingLocationFailed =
    requestLocationStatus === FETCH_STATUS.failed;

  // If user has already selected a value, and the index of that value is > 4,
  // show this view already expanded
  const [displayAll, setDisplayAll] = useState(
    selectedIndex >= INITIAL_FACILITY_DISPLAY_COUNT,
  );

  // currently shown facility list
  const displayedOptions = displayAll
    ? enumOptions
    : enumOptions.slice(0, INITIAL_FACILITY_DISPLAY_COUNT);
  // remaining facilities count
  const hiddenCount =
    enumOptions.length > INITIAL_FACILITY_DISPLAY_COUNT
      ? enumOptions.length - INITIAL_FACILITY_DISPLAY_COUNT
      : 0;

  // format optons for new component
  const selectOptions = sortOptions.map((s, i) => {
    return (
      <option key={i} value={s.value}>
        {s.label}
      </option>
    );
  });

  useEffect(
    () => {
      if (displayedOptions.length > INITIAL_FACILITY_DISPLAY_COUNT) {
        scrollAndFocus(`#${id}_${INITIAL_FACILITY_DISPLAY_COUNT + 1}`);
      }
    },
    [displayedOptions.length, displayAll],
  );

  return (
    <div className="vads-u-margin-top--3">
      <div aria-live="assertive" className="sr-only">
        Showing VA facilities sorted {sortedByText}
      </div>
      <>
        <div className="vads-u-margin-bottom--3">
          <VaSelect
            label="Sort facilities"
            name="sort"
            onVaSelect={type => {
              recordEvent({
                event: `${GA_PREFIX}-variant-method-${type.detail.value}`,
              });
              updateFacilitySortMethod(type.detail.value);
            }}
            value={sortMethod}
            data-testid="facilitiesSelect"
            uswds
          >
            {hasUserAddress ? selectOptions : selectOptions.slice(1)}
          </VaSelect>
        </div>
        {!hasUserAddress && (
          <p>
            Note: to show facilities near your home, add your residential
            address{' '}
            <NewTabAnchor href="/profile">in your VA profile</NewTabAnchor>.
          </p>
        )}
        {requestingLocationFailed && (
          <div className="vads-u-padding-top--1">
            <InfoAlert
              status="warning"
              headline="Your browser is blocked from finding your current location."
              className="vads-u-background-color--gold-lightest vads-u-font-size--base"
              level="3"
            >
              <p>Make sure your browser’s location feature is turned on.</p>
              <button
                className="va-button-link"
                onClick={() =>
                  updateFacilitySortMethod(
                    FACILITY_SORT_METHODS.distanceFromCurrentLocation,
                  )
                }
              >
                Retry searching based on current location
              </button>
            </InfoAlert>
          </div>
        )}
      </>
      {!requestingLocationFailed &&
        displayedOptions.map((option, i) => {
          const { name, address, legacyVAR } = option?.label;
          const checked = option.value === value;
          const isCerner = isCernerLocation(option.value, cernerSiteIds);
          let distance;

          if (sortMethod === FACILITY_SORT_METHODS.distanceFromResidential) {
            distance = legacyVAR?.distanceFromResidentialAddress;
          } else if (
            sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation
          ) {
            distance = legacyVAR?.distanceFromCurrentLocation;
          } else {
            distance = legacyVAR?.distanceFromResidentialAddress;
          }
          const facilityPosition = i + 1;

          return (
            <div className="form-radio-buttons" key={option.value}>
              <input
                type="radio"
                checked={checked}
                id={`${id}_${facilityPosition}`}
                name={`${id}`}
                value={option.value}
                onChange={_ => onChange(option.value)}
                disabled={loadingEligibility}
              />
              <label htmlFor={`${id}_${facilityPosition}`}>
                <span className="vads-u-display--block vads-u-font-weight--bold">
                  {name}
                </span>
                <span className="vads-u-display--block vads-u-font-size--sm">
                  {address?.city}, <State state={address?.state} />
                </span>
                {!!distance && (
                  <span className="vads-u-display--block vads-u-font-size--sm">
                    {distance} miles
                  </span>
                )}
                {isCerner && (
                  <a href={getCernerURL('/pages/scheduling/upcoming')}>
                    Schedule online at <strong>My VA Health</strong>
                  </a>
                )}
              </label>
            </div>
          );
        })}
      {!displayAll &&
        !requestingLocationFailed &&
        hiddenCount > 0 && (
          <button
            type="button"
            className="additional-info-button va-button-link vads-u-display--block"
            onClick={() => {
              setDisplayAll(!displayAll);
            }}
          >
            <span className="sr-only">show</span>
            <span className="va-button-link">
              {`+ ${hiddenCount} more location${hiddenCount === 1 ? '' : 's'}`}
            </span>
          </button>
        )}
    </div>
  );
}
