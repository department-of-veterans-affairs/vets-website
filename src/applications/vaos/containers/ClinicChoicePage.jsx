import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';

import {
  openClinicPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getClinicPageInfo } from '../utils/selectors';

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
    } = this.props;

    if (!schema) {
      return <LoadingIndicator>Loading your clinic choices</LoadingIndicator>;
    }

    return (
      <div>
        {schema.properties.clinicId.enum.length === 2 && (
          <>
            <h1 className="vads-u-font-size--h2">
              Make an appointment at your last clinic
            </h1>
            Your last {typeOfCare.name} appointment was at:
            {facilityDetails && (
              <p>
                <strong>{facilityDetails.attributes.name}</strong>
                <br />
                {facilityDetails.attributes.address.physical.address1}
                <br />
                {facilityDetails.attributes.address.physical.address2}
                <br />
                {facilityDetails.attributes.address.physical.city},{' '}
                {facilityDetails.attributes.address.physical.state}{' '}
                {facilityDetails.attributes.address.physical.zip}
              </p>
            )}
            {!facilityDetails && (
              <p>
                <strong>Green Team Clinic1</strong>
                <br />
                CHYSHR-Cheyenne VA Medical Center
                <br />
                421 North Main Street
                <br />
                Leeds, MA 01053-9764
              </p>
            )}
          </>
        )}
        {schema.properties.clinicId.enum.length > 2 && (
          <h1 className="vads-u-font-size--h2">
            Where do you want an appointment?
          </h1>
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
