import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import EligibilityCheckMessage from './VAFacilityPage/EligibilityCheckMessage';
import FacilityAddress from '../../components/FacilityAddress';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { FETCH_STATUS } from '../../utils/constants';
import * as actions from '../redux/actions';

import { getClinicPageInfo } from '../../utils/selectors';
import { useHistory } from 'react-router-dom';

export function formatTypeOfCare(careLabel) {
  if (careLabel.startsWith('MOVE') || careLabel.startsWith('CPAP')) {
    return careLabel;
  }

  return careLabel.slice(0, 1).toLowerCase() + careLabel.slice(1);
}

function getPageTitle(schema, typeOfCare) {
  const typeOfCareLabel = formatTypeOfCare(typeOfCare.name);
  let pageTitle = 'Clinic choice';
  if (schema?.properties.clinicId.enum.length === 2) {
    pageTitle = `Make a ${typeOfCareLabel} appointment at your last clinic`;
  } else if (schema?.properties.clinicId.enum.length > 2) {
    pageTitle = `Choose your VA clinic for your ${typeOfCareLabel} appointment`;
  }
  return pageTitle;
}
const initialSchema = {
  type: 'object',
  required: ['clinicId'],
  properties: {
    clinicId: {
      type: 'string',
      enum: [],
    },
  },
};
const uiSchema = {
  clinicId: {
    'ui:widget': 'radio',
  },
};
const pageKey = 'clinicChoice';
export function ClinicChoicePage({
  schema,
  data,
  facilityDetails,
  typeOfCare,
  clinics,
  eligibility,
  canMakeRequests,
  openClinicPage,
  updateFormData,
  facilityDetailsStatus,
  pageChangeInProgress,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
}) {
  const history = useHistory();
  const typeOfCareLabel = formatTypeOfCare(typeOfCare.name);
  const usingUnsupportedRequestFlow =
    data.clinicId === 'NONE' && !canMakeRequests;
  useEffect(() => {
    openClinicPage(pageKey, uiSchema, initialSchema);
  }, []);

  useEffect(
    () => {
      scrollAndFocus();
      document.title = `${getPageTitle(schema, typeOfCare)} | Veterans Affairs`;
    },
    [schema && facilityDetailsStatus !== FETCH_STATUS.loading],
  );

  if (!schema || facilityDetailsStatus === FETCH_STATUS.loading) {
    return <LoadingIndicator message="Loading your facility and clinic info" />;
  }

  return (
    <div>
      {schema.properties.clinicId.enum.length === 2 && (
        <>
          <h1 className="vads-u-font-size--h2">
            {getPageTitle(schema, typeOfCare)}
          </h1>
          Your last {typeOfCareLabel} appointment was at{' '}
          {clinics[0].clinicFriendlyLocationName || clinics[0].clinicName}:
          {facilityDetails && (
            <p>
              <FacilityAddress
                name={facilityDetails.name}
                facility={facilityDetails}
              />
            </p>
          )}
        </>
      )}
      {schema.properties.clinicId.enum.length > 2 && (
        <>
          <h1 className="vads-u-font-size--h2">
            {getPageTitle(schema, typeOfCare)}
          </h1>
          In the last 24 months you have had a {typeOfCareLabel} appointment in
          the following clinics, located at:
          {facilityDetails && (
            <div className="vads-u-margin-y--2p5">
              <FacilityAddress
                name={facilityDetails.name}
                facility={facilityDetails}
              />
            </div>
          )}
        </>
      )}
      <SchemaForm
        name="Clinic choice"
        title="Clinic choice"
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={() => routeToNextAppointmentPage(history, pageKey)}
        onChange={newData => updateFormData(pageKey, uiSchema, newData)}
        data={data}
      >
        {usingUnsupportedRequestFlow && (
          <div className="vads-u-margin-top--2">
            <EligibilityCheckMessage eligibility={eligibility} />
          </div>
        )}
        <FormButtons
          onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
          disabled={usingUnsupportedRequestFlow}
          pageChangeInProgress={pageChangeInProgress}
          loadingText="Page change in progress"
        />
      </SchemaForm>
    </div>
  );
}

function mapStateToProps(state) {
  return getClinicPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openClinicPage: actions.openClinicPage,
  updateFormData: actions.updateFormData,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClinicChoicePage);
