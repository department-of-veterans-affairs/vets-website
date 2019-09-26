import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import facilities from '../actions/facilities.json';
import facilities984 from '../actions/facilities_984.json';

import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment';
import { getFormPageInfo } from '../utils/selectors';

const initialSchema = {
  type: 'object',
  required: ['vaSystem', 'vaFacility'],
  properties: {
    vaSystem: {
      type: 'string',
      enum: facilities.map(facility => facility.authoritativeName),
    },
    vaFacility: {
      type: 'string',
      enum: facilities984.map(
        facility => facility.institution.authoritativeName,
      ),
    },
  },
};

const uiSchema = {
  vaSystem: {
    'ui:widget': 'radio',
    'ui:title':
      'You are registered at the following VA health systems. Select where you would like to have your appointment',
  },
  vaFacility: {
    'ui:title':
      'Appointments are available at the following locations. Some types of care are only available at one location. Select your preferred location',
    'ui:widget': 'radio',
  },
};

const pageKey = 'vaFacility';

export class VAFacilityPage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">
          Choose a VA location for your apppointment
        </h1>
        <SchemaForm
          name="VA Facility"
          title="VA Facility"
          schema={schema || initialSchema}
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
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPage);
