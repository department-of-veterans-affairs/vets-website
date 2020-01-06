import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
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
    } = this.props;

    if (!schema || facilityDetailsStatus === FETCH_STATUS.loading) {
      return (
        <LoadingIndicator message="Loading your facility and clinic info" />
      );
    }

    const typeOfCareLabel = formatTypeOfCare(typeOfCare.name);

    return (
      <div>
        {schema.properties.clinicId.enum.length === 2 && (
          <>
            <h1 className="vads-u-font-size--h2">
              Make a {typeOfCareLabel} appointment at your last clinic
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
              Select your VA clinic for your {typeOfCareLabel} appointment
            </h1>
            In the last 24 months you have had {typeOfCareLabel} appointments in
            the following clinics, located at:
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
          <FormButtons
            onBack={this.goBack}
            pageChangeInProgress={pageChangeInProgress}
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
