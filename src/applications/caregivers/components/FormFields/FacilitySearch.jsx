import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import { fetchMapBoxGeocoding } from '../../actions/fetchMapBoxGeocoding';
import { fetchFacilities } from '../../actions/fetchFacilities';
import FacilityList from './FacilityList';
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
  const [pages, setPages] = useState(1);
  const dispatch = useDispatch();
  const [coordinates, setCoordinates] = useState({ lat: '', long: '' });
  const radius = 500;

  const hasFacilities = () => {
    return facilities?.length > 0;
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
      if (hasFacilities()) {
        setFacilitiesListError(
          content['validation-facilities--default-required'],
        );
      } else {
        setSearchInputError(content['validation-facilities--default-required']);
      }
    } else if (isReviewPage()) {
      reviewPageGoToPath();
    } else {
      goForward(formData);
    }
  };

  const facilityListProps = useMemo(
    () => {
      const caregiverSupport = async facility => {
        const offersCaregiverSupport = facility.services?.health?.some(
          service => service.serviceId === 'caregiverSupport',
        );

        if (offersCaregiverSupport) {
          return facility;
        }

        const loadedParent = facilities.find(
          entry => entry.id === facility.parent.id,
        );
        if (loadedParent) {
          return loadedParent;
        }

        const parentFacilityResponse = await fetchFacilities({
          facilityIds: [facility.parent.id],
        });

        if (parentFacilityResponse.errorMessage) {
          setSearchInputError(parentFacilityResponse.errorMessage);
          return null;
        }

        return parentFacilityResponse[0];
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

    setFacilities(facilitiesResponse);
    setSubmittedQuery(query);
    setLoading(false);
    setPages(1);
    focusElement('#caregiver_facility_results');
  };

  const showMoreFacilities = async e => {
    e.preventDefault();
    setLoadingMoreFacilities(true);
    const facilitiesResponse = await fetchFacilities({
      ...coordinates,
      page: pages + 1,
      radius,
      perPage: 5,
    });

    if (facilitiesResponse.errorMessage) {
      setSearchInputError(facilitiesResponse.errorMessage);
      setLoadingMoreFacilities(false);
      return;
    }

    setFacilities([...facilities, ...facilitiesResponse]);
    setSubmittedQuery(query);
    setLoadingMoreFacilities(false);
    setPages(pages + 1);
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
          {loadingMoreFacilities && loader()}
          <button
            type="button"
            className="va-button-link"
            onClick={showMoreFacilities}
          >
            Load more facilities
          </button>
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
          Where the VA medical center is located may be different from the
          Veteran’s home address.
        </p>
        <va-card role="search" background>
          <div
            className={`${
              searchInputError ? 'caregiver-facilities-search-input-error' : ''
            }`}
          >
            <label
              htmlFor="facility-search"
              className="vads-u-margin-top--0 vads-u-margin-bottom--1"
            >
              {content['form-facilities-search-label']}
              <span className="vads-u-color--secondary-dark"> (*Required)</span>
            </label>
            {searchInputError && searchError()}
            <VaSearchInput
              label={content['form-facilities-search-label']}
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
