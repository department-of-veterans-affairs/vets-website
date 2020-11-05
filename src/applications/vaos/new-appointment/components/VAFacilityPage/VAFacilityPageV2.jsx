import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import * as actions from '../../redux/actions';
import { getFacilityPageV2Info } from '../../../utils/selectors';
import { FETCH_STATUS, FACILITY_SORT_METHODS } from '../../../utils/constants';
import { getParentOfLocation } from '../../../services/location';
import EligibilityModal from './EligibilityModal';
import ErrorMessage from '../../../components/ErrorMessage';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
import FormButtons from '../../../components/FormButtons';
import NoValidVAFacilities from './NoValidVAFacilitiesV2';
import NoVASystems from './NoVASystems';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
import VAFacilityInfoMessage from './VAFacilityInfoMessage';
import ResidentialAddress from './ResidentialAddress';
import LoadingOverlay from '../../../components/LoadingOverlay';

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
const pageTitle = 'Choose a VA location for your appointment';

function VAFacilityPageV2({
  address,
  canScheduleAtChosenFacility,
  childFacilitiesStatus,
  data,
  eligibility,
  facilities,
  hasDataFetchingError,
  hideEligibilityModal,
  loadingEligibilityStatus,
  noValidVAParentFacilities,
  noValidVAFacilities,
  openFacilityPageV2,
  pageChangeInProgress,
  parentFacilities,
  parentFacilitiesStatus,
  requestLocationStatus,
  routeToPreviousAppointmentPage,
  routeToNextAppointmentPage,
  schema,
  selectedFacility,
  showEligibilityModal,
  singleValidVALocation,
  sortMethod,
  typeOfCare,
  updateFacilitySortMethod,
  updateFormData,
}) {
  const history = useHistory();
  const loadingEligibility = loadingEligibilityStatus === FETCH_STATUS.loading;
  const loadingParents = parentFacilitiesStatus === FETCH_STATUS.loading;
  const loadingFacilities = childFacilitiesStatus === FETCH_STATUS.loading;

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
      openFacilityPageV2(pageKey, uiSchema, initialSchema);
    },
    [openFacilityPageV2],
  );

  const goBack = () => routeToPreviousAppointmentPage(history, pageKey);

  const goForward = () => routeToNextAppointmentPage(history, pageKey);

  const onFacilityChange = newData => {
    const facility = facilities.find(f => f.id === newData.vaFacility);
    const vaParent = getParentOfLocation(parentFacilities, facility)?.id;

    if (!!facility && !!vaParent) {
      updateFormData(pageKey, uiSchema, {
        ...newData,
        vaParent,
      });
    }
  };

  const title = (
    <h1 className="vads-u-font-size--h2">
      Choose a VA location for your {typeOfCare} appointment
    </h1>
  );

  if (hasDataFetchingError) {
    return (
      <div>
        {title}
        <ErrorMessage />
      </div>
    );
  }

  if (
    loadingParents ||
    loadingFacilities ||
    (singleValidVALocation && loadingEligibility)
  ) {
    return (
      <div>
        {title}
        <LoadingIndicator message="Finding locations" />
      </div>
    );
  }

  if (noValidVAParentFacilities) {
    return (
      <div>
        {title}
        <NoVASystems />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={goBack}
            disabled
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </div>
      </div>
    );
  }

  if (noValidVAFacilities) {
    return (
      <div>
        {title}
        <NoValidVAFacilities typeOfCare={typeOfCare} />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={goBack}
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
        {title}
        <SingleFacilityEligibilityCheckMessage
          eligibility={eligibility}
          facility={selectedFacility}
        />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={goBack}
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
        {title}
        <VAFacilityInfoMessage facility={selectedFacility} />
        <div className="vads-u-margin-top--2">
          <FormButtons
            onBack={goBack}
            onSubmit={goForward}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </div>
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
      {title}
      <p>
        Below is a list of VA locations where you’re registered that offer{' '}
        {typeOfCare} appointments.
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
                    updateFacilitySortMethod(
                      FACILITY_SORT_METHODS.distanceFromCurrentLocation,
                      uiSchema,
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
                  updateFacilitySortMethod(
                    FACILITY_SORT_METHODS.distanceFromResidential,
                    uiSchema,
                  );
                }}
              >
                use your home address on file
              </button>
            </p>
          </>
        )}
      {requestLocationStatus === FETCH_STATUS.failed && (
        <div className="usa-alert usa-alert-info background-color-only vads-u-margin-bottom--2">
          <div className="usa-alert-body">
            Your browser is blocked from finding your current location. Make
            sure your browser’s location feature is turned on. If it isn’t
            enabled, we’ll sort your VA facilities using your home address
            that’s on file.
          </div>
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
            onChange={onFacilityChange}
            onSubmit={goForward}
            formContext={{ loadingEligibility, sortMethod }}
            data={data}
          >
            <FormButtons
              continueLabel=""
              pageChangeInProgress={pageChangeInProgress}
              onBack={goBack}
              disabled={
                loadingParents ||
                loadingFacilities ||
                loadingEligibility ||
                (facilities?.length === 1 && !canScheduleAtChosenFacility)
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
          onClose={hideEligibilityModal}
          eligibility={eligibility}
          facilityDetails={selectedFacility}
        />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return getFacilityPageV2Info(state);
}

const mapDispatchToProps = {
  checkEligibility: actions.checkEligibility,
  hideEligibilityModal: actions.hideEligibilityModal,
  openFacilityPageV2: actions.openFacilityPageV2,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  updateFacilitySortMethod: actions.updateFacilitySortMethod,
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPageV2);
