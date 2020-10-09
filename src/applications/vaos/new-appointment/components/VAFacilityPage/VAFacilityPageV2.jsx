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
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import EligibilityModal from './EligibilityModal';
import ErrorMessage from '../../../components/ErrorMessage';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
import FormButtons from '../../../components/FormButtons';
import NoValidVAFacilities from './NoValidVAFacilitiesV2';
import NoVASystems from './NoVASystems';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
import VAFacilityInfoMessage from './VAFacilityInfoMessage';
import ResidentialAddress from './ResidentialAddress';

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
  updateFormData,
  requestCurrentLocation,
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

  if (singleValidVALocation && !canScheduleAtChosenFacility) {
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
    sortMethod === FACILITY_SORT_METHODS.DISTANCE_FROM_RESIDENTIAL;

  const sortByDistanceFromCurrentLocation =
    sortMethod === FACILITY_SORT_METHODS.DISTANCE_FROM_CURRENT_LOCATION;

  const requestingLocation = requestLocationStatus === FETCH_STATUS.loading;

  return (
    <div>
      {title}
      <p>
        Below is a list of VA locations where you’re registered that offer{' '}
        {typeOfCare} appointments.
        {(sortByDistanceFromResidential || sortByDistanceFromCurrentLocation) &&
          ` Locations closest to you are at the top of the list. We base this on ${
            sortByDistanceFromCurrentLocation
              ? 'your current location'
              : 'the address we have on file for you'
          }.`}
      </p>
      {sortByDistanceFromResidential &&
        !requestingLocation && (
          <>
            <ResidentialAddress address={address} />
            {requestLocationStatus !== FETCH_STATUS.failed && (
              <p>
                Or,{' '}
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    requestCurrentLocation(uiSchema);
                  }}
                >
                  use your current location
                </a>
              </p>
            )}
          </>
        )}
      {requestLocationStatus === FETCH_STATUS.failed && (
        <p>
          We weren’t able to determine your location. Please make sure your
          browser is set to allow location usage and{' '}
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              requestCurrentLocation(uiSchema);
            }}
          >
            try again
          </a>
          .
        </p>
      )}
      {requestingLocation && (
        <div className="vads-u-padding-bottom--2">
          <LoadingIndicator message="Determining your location..." />
        </div>
      )}
      {childFacilitiesStatus === FETCH_STATUS.succeeded && (
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
          {loadingEligibility && (
            <div aria-atomic="true" aria-live="assertive">
              <AlertBox isVisible status="info" headline="Please wait">
                We’re checking if we can create an appointment for you at this
                facility. This may take up to a minute. Thank you for your
                patience.
              </AlertBox>
            </div>
          )}
        </SchemaForm>
      )}

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
  openFacilityPageV2: actions.openFacilityPageV2,
  updateFormData: actions.updateFormData,
  hideEligibilityModal: actions.hideEligibilityModal,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  checkEligibility: actions.checkEligibility,
  requestCurrentLocation: actions.requestCurrentLocation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPageV2);
