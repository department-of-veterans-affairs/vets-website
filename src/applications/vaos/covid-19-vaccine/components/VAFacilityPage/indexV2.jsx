/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../../components/FormButtons';
import InfoAlert from '../../../components/InfoAlert';
import useFormState from '../../../hooks/useFormState';
import { FACILITY_SORT_METHODS, FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../../flow';
import * as actions from '../../redux/actions';
import { getFacilityPageInfo } from '../../redux/selectors';
import useOpenFacilityPage from '../../redux/useOpenFacilityPage';
import EligibilityModal from './EligibilityModal';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
import NoValidVAFacilities from './NoValidVAFacilitiesV2';
import ResidentialAddress from './ResidentialAddressV2';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
import VAFacilityInfoMessage from './VAFacilityInfoMessage';

const pageKey = 'vaFacility';

function VAFacilityPage({
  initialData,
  hideEligibilityModal,
  clinicsStatus,
  pageChangeInProgress,
  requestLocationStatus,
  selectedFacility,
  showEligibilityModal,
  updateFacilitySortMethod,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    facilities,
    isError,
    isLoading,
    // isLoadingClinics,
    isSuccess,
  } = useOpenFacilityPage();
  const sortMethod = FACILITY_SORT_METHODS.distanceFromResidential;
  const singleValidVALocation = facilities?.length === 1;

  const pageTitle = singleValidVALocation
    ? 'Your appointment location'
    : 'Choose a VA location';

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
    },
    [pageTitle],
  );

  useEffect(
    () => {
      scrollAndFocus();
    },
    [isLoading],
  );

  // const previouslyShowingModal = usePrevious(showEligibilityModal);
  // useEffect(
  //   () => {
  //     if (!showEligibilityModal && previouslyShowingModal) {
  //       scrollAndFocus('.usa-button-primary');
  //     }
  //   },
  //   [showEligibilityModal, previouslyShowingModal],
  // );

  const { data, schema, setData, uiSchema } = useFormState({
    initialSchema: () => {
      return {
        type: 'object',
        required: ['vaFacility'],
        properties: {
          vaFacility: {
            type: 'string',
            enum: facilities?.map(facility => facility.id) || [],
            enumNames: facilities || [],
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
    dependencies: [facilities],
  });

  const goBack = () =>
    dispatch(routeToPreviousAppointmentPage(history, pageKey, data));

  const goForward = () =>
    dispatch(routeToNextAppointmentPage(history, pageKey, data));

  const title = <h1 className="vads-u-font-size--h2">{pageTitle}</h1>;

  if (isLoading) {
    // if (isLoading && !isLoadingClinics) {
    return (
      <div>
        <va-loading-indicator
          set-focus
          message="Finding locations"
          label="Finding locations"
        />
      </div>
    );
  }
  // if (isLoadingClinics) {
  //   return (
  //     <va-loading-indicator
  //       set-focus
  //       label="We’re checking if we can create an appointment for you at this
  //               facility. This may take up to a minute. Thank you for your
  //               patience."
  //       message="We’re checking if we can create an appointment for you at this
  //               facility. This may take up to a minute. Thank you for your
  //               patience."
  //     />
  //   );
  // }

  if (isSuccess && facilities?.length === 0) {
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

  if (singleValidVALocation) {
    // if (singleValidVALocation && !isLoadingClinics) {
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
        !isLoading && (
          <>
            <ResidentialAddress />
            {requestLocationStatus !== FETCH_STATUS.failed && (
              <p>
                Or,{' '}
                <button
                  type="button"
                  className="va-button-link"
                  data-testid="use-current-location"
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
        !isLoading && (
          <>
            <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
              Facilities based on your location
            </h2>
            <p>
              Or,{' '}
              <button
                type="button"
                className="va-button-link"
                data-testid="use-home-address"
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
      {isError && (
        <InfoAlert
          status="warning"
          headline="Your browser is blocked from finding your current location."
          className="vads-u-background-color--gold-lightest vads-u-padding-bottom--3"
          level="3"
        >
          <p>
            Make sure your browser’s location feature is turned on. If it isn’t
            enabled, we’ll sort your VA facilities using your home address
            that’s on file.
          </p>
        </InfoAlert>
      )}
      {isLoading && (
        <div className="vads-u-padding-bottom--2">
          <va-loading-indicator
            set-focus
            label="Finding your location. Be sure to allow your browser to find your current location."
            message="Finding your location. Be sure to allow your browser to find your current location."
          />
        </div>
      )}
      {isSuccess && (
        <SchemaForm
          name="VA Facility"
          title="VA Facility"
          schema={schema}
          uiSchema={uiSchema}
          onChange={newData => setData(newData)}
          onSubmit={goForward}
          formContext={{ loadingEligibility: false, sortMethod }}
          // formContext={{ loadingEligibility: isLoadingClinics, sortMethod }}
          data={data}
        >
          <FormButtons
            continueLabel=""
            pageChangeInProgress={pageChangeInProgress}
            onBack={goBack}
            disabled={isLoading || facilities?.length === 1}
            // disabled={isLoading || isLoadingClinics || facilities?.length === 1}
          />
        </SchemaForm>
      )}

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
  clinicsStatus: PropTypes.string,
  hideEligibilityModal: PropTypes.func,
  initialData: PropTypes.object,
  pageChangeInProgress: PropTypes.bool,
  requestLocationStatus: PropTypes.string,
  selectedFacility: PropTypes.object,
  showEligibilityModal: PropTypes.bool,
  singleValidVALocation: PropTypes.bool,
  sortMethod: PropTypes.string,
  updateFacilitySortMethod: PropTypes.func,
};

function mapStateToProps(state) {
  return getFacilityPageInfo(state);
}

const mapDispatchToProps = {
  hideEligibilityModal: actions.hideEligibilityModal,
  updateFacilitySortMethod: actions.updateFacilitySortMethod,
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPage);
