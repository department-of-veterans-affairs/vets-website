import React, { useMemo, useState } from 'react';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import { fetchMapBoxGeocoding } from '../../actions/fetchMapBoxGeocoding';
import { fetchFacilities } from '../../actions/fetchFacilities';
import FacilityList from './FacilityList';
import { replaceStrValues } from '../../utils/helpers';
import content from '../../locales/en/content.json';

const FacilitySearch = props => {
  const { data: formData, goBack, goForward, goToPath } = props;
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMoreFacilities, setLoadingMoreFacilities] = useState(false);
  const [searchInputError, setSearchInputError] = useState(null);
  const [facilitiesListError, setFacilitiesListError] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [newFacilitiesCount, setNewFacilitiesCount] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalEntries: 0,
  });
  const dispatch = useDispatch();
  const [coordinates, setCoordinates] = useState({ lat: '', long: '' });
  const radius = 500;

  const hasFacilities = () => {
    return facilities?.length > 0;
  };

  const hasMoreFacilities = () => {
    return facilities?.length < pagination.totalEntries;
  };

  const ariaLiveMessage = () => {
    if (newFacilitiesCount === 0) return '';

    const newFacilitiesLoadedText =
      newFacilitiesCount === 1
        ? content['facilities-aria-live-message-single']
        : replaceStrValues(
            content['facilities-aria-live-message-multiple'],
            newFacilitiesCount,
          );

    const totalFacilitiesLoadedText = replaceStrValues(
      content['facilities-aria-live-message-total'],
      facilities?.length,
    );

    return `${newFacilitiesLoadedText} ${totalFacilitiesLoadedText}`;
  };

  const isReviewPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('review') === 'true';
  };

  const isCaregiverFacility = () => {
    const plannedClinic = formData?.['view:plannedClinic'];
    return (
      plannedClinic?.veteranSelected?.id === plannedClinic?.caregiverSupport?.id
    );
  };

  const reviewPageGoToPath = () => {
    if (isCaregiverFacility()) {
      goToPath('/review-and-submit');
    } else {
      goToPath('/veteran-information/va-medical-center/confirm?review=true');
    }
  };

  const onGoBack = () => {
    if (isReviewPage()) {
      goToPath('/review-and-submit');
    } else {
      goBack(formData);
    }
  };

  const onGoForward = () => {
    const caregiverSupportFacilityId =
      formData?.['view:plannedClinic']?.caregiverSupport?.id;
    if (!caregiverSupportFacilityId) {
      if (!query.trim()) {
        setSearchInputError(content['validation-facilities--search-required']);
      } else if (hasFacilities()) {
        setFacilitiesListError(
          content['validation-facilities--default-required'],
        );
      } else {
        setSearchInputError(
          content['validation-facilities--submit-search-required'],
        );
      }
    } else if (isReviewPage()) {
      reviewPageGoToPath();
    } else {
      goForward(formData);
    }
  };

  const offersCaregiverSupport = facility => {
    return facility.services?.health?.some(
      service => service.serviceId === 'caregiverSupport',
    );
  };

  const facilityListProps = useMemo(
    () => {
      const caregiverSupport = async facility => {
        const selectedOffersCaregiverSupport = offersCaregiverSupport(facility);

        // If selected facility offers caregiver support return it
        if (selectedOffersCaregiverSupport) {
          return facility;
        }

        // Check if selected facility's parent exists in the facilities array already
        const loadedParent = facilities.find(
          entry => entry.id === facility.parent.id,
        );

        if (loadedParent) {
          // If parent facility offers caregiver services return it
          if (offersCaregiverSupport(loadedParent)) {
            return loadedParent;
          }

          // Display error if selected facility and selected facility's parent facility do not offer caregiver services
          setSearchInputError(content['error--facilities-parent-facility']);
          return null;
        }

        // Log facility parent.id so we can troubleshoot if we are always sending the expected value
        Sentry.withScope(scope => {
          scope.setLevel(Sentry.Severity.Log);
          scope.setExtra('facility', facility);
          scope.setExtra('facility.parent.id', facility?.parent?.id);
          Sentry.captureMessage('FetchFacilities parentId');
        });

        // Fetch parent facility from api if we have the id and it is not in the facilities list already
        const parentFacilityResponse = await fetchFacilities({
          facilityIds: [facility.parent.id],
          // services: ['caregiverSupport'],
        });

        if (parentFacilityResponse.errorMessage) {
          setSearchInputError(parentFacilityResponse.errorMessage);
          return null;
        }

        const parentFacility = parentFacilityResponse.facilities[0];

        // Display error if selected facility and selected facility's parent facility do not offer caregiver services
        if (!offersCaregiverSupport(parentFacility)) {
          setSearchInputError(content['error--facilities-parent-facility']);
          return null;
        }

        // If parent facility offers caregiver services return it
        return parentFacility;
      };

      const setSelectedFacilities = async facilityId => {
        setFacilitiesListError(null);
        setSearchInputError(null);
        const facility = facilities.find(f => f.id === facilityId);
        const caregiverSupportFacility = await caregiverSupport(facility);
        dispatch(
          setData({
            ...formData,
            'view:plannedClinic': {
              veteranSelected: facility,
              caregiverSupport: caregiverSupportFacility,
            },
          }),
        );
      };

      return {
        ...props,
        value: formData?.['view:plannedClinic']?.veteranSelected?.id,
        onChange: setSelectedFacilities,
        facilities,
        query: submittedQuery,
        error: facilitiesListError,
      };
    },
    [
      facilities,
      submittedQuery,
      props,
      dispatch,
      formData,
      facilitiesListError,
    ],
  );

  const handleChange = e => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchInputError(content['validation-facilities--search-required']);
      return;
    }

    setLoading(true);
    setFacilitiesListError(null);
    setSearchInputError(null);
    setFacilities([]);

    const mapboxResponse = await fetchMapBoxGeocoding(query);
    if (mapboxResponse.errorMessage) {
      setSearchInputError(mapboxResponse.errorMessage);
      setLoading(false);
      return;
    }

    const [longitude, latitude] = mapboxResponse.center;
    setCoordinates({ long: longitude, lat: latitude });

    const facilitiesResponse = await fetchFacilities({
      long: longitude,
      lat: latitude,
      radius,
      perPage: 5,
      page: 1,
    });

    if (facilitiesResponse.errorMessage) {
      setSearchInputError(facilitiesResponse.errorMessage);
      setLoading(false);
      return;
    }

    setFacilities(facilitiesResponse.facilities);
    setPagination(facilitiesResponse.meta.pagination);
    setSubmittedQuery(query);
    setLoading(false);
    focusElement('#caregiver_facility_results');
  };

  const showMoreFacilities = async e => {
    e.preventDefault();
    setNewFacilitiesCount(0);
    setLoadingMoreFacilities(true);
    const facilitiesResponse = await fetchFacilities({
      ...coordinates,
      page: pagination.currentPage + 1,
      radius,
      perPage: 5,
    });

    if (facilitiesResponse.errorMessage) {
      setSearchInputError(facilitiesResponse.errorMessage);
      setLoadingMoreFacilities(false);
      return;
    }

    setFacilities([...facilities, ...facilitiesResponse.facilities]);
    setNewFacilitiesCount(facilitiesResponse.facilities.length);
    setPagination(facilitiesResponse.meta.pagination);
    setSubmittedQuery(query);
    setLoadingMoreFacilities(false);
  };

  const loader = () => {
    return (
      <va-loading-indicator
        label={content['app-loading-generic-text']}
        message={content['facilities-loading-text']}
        set-focus
      />
    );
  };

  const searchResults = () => {
    if (loading) {
      return loader();
    }
    if (hasFacilities()) {
      return (
        <>
          <FacilityList {...facilityListProps} />
          <div
            aria-live="polite"
            role="status"
            className="vads-u-visibility--screen-reader"
          >
            {ariaLiveMessage()}
          </div>
          {loadingMoreFacilities && loader()}
          {hasMoreFacilities() && (
            <va-button
              text={content['form-facilities-load-more-button']}
              onClick={showMoreFacilities}
              secondary
            />
          )}
        </>
      );
    }

    return null;
  };

  const searchError = () => {
    return (
      <span
        className="usa-input-error-message vads-u-margin-bottom--0p5"
        role="alert"
      >
        <span className="sr-only">Error</span>
        {searchInputError}
      </span>
    );
  };

  return (
    <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
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
              searchInputError ? 'caregiver-facilities-search-input-error' : ''
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
            {searchInputError && searchError()}
            <VaSearchInput
              label={`${content['form-facilities-search-label']} ${
                content['validation-required-label']
              }`}
              value={query}
              onInput={handleChange}
              onSubmit={handleSearch}
              uswds
            />
          </div>
        </va-card>

        {searchResults()}
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
  value: PropTypes.string,
};

export default FacilitySearch;
