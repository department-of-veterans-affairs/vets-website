import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import * as actions from '../../redux/actions';
import { getFacilityPageV2Info } from '../../../utils/selectors';
import { FETCH_STATUS } from '../../../utils/constants';
import EligibilityModal from './EligibilityModal';
import FacilitiesRadioWidget from './FacilitiesRadioWidget';
import FormButtons from '../../../components/FormButtons';
import NoValidVAFacilities from './NoValidVAFacilities';
import NoVASystems from './NoVASystems';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
import VAFacilityInfoMessage from './VAFacilityInfoMessage';

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
  canScheduleAtChosenFacility,
  childFacilitiesStatus,
  data,
  eligibility,
  facilities,
  facility,
  facilityDetails,
  facilityDetailsStatus,
  loadingEligibilityStatus,
  noValidVAParentFacilities,
  noValidVAFacilities,
  openFacilityPageV2,
  pageChangeInProgress,
  parentDetails,
  parentFacilitiesStatus,
  routeToPreviousAppointmentPage,
  routeToNextAppointmentPage,
  schema,
  singleValidVALocation,
  siteId,
  typeOfCare,
  updateFacilityPageV2Data,
}) {
  const history = useHistory();
  const loadingEligibility = loadingEligibilityStatus === FETCH_STATUS.loading;
  const loadingParents = parentFacilitiesStatus === FETCH_STATUS.loading;
  const loadingFacilities = childFacilitiesStatus === FETCH_STATUS.loading;
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
      openFacilityPageV2(pageKey, uiSchema, initialSchema);
    },
    [openFacilityPageV2],
  );

  useEffect(
    () => {
      if (!loadingEligibility && canScheduleAtChosenFacility === false) {
        setShowEligibilityModal(true);
      }
    },
    [loadingEligibility, canScheduleAtChosenFacility],
  );

  const goBack = () => routeToPreviousAppointmentPage(history, pageKey);
  const goForward = () => routeToNextAppointmentPage(history, pageKey);

  const title = (
    <h1 className="vads-u-font-size--h2">
      Choose a VA location for your {typeOfCare} appointment
    </h1>
  );

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
        <NoValidVAFacilities
          formContext={{
            siteId,
            typeOfCare,
            facilityDetailsStatus,
            parentDetails,
          }}
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

  if (singleValidVALocation && !canScheduleAtChosenFacility) {
    return (
      <div>
        {title}
        <SingleFacilityEligibilityCheckMessage
          eligibility={eligibility}
          facility={facility}
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
        <VAFacilityInfoMessage facility={facility} />
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

  return (
    <div>
      {title}
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
          onSubmit={goForward}
          data={data}
          formContext={{ facilities }}
        >
          <FormButtons
            continueLabel=""
            pageChangeInProgress={pageChangeInProgress}
            onBack={goBack}
            disabled={
              loadingParents ||
              loadingFacilities ||
              loadingEligibility ||
              !canScheduleAtChosenFacility
            }
          />
        </SchemaForm>
      )}

      {showEligibilityModal && (
        <EligibilityModal
          onClose={() => setShowEligibilityModal(false)}
          eligibility={eligibility}
          facilityDetails={facilityDetails}
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
  updateFacilityPageV2Data: actions.updateFacilityPageV2Data,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPageV2);
