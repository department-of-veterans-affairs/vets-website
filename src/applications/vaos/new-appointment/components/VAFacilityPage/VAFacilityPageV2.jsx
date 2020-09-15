import React, { useEffect } from 'react';
import { connect } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import * as actions from '../../redux/actions';
import { getFacilityPageV2Info } from '../../../utils/selectors';
import { FETCH_STATUS } from '../../../utils/constants';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
// import FormButtons from '../../../components/FormButtons';
// import NoValidVAFacilities from './NoValidVAFacilities';

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
  schema,
  data,
  facilities,
  childFacilitiesStatus,
  openFacilityPageV2,
  updateFacilityPageV2Data,
  typeOfCare,
}) {
  // const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    openFacilityPageV2(pageKey, uiSchema, initialSchema);
  }, []);

  if (childFacilitiesStatus === FETCH_STATUS.loading) {
    return <LoadingIndicator message="Finding locations" />;
  }

  return (
    <div>
      <h1 className="vads-u-font-size--h2">
        Choose a VA location for your {typeOfCare} appointment
      </h1>
      <p>
        Below is a list of VA locations where you’re registered that offer{' '}
        {typeOfCare} appointments.
      </p>
      {childFacilitiesStatus === FETCH_STATUS.succeeded && (
        <SchemaForm
          name="VA Facility"
          title="VA Facility"
          schema={schema}
          uiSchema={uiSchema}
          onChange={newData =>
            updateFacilityPageV2Data(pageKey, uiSchema, newData)
          }
          data={data}
          formContext={{ facilities }}
        >
          {/* {notEligibleAtChosenFacility && (
              <div className="vads-u-margin-top--2">
                <EligibilityCheckMessage
                  facilityDetails={facilityDetails}
                  eligibility={eligibility}
                />
              </div>
            )} */}
          {/* <FormButtons
              onBack={this.goBack}
              continueLabel=""
              disabled={disableSubmitButton}
              pageChangeInProgress={loadingEligibility || pageChangeInProgress}
              loadingText={
                loadingEligibility
                  ? 'Checking eligibility requirements'
                  : 'Page change in progress'
              }
            />
            {/* (loadingEligibility || pageChangeInProgress) && (
              <div aria-atomic="true" aria-live="assertive">
                <AlertBox isVisible status="info" headline="Please wait">
                  We’re checking if we can create an appointment for you at this
                  facility. This may take up to a minute. Thank you for your
                  patience.
                </AlertBox>
              </div>
            ) */}
        </SchemaForm>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return getFacilityPageV2Info(state);
}

const mapDispatchToProps = {
  openFacilityPageV2: actions.openFacilityPageV2,
  updateFacilityPageV2Data: actions.updateFacilityPageV2Data,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPageV2);
