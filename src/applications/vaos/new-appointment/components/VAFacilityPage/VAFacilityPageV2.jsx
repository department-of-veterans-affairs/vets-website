import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { usePrevious } from 'platform/utilities/react-hooks';
import recordEvent from 'platform/monitoring/record-event';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getFacilityPageV2Info } from '../../redux/selectors';
import { FETCH_STATUS, GA_PREFIX } from '../../../utils/constants';
import EligibilityModal from './EligibilityModal';
import ErrorMessage from '../../../components/ErrorMessage';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
import FormButtons from '../../../components/FormButtons';
import NoValidVAFacilities from './NoValidVAFacilitiesV2';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
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
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';

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

const sortOptions = [
  { value: 'distanceFromResidentialAddress', label: 'By your home address' },
  { value: 'distanceFromCurrentLocation', label: 'By your current location' },
  { value: 'alphabetical', label: 'Alphabetically' },
];

export default function VAFacilityPageV2({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    address,
    canScheduleAtChosenFacility,
    cernerSiteIds,
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

  const uiSchema = {
    vaFacility: {
      'ui:title': `Select a VA facility where you’re registered that offers ${lowerCase(
        typeOfCare?.name,
      )} appointments.`,
      'ui:widget': FacilitiesRadioWidget,
    },
  };

  const loadingEligibility = loadingEligibilityStatus === FETCH_STATUS.loading;
  const requestingLocation = requestLocationStatus === FETCH_STATUS.loading;
  const loadingFacilities =
    childFacilitiesStatus === FETCH_STATUS.loading ||
    childFacilitiesStatus === FETCH_STATUS.notStarted;
  const pageTitle = singleValidVALocation
    ? 'Your appointment location'
    : 'Choose a VA location';

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
      if (featureBreadcrumbUrlUpdate) {
        changeCrumb(pageTitle);
      }
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
      <va-loading-indicator message="Finding available locations for your appointment..." />
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
          cernerSiteIds={cernerSiteIds}
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

  return (
    <div>
      {pageHeader}
      {requestingLocation && (
        <div className="vads-u-padding-bottom--2">
          <va-loading-indicator message="Finding your location. Be sure to allow your browser to find your current location." />
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
              recordEvent({
                event: `${GA_PREFIX}-variant-final-${sortMethod}`,
              });
              dispatch(routeToNextAppointmentPage(history, pageKey));
            }}
            formContext={{
              hasUserAddress,
              sortOptions,
              updateFacilitySortMethod: value =>
                dispatch(updateFacilitySortMethod(value, uiSchema)),
            }}
            data={data}
          >
            <FacilitiesNotShown
              facilities={facilities}
              sortMethod={sortMethod}
              typeOfCareId={typeOfCare?.id}
              cernerSiteIds={cernerSiteIds}
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

VAFacilityPageV2.propTypes = {
  changeCrumb: PropTypes.func,
};
