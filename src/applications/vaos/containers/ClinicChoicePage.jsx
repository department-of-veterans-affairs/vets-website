import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import EligibilityCheckMessage from '../components/EligibilityCheckMessage';
import FacilityAddress from '../components/FacilityAddress';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { FETCH_STATUS } from '../utils/constants';

import {
  openClinicPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getClinicPageInfo } from '../utils/selectors';
import { formatTypeOfCare } from '../utils/formatters';

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

export class ClinicChoicePage extends React.Component {
  componentDidMount() {
    this.props.openClinicPage(pageKey, uiSchema, initialSchema);
    scrollAndFocus();
  }

  componentDidUpdate(oldProps) {
    const previouslyLoading =
      !oldProps.schema ||
      oldProps.facilityDetailsStatus === FETCH_STATUS.loading;
    const currentlyLoading =
      !this.props.schema ||
      this.props.facilityDetailsStatus === FETCH_STATUS.loading;

    if (previouslyLoading && !currentlyLoading) {
      scrollAndFocus();
      document.title = `${getPageTitle(
        this.props.schema,
        this.props.typeOfCare,
      )} | Veterans Affairs`;
    }
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const {
      schema,
      data,
      pageChangeInProgress,
      facilityDetails,
      typeOfCare,
      clinics,
      facilityDetailsStatus,
      eligibility,
      canMakeRequests,
    } = this.props;

    if (!schema || facilityDetailsStatus === FETCH_STATUS.loading) {
      return (
        <LoadingIndicator message="Loading your facility and clinic info" />
      );
    }

    const typeOfCareLabel = formatTypeOfCare(typeOfCare.name);
    const usingUnsupportedRequestFlow =
      data.clinicId === 'NONE' && !canMakeRequests;

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
            In the last 24 months you have had a {typeOfCareLabel} appointment
            in the following clinics, located at:
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
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateFormData(pageKey, uiSchema, newData)
          }
          data={data}
        >
          {usingUnsupportedRequestFlow && (
            <div className="vads-u-margin-top--2">
              <EligibilityCheckMessage eligibility={eligibility} />
            </div>
          )}
          <FormButtons
            onBack={this.goBack}
            disabled={usingUnsupportedRequestFlow}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return getClinicPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openClinicPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClinicChoicePage);
