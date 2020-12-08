import React, { useEffect, useState } from 'react';
import { selectProviderSelectionInfo } from '../../../utils/selectors';
import ResidentialAddress from '../../../components/ResidentialAddress';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import { FETCH_STATUS } from '../../../utils/constants';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { distanceBetween } from '../../../utils/address';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ErrorMessage from '../../../components/ErrorMessage';
import RemoveProviderModal from './RemoveProviderModal';

const INITIAL_PROVIDER_DISPLAY_COUNT = 5;

function ProviderSelectionField({
  address,
  formData,
  onChange,
  idSchema,
  requestStatus,
  requestProvidersList,
  communityCareProviderList,
}) {
  const [checkedProvider, setCheckedProvider] = useState(false);
  const [showRemoveProviderModal, setShowRemoveProviderModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showProvidersList, setShowProvidersList] = useState(false);
  const [providersListLength, setProvidersListLength] = useState(
    INITIAL_PROVIDER_DISPLAY_COUNT,
  );
  const currentlyShownProvidersList = communityCareProviderList?.slice(
    0,
    providersListLength,
  );
  const loadingProviders =
    requestStatus === FETCH_STATUS.loading ||
    requestStatus === FETCH_STATUS.notStarted;
  const providerSelected = 'id' in formData;
  useEffect(() => {
    requestProvidersList(address);
    setMounted(true);
  }, []);

  useEffect(
    () => {
      if (showProvidersList) {
        scrollAndFocus('h2');
      } else if (mounted) {
        scrollAndFocus('.va-button-link');
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

  return (
    <div className="vads-u-background-color--gray-lightest small-screen:vads-u-padding--2 medium-screen:vads-u-padding--3">
      {!showProvidersList &&
        !providerSelected && (
          <button
            className="va-button-link"
            type="button"
            onClick={() => setShowProvidersList(true)}
          >
            <i className="fas fa-plus vads-u-padding-right--0p5" />
            Choose a provider
          </button>
        )}
      {!showProvidersList &&
        providerSelected && (
          <>
            <span className="vads-u-display--block vads-u-font-weight--bold">
              {formData.name}
            </span>
            <span className="vads-u-display--block">
              {formData.address?.line}
            </span>
            <span className="vads-u-display--block">
              {formData.address?.city}, {formData.address?.state}{' '}
              {formData.address?.postalCode}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm vads-u-font-weight--bold">
              {distanceBetween(
                formData.position?.latitude,
                formData.position?.longitude,
                address.latitude,
                address.longitude,
              )}{' '}
              miles
            </span>
            <div className="vads-u-display--flex">
              <button
                type="button"
                className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0 vads-u-margin-right--2"
                onClick={() => {
                  setProvidersListLength(INITIAL_PROVIDER_DISPLAY_COUNT);
                  setShowProvidersList(true);
                }}
              >
                Change provider
              </button>
              <button
                type="button"
                className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0 vads-u-margin-right--2"
                onClick={() => {
                  setShowRemoveProviderModal(true);
                }}
              >
                Remove
              </button>
            </div>
          </>
        )}
      {showProvidersList && (
        <>
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
            Choose a provider
          </h2>
          <p>Your address on file:</p>
          <ResidentialAddress address={address} />
          {loadingProviders && (
            <div className="vads-u-padding-bottom--2">
              <LoadingIndicator message="Loading the list of providers" />
            </div>
          )}
          {requestStatus === FETCH_STATUS.failed && (
            <div className="vads-u-padding-bottom--2">
              <ErrorMessage />
            </div>
          )}
          {requestStatus === FETCH_STATUS.succeeded && (
            <>
              <p>
                Displaying 1 to {currentlyShownProvidersList.length} of{' '}
                {communityCareProviderList.length} providers
              </p>
              {currentlyShownProvidersList.map(provider => {
                const { name, position } = provider;
                const checked = provider.id === checkedProvider;
                const distance = distanceBetween(
                  position.latitude,
                  position.longitude,
                  address.latitude,
                  address.longitude,
                );
                return (
                  <div className="form-radio-buttons" key={provider.id}>
                    <input
                      type="radio"
                      checked={checked}
                      id={`${idSchema.$id}_${provider.id}`}
                      name={`${idSchema.$id}`}
                      value={provider.id}
                      onChange={_ => setCheckedProvider(provider.id)}
                      disabled={loadingProviders}
                    />
                    <label htmlFor={`${idSchema.$id}_${provider.id}`}>
                      <span className="vads-u-display--block vads-u-font-weight--bold">
                        {name}
                      </span>
                      <span className="vads-u-display--block">
                        {provider.address?.line}
                      </span>
                      <span className="vads-u-display--block">
                        {provider.address.city}, {provider.address.state}{' '}
                        {provider.address.postalCode}
                      </span>
                      <span className="vads-u-display--block vads-u-font-size--sm vads-u-font-weight--bold">
                        {distance} miles
                      </span>
                    </label>
                    {checked && (
                      <button
                        type="button"
                        onClick={() => {
                          onChange(
                            communityCareProviderList.find(
                              p => p.id === checkedProvider,
                            ),
                          );
                          setCheckedProvider();
                          setShowProvidersList(false);
                        }}
                      >
                        Choose provider
                      </button>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
      {requestStatus === FETCH_STATUS.succeeded &&
        showProvidersList && (
          <div className="vads-u-display--flex">
            {providersListLength < communityCareProviderList.length && (
              <>
                <button
                  type="button"
                  className="additional-info-button va-button-link vads-u-display--block vads-u-margin-right--2"
                  onClick={() =>
                    setProvidersListLength(providersListLength + 5)
                  }
                >
                  <span className="additional-info-title">
                    +{' '}
                    {Math.min(
                      communityCareProviderList.length - providersListLength,
                      INITIAL_PROVIDER_DISPLAY_COUNT,
                    )}{' '}
                    more providers
                    <i className="fas fa-angle-down vads-u-padding-right--0p5" />
                  </span>
                </button>
              </>
            )}
            <button
              type="button"
              className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
              onClick={() => {
                setProvidersListLength(INITIAL_PROVIDER_DISPLAY_COUNT);
                setShowProvidersList(false);
              }}
              aria-label="Cancel choosing a provider"
            >
              Cancel
            </button>
          </div>
        )}
      {showRemoveProviderModal && (
        <RemoveProviderModal
          provider={formData}
          address={address}
          onClose={response => {
            setShowRemoveProviderModal(false);
            if (response === true) {
              setCheckedProvider(false);
              onChange({});
            }
          }}
        />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return selectProviderSelectionInfo(state);
}

const mapDispatchToProps = {
  requestProvidersList: actions.requestProvidersList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProviderSelectionField);
