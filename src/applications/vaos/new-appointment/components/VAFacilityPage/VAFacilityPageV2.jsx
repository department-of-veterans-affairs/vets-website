import React, { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { usePrevious } from 'platform/utilities/react-hooks';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getFacilityPageV2Info } from '../../redux/selectors';
import { FETCH_STATUS, GA_PREFIX } from '../../../utils/constants';
import EligibilityModal from './EligibilityModal';
import InfoAlert from '../../../components/InfoAlert';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
import FormButtons from '../../../components/FormButtons';
import NoValidVAFacilities from './NoValidVAFacilitiesV2';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
import FacilitiesNotShown from './FacilitiesNotShown';
import SingleFacilityAvailable from './SingleFacilityAvailable';
import { lowerCase } from '../../../utils/formatters';
import {
  openFacilityPageV2,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFacilitySortMethod,
  updateFormData,
  hideEligibilityModal,
} from '../../redux/actions';
import { getPageTitle } from '../../newAppointmentFlow';
import {
  selectFeatureRecentLocationsFilter,
  selectFeatureRemoveFacilityConfigCheck,
} from '../../../redux/selectors';

const initialSchema = {
  type: 'object',
  required: ['vaFacility'],
  properties: {
    vaFacility: {
      type: 'string',
      enum: [],
    },
  },
};

const pageKey = 'vaFacilityV2';

export default function VAFacilityPageV2() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));
  const featureRecentLocationsFilter = useSelector(state =>
    selectFeatureRecentLocationsFilter(state),
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const {
    address,
    canScheduleAtChosenFacility,
    childFacilitiesStatus,
    data,
    eligibility,
    facilities,
    hasDataFetchingError,
    loadingEligibilityStatus,
    noValidVAFacilities,
    pageChangeInProgress,
    requestLocationStatus,
    schema,
    selectedFacility,
    showEligibilityModal,
    singleValidVALocation,
    sortMethod,
    typeOfCare,
    fetchRecentLocationStatus,
  } = useSelector(state => getFacilityPageV2Info(state), shallowEqual);
  const featureRemoveFacilityConfigCheck = useSelector(
    selectFeatureRemoveFacilityConfigCheck,
  );

  const sortOptions = useMemo(
    () => {
      const options = [
        {
          value: 'distanceFromResidentialAddress',
          label: 'Closest to your home',
        },
        {
          value: 'distanceFromCurrentLocation',
          label: 'Closest to your current location',
        },
        { value: 'alphabetical', label: 'Alphabetically' },
      ];
      if (featureRecentLocationsFilter) {
        // Add recentLocations to the top of the list
        return [
          {
            value: 'recentLocations',
            label: 'By recent locations',
          },
          ...options,
        ];
      }
      return options;
    },
    [featureRecentLocationsFilter],
  );

  const uiSchema = {
    vaFacility: {
      'ui:title': `These are the facilities you’re registered at that offer ${lowerCase(
        typeOfCare?.name,
      )}.`,
      'ui:widget': FacilitiesRadioWidget,
    },
  };

  const loadingEligibility = loadingEligibilityStatus === FETCH_STATUS.loading;
  const requestingLocation = requestLocationStatus === FETCH_STATUS.loading;
  const loadingFacilities =
    childFacilitiesStatus === FETCH_STATUS.loading ||
    childFacilitiesStatus === FETCH_STATUS.notStarted ||
    (featureRecentLocationsFilter &&
      fetchRecentLocationStatus === FETCH_STATUS.loading);

  const isLoading =
    loadingFacilities || (singleValidVALocation && loadingEligibility);
  const sortFocusEl = 'select';
  const hasUserAddress = address && !!Object.keys(address).length;

  useEffect(() => {
    dispatch(openFacilityPageV2(pageKey, uiSchema, initialSchema));
  }, []);

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
    },
    [isLoading],
  );

  const previouslyShowingModal = usePrevious(showEligibilityModal);
  useEffect(
    () => {
      if (!showEligibilityModal && previouslyShowingModal) {
        scrollAndFocus('.usa-button-primary');
      }
    },
    [showEligibilityModal, previouslyShowingModal],
  );

  useEffect(
    () => {
      if (requestingLocation) {
        scrollAndFocus('.loading-indicator');
      } else if (requestLocationStatus === FETCH_STATUS.failed) {
        scrollAndFocus('va-alert');
      } else {
        scrollAndFocus(sortFocusEl);
      }
    },
    [requestingLocation, requestLocationStatus, sortFocusEl],
  );

  const pageHeader = (
    <h1 className="vaos__dynamic-font-size--h2">
      {pageTitle}
      <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-weight--normal">
        (*Required)
      </span>
    </h1>
  );

  if (hasDataFetchingError) {
    return (
      <div>
        {pageHeader}
        <InfoAlert
          addRole="alert"
          status="error"
          level={2}
          headline="We can’t schedule your appointment right now"
        >
          <p>
            We’re sorry. There’s a problem with our system. Refresh this page to
            start over or try again later.
          </p>
          <p>
            If you need to schedule now, call your VA facility.
            <br />
            <a href="/find-locations">Find your VA health facility</a>
          </p>
        </InfoAlert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <va-loading-indicator
        role="alert"
        set-focus
        label="Finding available locations for your appointment"
        message="Finding available locations for your appointment..."
      />
    );
  }
  if (loadingEligibility) {
    return (
      <va-loading-indicator
        set-focus
        label="We’re checking if we can create an appointment for you at this facility. This may take up to a minute."
        message="We’re checking if we can create an appointment for you at this facility. This may take up to a minute."
      />
    );
  }

  if (!featureRemoveFacilityConfigCheck && noValidVAFacilities) {
    return (
      <div>
        {pageHeader}
        <NoValidVAFacilities
          address={address}
          facilities={facilities}
          sortMethod={sortMethod}
          typeOfCare={typeOfCare}
        />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey))
            }
            disabled
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
            displayNextButton={false}
          />
        </div>
      </div>
    );
  }

  if (singleValidVALocation && !canScheduleAtChosenFacility && !!eligibility) {
    return (
      <div>
        {pageHeader}
        <SingleFacilityEligibilityCheckMessage
          eligibility={eligibility}
          facility={selectedFacility}
          typeOfCare={typeOfCare}
          typeOfCareName={typeOfCare?.name}
        />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey))
            }
            disabled
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
            displayNextButton={false}
          />
        </div>
      </div>
    );
  }

  if (singleValidVALocation) {
    return (
      <div>
        {pageHeader}
        <SingleFacilityAvailable
          facility={selectedFacility}
          sortMethod={sortMethod}
          typeOfCareName={typeOfCare.name}
        />
        <FacilitiesNotShown />
        <FormButtons
          onBack={() =>
            dispatch(routeToPreviousAppointmentPage(history, pageKey))
          }
          onSubmit={() =>
            dispatch(routeToNextAppointmentPage(history, pageKey))
          }
          pageChangeInProgress={pageChangeInProgress}
          loadingText="Page change in progress"
        />
      </div>
    );
  }

  return (
    <div>
      {pageHeader}
      {requestingLocation && (
        <div className="vads-u-padding-bottom--2">
          <va-loading-indicator
            set-focus
            label="Finding your location. Be sure to allow your browser to find your current location."
            message="Finding your location. Be sure to allow your browser to find your current location."
          />
        </div>
      )}
      {childFacilitiesStatus === FETCH_STATUS.succeeded &&
        !requestingLocation && (
          <SchemaForm
            name="VA Facility"
            title="VA Facility"
            schema={schema}
            uiSchema={uiSchema}
            onChange={newData =>
              dispatch(updateFormData(pageKey, uiSchema, newData))
            }
            onSubmit={() => {
              dispatch(routeToNextAppointmentPage(history, pageKey));
            }}
            formContext={{
              hasUserAddress,
              sortOptions,
              updateFacilitySortMethod: value =>
                dispatch(updateFacilitySortMethod(value, uiSchema)).then(
                  recordEvent({
                    event: `${GA_PREFIX}-updated-locations-sort--${
                      sortOptions.find(option => option.value === value)?.label
                    }`,
                  }),
                ),
            }}
            data={data}
          >
            <FacilitiesNotShown />
            <FormButtons
              continueLabel=""
              pageChangeInProgress={pageChangeInProgress}
              onBack={() =>
                dispatch(routeToPreviousAppointmentPage(history, pageKey))
              }
              disabled={
                loadingFacilities ||
                loadingEligibility ||
                (schema.properties.vaFacility.enum?.length === 1 &&
                  !canScheduleAtChosenFacility)
              }
            />
          </SchemaForm>
        )}

      {showEligibilityModal && (
        <EligibilityModal
          onClose={() => dispatch(hideEligibilityModal())}
          eligibility={eligibility}
          facilityDetails={selectedFacility}
          typeOfCare={typeOfCare}
        />
      )}
    </div>
  );
}
