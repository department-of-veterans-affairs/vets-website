import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { usePrevious } from '@department-of-veterans-affairs/platform-utilities/exports';
import PropTypes from 'prop-types';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
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
import InfoAlert from '../../../components/InfoAlert';
import useFormState from '../../../hooks/useFormState';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../../flow';

const pageKey = 'vaFacility';

function VAFacilityPage({
  address,
  canScheduleAtChosenFacility,
  facilitiesStatus,
  initialData,
  hideEligibilityModal,
  clinicsStatus,
  noValidVAFacilities,
  openFacilityPage,
  pageChangeInProgress,
  requestLocationStatus,
  selectedFacility,
  showEligibilityModal,
  singleValidVALocation,
  sortMethod,
  updateFacilitySortMethod,
  supportedFacilities,
  changeCrumb,
}) {
  const history = useHistory();
  const loadingClinics = clinicsStatus === FETCH_STATUS.loading;
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const dispatch = useDispatch();

  const pageTitle = singleValidVALocation
    ? 'Your appointment location'
    : 'Choose a VA location';

  useEffect(() => {
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
      openFacilityPage();
    },
    [openFacilityPage],
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

  const { data, schema, setData, uiSchema } = useFormState({
    initialSchema: () => {
      return {
        type: 'object',
        required: ['vaFacility'],
        properties: {
          vaFacility: {
            type: 'string',
            enum: supportedFacilities?.map(facility => facility.id) || [],
            enumNames: supportedFacilities || [],
          },
        },
      };
    },
    uiSchema: {
      vaFacility: {
        'ui:title': 'Please select where you’d like to have your appointment.',
        'ui:widget': FacilitiesRadioWidget,
        'ui:errorMessages': {
          required: 'Please select a location for your appointment',
        },
      },
    },
    initialData,
    dependencies: [supportedFacilities],
  });

  const loadingFacilities =
    !schema ||
    facilitiesStatus === FETCH_STATUS.loading ||
    facilitiesStatus === FETCH_STATUS.notStarted;

  useEffect(
    () => {
      scrollAndFocus();
    },
    [loadingFacilities],
  );

  const goBack = () =>
    dispatch(routeToPreviousAppointmentPage(history, pageKey, data));

  const goForward = () =>
    dispatch(routeToNextAppointmentPage(history, pageKey, data));

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
        <va-loading-indicator message="Finding locations" />
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
        <VAFacilityInfoMessage
          facility={selectedFacility}
          sortMethod={sortMethod}
        />
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
        Here’s a list of VA facilities where you’re registered that offer{' '}
        COVID-19 vaccine appointments.
        {(sortByDistanceFromResidential || sortByDistanceFromCurrentLocation) &&
          ' Locations closest to you are listed first.'}
      </p>
      {sortByDistanceFromResidential &&
        !requestingLocation && (
          <>
            <ResidentialAddress address={address} />
            {requestLocationStatus !== FETCH_STATUS.failed && (
              <p>
                Or,{' '}
                <button
                  type="button"
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
                type="button"
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
        <InfoAlert
          status="warning"
          headline="Your browser is blocked from finding your current location."
          className="vads-u-background-color--gold-lightest vads-u-font-size--base vads-u-padding-bottom--3"
          level="3"
        >
          <p>
            Make sure your browser’s location feature is turned on. If it isn’t
            enabled, we’ll sort your VA facilities using your home address
            that’s on file.
          </p>
        </InfoAlert>
      )}
      {requestingLocation && (
        <div className="vads-u-padding-bottom--2">
          <va-loading-indicator message="Finding your location. Be sure to allow your browser to find your current location." />
        </div>
      )}
      {facilitiesStatus === FETCH_STATUS.succeeded &&
        !requestingLocation && (
          <SchemaForm
            name="VA Facility"
            title="VA Facility"
            schema={schema}
            uiSchema={uiSchema}
            onChange={newData => setData(newData)}
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
                (supportedFacilities?.length === 1 &&
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

VAFacilityPage.propTypes = {
  address: PropTypes.object,
  canScheduleAtChosenFacility: PropTypes.bool,
  changeCrumb: PropTypes.func,
  clinicsStatus: PropTypes.string,
  facilitiesStatus: PropTypes.string,
  hideEligibilityModal: PropTypes.func,
  initialData: PropTypes.object,
  noValidVAFacilities: PropTypes.bool,
  openFacilityPage: PropTypes.func,
  pageChangeInProgress: PropTypes.bool,
  requestLocationStatus: PropTypes.string,
  selectedFacility: PropTypes.object,
  showEligibilityModal: PropTypes.bool,
  singleValidVALocation: PropTypes.bool,
  sortMethod: PropTypes.string,
  supportedFacilities: PropTypes.array,
  updateFacilitySortMethod: PropTypes.func,
};

function mapStateToProps(state) {
  return getFacilityPageInfo(state);
}

const mapDispatchToProps = {
  hideEligibilityModal: actions.hideEligibilityModal,
  openFacilityPage: actions.openFacilityPage,
  updateFacilitySortMethod: actions.updateFacilitySortMethod,
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPage);
