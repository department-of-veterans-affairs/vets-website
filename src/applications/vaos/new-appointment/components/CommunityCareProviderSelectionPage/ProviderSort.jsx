import React from 'react';
import { useDispatch } from 'react-redux';
import { FETCH_STATUS, FACILITY_SORT_METHODS } from '../../../utils/constants';
import { updateCCProviderSortMethod } from '../../redux/actions';
import InfoAlert from '../../../components/InfoAlert';
import ResidentialAddress from '../../../components/ResidentialAddress';

// TODO: see if you can use selector to get props instead
export default function ProviderSort({
  address,
  loadingLocations,
  requestLocationStatus,
  sortByDistanceFromResidential,
}) {
  const dispatch = useDispatch();
  const showSortByDistanceFromResidential =
    !loadingLocations && sortByDistanceFromResidential;
  return (
    <>
      {showSortByDistanceFromResidential && (
        <>
          {requestLocationStatus !== FETCH_STATUS.failed && (
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
          {requestLocationStatus === FETCH_STATUS.failed && (
            <>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
                You can choose a provider based on your address on file:
              </p>
              <ResidentialAddress address={address} />
              <div id="providerSelectionBlockedLocation">
                <InfoAlert
                  status="warning"
                  headline="Your browser is blocked from finding your current location."
                  className="vads-u-background-color--gold-lightest vads-u-font-size--base"
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
    </>
  );
}
