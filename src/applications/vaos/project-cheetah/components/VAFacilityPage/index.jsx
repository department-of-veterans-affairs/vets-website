import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import * as actions from '../../redux/actions';
import { getFacilityPageInfo } from '../../redux/selectors';
import { FETCH_STATUS, FACILITY_SORT_METHODS } from '../../../utils/constants';
import EligibilityModal from './EligibilityModal';
import ErrorMessage from '../../../components/ErrorMessage';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
import FormButtons from '../../../components/FormButtons';
import NoValidVAFacilities from './NoValidVAFacilitiesV2';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
import VAFacilityInfoMessage from './VAFacilityInfoMessage';
import ResidentialAddress from './ResidentialAddress';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { usePrevious } from 'platform/utilities/react-hooks';

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

const pageKey = 'vaFacility';
const pageTitle = 'Choose a location';

function VAFacilityPage({
  address,
  canScheduleAtChosenFacility,
  facilitiesStatus,
  data,
  hideEligibilityModal,
  clinicsStatus,
  noValidVAFacilities,
  openFacilityPage,
  pageChangeInProgress,
  requestLocationStatus,
  routeToPreviousAppointmentPage,
  routeToNextAppointmentPage,
  schema,
  selectedFacility,
  showEligibilityModal,
  singleValidVALocation,
  sortMethod,
  updateFacilitySortMethod,
  updateFormData,
}) {
  const history = useHistory();
  const loadingClinics = clinicsStatus === FETCH_STATUS.loading;
  const loadingFacilities =
    facilitiesStatus === FETCH_STATUS.loading ||
    facilitiesStatus === FETCH_STATUS.notStarted;

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
      openFacilityPage(uiSchema, initialSchema);
    },
    [openFacilityPage],
  );

  useEffect(
    () => {
      scrollAndFocus();
    },
    [loadingFacilities],
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

  const goBack = () => routeToPreviousAppointmentPage(history, pageKey);

  const goForward = () => routeToNextAppointmentPage(history, pageKey);

  const title = <h1 className="vads-u-font-size--h2">{pageTitle}</h1>;

  if (
    facilitiesStatus === FETCH_STATUS.failed ||
    (clinicsStatus === FETCH_STATUS.failed && singleValidVALocation)
  ) {
    return (
      <div>
        {title}
        <ErrorMessage />
      </div>
    );
  }

  if (loadingFacilities || (singleValidVALocation && loadingClinics)) {
    return (
      <div>
        {title}
        <LoadingIndicator message="Finding locations" />
      </div>
    );
  }

  if (noValidVAFacilities) {
    return (
      <div>
        {title}
        <NoValidVAFacilities />
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

  if (
    singleValidVALocation &&
    !canScheduleAtChosenFacility &&
    !loadingClinics
  ) {
    return (
      <div>
        {title}
        <SingleFacilityEligibilityCheckMessage
          clinicsStatus={clinicsStatus}
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
        COVID-19 vaccine appointments.
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
      {facilitiesStatus === FETCH_STATUS.succeeded &&
        !requestingLocation && (
          <SchemaForm
            name="VA Facility"
            title="VA Facility"
            schema={schema}
            uiSchema={uiSchema}
            onChange={newData => updateFormData(pageKey, uiSchema, newData)}
            onSubmit={goForward}
            formContext={{ loadingEligibility: loadingClinics, sortMethod }}
            data={data}
          >
            <FormButtons
              continueLabel=""
              pageChangeInProgress={pageChangeInProgress}
              onBack={goBack}
              disabled={
                loadingFacilities ||
                loadingClinics ||
                (schema.properties.vaFacility.enum?.length === 1 &&
                  !canScheduleAtChosenFacility)
              }
            />
          </SchemaForm>
        )}

      <LoadingOverlay
        show={loadingClinics}
        message="We’re checking if we can create an appointment for you at this
                facility. This may take up to a minute. Thank you for your
                patience."
      />

      {showEligibilityModal && (
        <EligibilityModal
          clinicsStatus={clinicsStatus}
          onClose={hideEligibilityModal}
          facilityDetails={selectedFacility}
        />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return getFacilityPageInfo(state);
}

const mapDispatchToProps = {
  hideEligibilityModal: actions.hideEligibilityModal,
  openFacilityPage: actions.openFacilityPage,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  updateFacilitySortMethod: actions.updateFacilitySortMethod,
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPage);
