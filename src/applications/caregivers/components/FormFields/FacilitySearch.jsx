import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import { fetchMapBoxGeocoding } from '../../actions/fetchMapBoxGeocoding';
import { fetchFacilities } from '../../actions/fetchFacilities';
import { replaceStrValues } from '../../utils/helpers';
import FacilityList from './FacilityList';
import content from '../../locales/en/content.json';
import SelectedFacilityInfoAlert from '../FormAlerts/SelectedFacilityInfoAlert';
import VaSearchInputAdapter from './VaSearchInputAdapter';

// declare page paths for review mode
export const REVIEW_PATHS = {
  reviewAndSubmit: '/review-and-submit',
  confirmFacility: '/veteran-information/va-medical-center/confirm?review=true',
};

const FacilitySearch = props => {
  const { data: formData, goBack, goForward, goToPath } = props;
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [localState, setLocalState] = useState({
    loading: false,
    loadingMore: false,
    searchError: null,
    listError: null,
    facilities: [],
    additionalFacilitiesCount: 0,
    pagination: { currentPage: 0, totalEntries: 0 },
    coordinates: { lat: '', long: '' },
  });
  const vaSearchInputRef = useRef(null);
  const hasFacilities = localState.facilities.length > 0;
  const hasMoreFacilities =
    localState.facilities.length < localState.pagination.totalEntries;

  const isReviewMode = useMemo(
    () => new URLSearchParams(window.location.search).get('review') === 'true',
    [],
  );

  const plannedClinic = formData?.['view:plannedClinic'];
  const [showFacilityInfoAlert, setShowFacilityInfoAlert] = useState(true);

  const goToReviewPath = useCallback(() => {
    const hasSupportServices =
      plannedClinic?.veteranSelected?.id ===
      plannedClinic?.caregiverSupport?.id;
    goToPath(
      hasSupportServices
        ? REVIEW_PATHS.reviewAndSubmit
        : REVIEW_PATHS.confirmFacility,
    );
  }, [
    plannedClinic?.veteranSelected,
    plannedClinic?.caregiverSupport,
    goToPath,
  ]);

  const onGoBack = useCallback(
    () =>
      isReviewMode ? goToPath(REVIEW_PATHS.reviewAndSubmit) : goBack(formData),
    [formData, goBack, goToPath, isReviewMode],
  );

  const onGoForward = useCallback(() => {
    const caregiverSupportFacilityId = plannedClinic?.caregiverSupport?.id;

    // ensure no errors are present before navigating, to include:
    // lack of search query & lack of selected record after search
    if (!caregiverSupportFacilityId) {
      if (!query.trim()) {
        return setLocalState(prev => ({
          ...prev,
          searchError: content['validation-facilities--search-required'],
        }));
      }

      if (hasFacilities) {
        return setLocalState(prev => ({
          ...prev,
          listError: content['validation-facilities--default-required'],
        }));
      }

      return setLocalState(prev => ({
        ...prev,
        searchError: content['validation-facilities--submit-search-required'],
      }));
    }

    // proceed with navigating forward based on review mode
    return isReviewMode ? goToReviewPath() : goForward(formData);
  }, [
    formData,
    goForward,
    goToReviewPath,
    hasFacilities,
    isReviewMode,
    query,
    plannedClinic?.caregiverSupport,
  ]);

  const handleChange = useCallback(e => setQuery(e.target.value), []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      return setLocalState(prev => ({
        ...prev,
        searchError: content['validation-facilities--search-required'],
      }));
    }

    // reset state for new search
    setLocalState(prev => ({
      ...prev,
      loading: true,
      facilities: [],
      listError: null,
      searchError: null,
    }));

    // fetch & set mapbox coordinates for facilities query
    const mboxResponse = await fetchMapBoxGeocoding(query);
    if (mboxResponse.errorMessage) {
      return setLocalState(prev => ({
        ...prev,
        searchError: mboxResponse.errorMessage,
        loading: false,
      }));
    }

    const [longitude, latitude] = mboxResponse.center;
    setLocalState(prev => ({
      ...prev,
      coordinates: { long: longitude, lat: latitude },
    }));

    // fetch & set facility list
    const fetchResponse = await fetchFacilities({
      long: longitude,
      lat: latitude,
      page: 1,
    });
    if (fetchResponse.errorMessage) {
      return setLocalState(prev => ({
        ...prev,
        searchError: fetchResponse.errorMessage,
        loading: false,
      }));
    }

    setSubmittedQuery(query);
    setLocalState(prev => ({
      ...prev,
      loading: false,
      facilities: fetchResponse.facilities,
      pagination: fetchResponse.meta.pagination,
    }));
    return focusElement('#caregiver_facility_results');
  }, [query]);

  const handleShowMore = useCallback(
    async e => {
      e.preventDefault();

      // reset state for search
      setLocalState(prev => ({
        ...prev,
        additionalFacilitiesCount: 0,
        loadingMore: true,
      }));

      // fetch & set additional facility records
      const response = await fetchFacilities({
        ...localState.coordinates,
        page: localState.pagination.currentPage + 1,
      });
      return response.errorMessage
        ? setLocalState(prev => ({
            ...prev,
            loadingMore: false,
            searchError: response.errorMessage,
          }))
        : setLocalState(prev => ({
            ...prev,
            loadingMore: false,
            facilities: [...prev.facilities, ...response.facilities],
            additionalFacilitiesCount: response.facilities.length,
            pagination: response.meta.pagination,
          }));
    },
    [localState.coordinates, localState.pagination.currentPage],
  );

  const fetchParentFacility = useCallback(
    async selectedFacility => {
      const hasSupportServices = f =>
        f.services?.health?.some(s => s.serviceId === 'caregiverSupport');

      if (hasSupportServices(selectedFacility)) return selectedFacility;

      // if selected facility's parent exists in the current list, return it if support services are offered
      const loadedParent = localState.facilities.find(
        f => f.id === selectedFacility.parent.id,
      );
      if (loadedParent) {
        if (hasSupportServices(loadedParent)) return loadedParent;
        window.DD_LOGS?.logger.warn(
          'DATA ERROR: Selected facility has no valid parent with Caregiver services',
          { facilityId: loadedParent.id },
        );
        return setLocalState(prev => ({
          ...prev,
          listError: content['error--facilities-parent-facility'],
        }));
      }

      // fetch  & return parent facility if it doesn't exist in the current list
      const response = await fetchFacilities({
        facilityIds: [selectedFacility.parent.id],
      });
      if (response.errorMessage) {
        return setLocalState(prev => ({
          ...prev,
          searchError: response.errorMessage,
        }));
      }

      const fetchedParent = response.facilities[0];

      // check if both the selected and the parent facilities do not offer support services
      if (!hasSupportServices(fetchedParent)) {
        window.DD_LOGS?.logger.warn(
          'DATA ERROR: Selected facility has no valid parent with Caregiver services',
          { facilityId: fetchedParent.id },
        );
        return setLocalState(prev => ({
          ...prev,
          listError: content['error--facilities-parent-facility'],
        }));
      }

      return fetchedParent;
    },
    [localState.facilities],
  );

  const ariaLiveMessage = useMemo(() => {
    if (localState.additionalFacilitiesCount === 0) return '';

    const addtlFacilitiesLoadedText =
      localState.additionalFacilitiesCount === 1
        ? content['facilities-aria-live-message-single']
        : replaceStrValues(
            content['facilities-aria-live-message-multiple'],
            localState.additionalFacilitiesCount,
          );

    const totalFacilitiesLoadedText = replaceStrValues(
      content['facilities-aria-live-message-total'],
      localState.facilities?.length,
    );

    return `${addtlFacilitiesLoadedText} ${totalFacilitiesLoadedText}`;
  }, [localState.additionalFacilitiesCount, localState.facilities]);

  const facilityListProps = useMemo(
    () => ({
      ...props,
      query: submittedQuery,
      error: localState.listError,
      facilities: localState.facilities,
      value: plannedClinic?.veteranSelected?.id,
      onChange: async facilityId => {
        setLocalState(prev => ({
          ...prev,
          searchError: null,
          listError: null,
        }));
        const selectedFacility = localState.facilities.find(
          f => f.id === facilityId,
        );
        const parentFacility = await fetchParentFacility(selectedFacility);
        setShowFacilityInfoAlert(false);
        dispatch(
          setData({
            ...formData,
            'view:plannedClinic': {
              veteranSelected: selectedFacility,
              caregiverSupport: parentFacility,
            },
          }),
        );
      },
    }),
    [
      dispatch,
      fetchParentFacility,
      formData,
      localState.facilities,
      localState.listError,
      props,
      submittedQuery,
      plannedClinic?.veteranSelected,
    ],
  );

  const loader = useMemo(
    () => (
      <va-loading-indicator
        label={content['app-loading-generic-text']}
        message={content['facilities-loading-text']}
        set-focus
      />
    ),
    [],
  );

  const searchResults = useMemo(() => {
    if (localState.loading) return loader;

    return hasFacilities ? (
      <>
        <FacilityList {...facilityListProps} />
        <div
          aria-live="polite"
          role="status"
          className="vads-u-visibility--screen-reader"
        >
          {ariaLiveMessage}
        </div>
        {localState.loadingMore && loader}
        {hasMoreFacilities && (
          <va-button
            text={content['form-facilities-load-more-button']}
            onClick={handleShowMore}
            secondary
          />
        )}
      </>
    ) : null;
  }, [
    ariaLiveMessage,
    facilityListProps,
    handleShowMore,
    hasFacilities,
    hasMoreFacilities,
    loader,
    localState.loading,
    localState.loadingMore,
  ]);

  const searchError = useMemo(
    () => (
      <span
        className="usa-input-error-message vads-u-margin-bottom--0p5"
        role="alert"
      >
        <span className="sr-only">Error</span>
        {localState.searchError}
      </span>
    ),
    [localState.searchError],
  );

  const shouldDisplayFacilityAlert = useMemo(() => {
    return plannedClinic?.veteranSelected && showFacilityInfoAlert;
  }, [plannedClinic?.veteranSelected, showFacilityInfoAlert]);

  return (
    <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
      {shouldDisplayFacilityAlert && (
        <SelectedFacilityInfoAlert facility={plannedClinic?.veteranSelected} />
      )}
      <div className="vads-u-margin-y--2 form-panel">
        <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
          {content['vet-med-center-search-description']}
        </h3>
        <p>
          You’ll need to find and select the VA medical center or clinic where
          the Veteran receives or plans to receive care.
        </p>
        <p>
          The VA medical center or clinic may be in a different city, state, or
          postal code than the Veteran’s home address.
        </p>
        <va-card background>
          <p className="vads-u-margin-top--0">
            Enter a city, state, or postal code. Then select{' '}
            <strong>Search</strong> to find a VA medical center or clinic.
          </p>
          <div
            className={`${
              localState.searchError &&
              'caregiver-facilities-search-input-error'
            }`}
          >
            <p
              className="vads-u-margin-top--0 vads-u-margin-bottom--1"
              aria-hidden="true"
            >
              {content['form-facilities-search-label']}{' '}
              <span className="vads-u-color--secondary-dark">
                {content['validation-required-label']}
              </span>
            </p>
            {localState.searchError && searchError}
            <VaSearchInputAdapter
              ref={vaSearchInputRef}
              label={`${content['form-facilities-search-label']} ${content['validation-required-label']}`}
              value={query}
              onInput={handleChange}
              onSubmit={handleSearch}
            />
          </div>
        </va-card>

        {searchResults}
        <p>
          <strong>Note:</strong> We use the location of the Veteran’s health
          care facility to find the nearest facility that processes
          applications. Only some facilities process caregiver program
          applications.
        </p>
        <FormNavButtons goBack={onGoBack} goForward={onGoForward} />
      </div>
    </div>
  );
};

FacilitySearch.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
};

export default FacilitySearch;
