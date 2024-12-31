import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FETCH_STATUS, FACILITY_SORT_METHODS } from '../../../utils/constants';
import { selectProviderSelectionInfo } from '../../redux/selectors';
import {
  requestProvidersList,
  updateCCProviderSortMethod,
} from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import InfoAlert from '../../../components/InfoAlert';
import ResidentialAddress from '../../../components/ResidentialAddress';

export default function ProviderSort({
  loadingLocations,
  requestLocationStatus,
  sortByDistanceFromResidential,
  sortByDistanceFromCurrentLocation,
}) {
  const dispatch = useDispatch();
  const {
    address,
    communityCareProviderList,
    currentLocation,
    sortMethod,
  } = useSelector(selectProviderSelectionInfo, shallowEqual);

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

  const showSortByDistanceFromResidential =
    !loadingLocations && sortByDistanceFromResidential;
  const requestLocationStatusFailed =
    requestLocationStatus === FETCH_STATUS.failed;
  return (
    <>
      {showSortByDistanceFromResidential && (
        <>
          {!requestLocationStatusFailed && (
            <>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
                You can choose a provider based on your address on file. Or you
                can{' '}
                <span>
                  <button
                    type="button"
                    className="va-button-link"
                    onClick={() => {
                      dispatch(
                        updateCCProviderSortMethod(
                          FACILITY_SORT_METHODS.distanceFromCurrentLocation,
                        ),
                      );
                    }}
                  >
                    use your current location
                  </button>
                  .
                </span>
              </p>
              <ResidentialAddress address={address} />
            </>
          )}
          {requestLocationStatusFailed && (
            <>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
                You can choose a provider based on your address on file:
              </p>
              <ResidentialAddress address={address} />
              <div id="providerSelectionBlockedLocation">
                <InfoAlert
                  status="warning"
                  headline="Your browser is blocked from finding your current location."
                  className="vads-u-background-color--gold-lightest"
                  level="3"
                >
                  <>
                    <p>
                      Make sure your browser’s location feature is turned on.
                    </p>

                    <button
                      className="va-button-link"
                      onClick={() =>
                        dispatch(
                          updateCCProviderSortMethod(
                            FACILITY_SORT_METHODS.distanceFromCurrentLocation,
                          ),
                        )
                      }
                    >
                      Retry searching based on current location
                    </button>
                  </>
                </InfoAlert>
              </div>
            </>
          )}
        </>
      )}
      {sortByDistanceFromCurrentLocation && (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
          You can choose a provider based on your current location. Or you can{' '}
          <button
            type="button"
            className="va-button-link"
            onClick={() => {
              dispatch(
                updateCCProviderSortMethod(
                  FACILITY_SORT_METHODS.distanceFromResidential,
                ),
              );
            }}
          >
            use your address on file
          </button>
          .
        </p>
      )}
    </>
  );
}
