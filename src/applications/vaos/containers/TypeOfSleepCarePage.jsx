import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import { TYPES_OF_SLEEP_CARE } from '../utils/constants';
import FormButtons from '../components/FormButtons';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';

const initialSchema = {
  type: 'object',
  required: ['typeOfSleepCareId'],
  properties: {
    typeOfSleepCareId: {
      type: 'string',
      enum: TYPES_OF_SLEEP_CARE.map(care => care.id),
      enumNames: TYPES_OF_SLEEP_CARE.map(care => care.name),
    },
  },
};

const uiSchema = {
  typeOfSleepCareId: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {},
    },
  },
};

const pageKey = 'typeOfSleepCare';

export class TypeOfSleepCarePage extends React.Component {
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
          Choose the type of sleep care you need
        </h1>
        <SchemaForm
          name="Type of sleep care"
          title="Type of sleep care"
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
)(TypeOfSleepCarePage);
