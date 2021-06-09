import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { usePrevious } from 'platform/utilities/react-hooks';

import { getFacilityPageV2Info } from '../../redux/selectors';
import { FETCH_STATUS, FACILITY_SORT_METHODS } from '../../../utils/constants';
import EligibilityModal from './EligibilityModal';
import ErrorMessage from '../../../components/ErrorMessage';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
import FormButtons from '../../../components/FormButtons';
import NoValidVAFacilities from './NoValidVAFacilitiesV2';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
import ResidentialAddress from './ResidentialAddress';
import LoadingOverlay from '../../../components/LoadingOverlay';
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
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

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

const uiSchema = {
  vaFacility: {
    'ui:title': 'Please select where you’d like to have your appointment.',
    'ui:widget': FacilitiesRadioWidget,
  },
};

const pageKey = 'vaFacilityV2';

export default function VAFacilityPageV2() {
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
  } = useSelector(state => getFacilityPageV2Info(state), shallowEqual);
  const loadingEligibility = loadingEligibilityStatus === FETCH_STATUS.loading;
  const loadingFacilities =
    childFacilitiesStatus === FETCH_STATUS.loading ||
    childFacilitiesStatus === FETCH_STATUS.notStarted;
  const pageTitle = singleValidVALocation
    ? 'Your appointment location'
    : `Choose a VA location for your ${lowerCase(
        typeOfCare?.name,
      )} appointment`;
  const isLoading =
    loadingFacilities || (singleValidVALocation && loadingEligibility);

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      dispatch(openFacilityPageV2(pageKey, uiSchema, initialSchema));
    },
    [openFacilityPageV2],
  );

  useEffect(
    () => {
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

  const pageHeader = <h1 className="vads-u-font-size--h2">{pageTitle}</h1>;

  if (hasDataFetchingError) {
    return (
      <div>
        {pageHeader}
        <ErrorMessage level="2" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingIndicator message="Finding available locations for your appointment..." />
    );
  }

  if (noValidVAFacilities) {
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
        <FacilitiesNotShown
          facilities={facilities}
          sortMethod={sortMethod}
          typeOfCareId={typeOfCare?.id}
        />
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

  const sortByDistanceFromResidential =
    sortMethod === FACILITY_SORT_METHODS.distanceFromResidential;

  const sortByDistanceFromCurrentLocation =
    sortMethod === FACILITY_SORT_METHODS.distanceFromCurrentLocation;

  const requestingLocation = requestLocationStatus === FETCH_STATUS.loading;

  return (
    <div>
      {pageHeader}
      <p>
        Below is a list of VA locations where you’re registered that offer{' '}
        {typeOfCare?.name} appointments.
        {(sortByDistanceFromResidential || sortByDistanceFromCurrentLocation) &&
          ' Locations closest to you are at the top of the list.'}
      </p>
      {sortByDistanceFromResidential &&
        !requestingLocation && (
          <>
            <ResidentialAddress address={address} />
            {requestLocationStatus !== FETCH_STATUS.failed && (
              <p>
                Or,{' '}
                <button
                  className="va-button-link"
                  onClick={() => {
                    dispatch(
                      updateFacilitySortMethod(
                        FACILITY_SORT_METHODS.distanceFromCurrentLocation,
                        uiSchema,
                      ),
                    );
                  }}
                >
                  use your current location
                </button>
              </p>
            )}
          </>
        )}
      {sortByDistanceFromCurrentLocation &&
        !requestingLocation && (
          <>
            <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
              Facilities based on your location
            </h2>
            <p>
              Or,{' '}
              <button
                className="va-button-link"
                onClick={() => {
                  dispatch(
                    updateFacilitySortMethod(
                      FACILITY_SORT_METHODS.distanceFromResidential,
                      uiSchema,
                    ),
                  );
                }}
              >
                use your home address on file
              </button>
            </p>
          </>
        )}
      {requestLocationStatus === FETCH_STATUS.failed && (
        <div className="vads-u-padding-bottom--3">
          <AlertBox
            status="warning"
            headline="Your browser is blocked from finding your current location."
            className="vads-u-background-color--gold-lightest vads-u-font-size--base"
            level="3"
            content={
              <p>
                Make sure your browser’s location feature is turned on. If it
                isn’t enabled, we’ll sort your VA facilities using your home
                address that’s on file.
              </p>
            }
          />
        </div>
      )}
      {requestingLocation && (
        <div className="vads-u-padding-bottom--2">
          <LoadingIndicator message="Finding your location. Be sure to allow your browser to find your current location." />
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
            onSubmit={() =>
              dispatch(routeToNextAppointmentPage(history, pageKey))
            }
            formContext={{ loadingEligibility, sortMethod }}
            data={data}
          >
            <FacilitiesNotShown
              facilities={facilities}
              sortMethod={sortMethod}
              typeOfCareId={typeOfCare?.id}
            />
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

      <LoadingOverlay
        show={loadingEligibility}
        message="We’re checking if we can create an appointment for you at this
                facility. This may take up to a minute. Thank you for your
                patience."
      />

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
