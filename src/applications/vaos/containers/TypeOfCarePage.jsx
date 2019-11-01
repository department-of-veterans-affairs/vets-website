import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import { TYPES_OF_CARE, DIRECT_SCHEDULE_TYPES } from '../utils/constants';
import { getPastAppointments } from '../api';
import FormButtons from '../components/FormButtons';
import TypeOfCareField from '../components/TypeOfCareField';
import {
  openFormPage,
  getUserSystems,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';

const initialSchema = {
  type: 'object',
  required: ['typeOfCareId'],
  properties: {
    typeOfCareId: {
      type: 'string',
      enum: TYPES_OF_CARE.map(care => care.id || care.ccId),
    },
  },
};

const uiSchema = {
  typeOfCareId: {
    'ui:title': 'What type of care do you need?',
    'ui:field': TypeOfCareField,
    'ui:options': {
      hideLabelText: true,
    },
  },
};

const pageKey = 'typeOfCare';

export class TypeOfCarePage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    this.props.getUserSystems();
  }

  onChange = newData => {
    // When someone chooses a type of care that can be direct scheduled,
    // kick off the past appointments fetch, which takes a while
    if (DIRECT_SCHEDULE_TYPES.has(newData.typeOfCareId)) {
      // This could get called multiple times, but the function is memoized
      // and returns the previous promise if it eixsts
      getPastAppointments();
    }

    this.props.updateFormData(pageKey, uiSchema, newData);
  };

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
          Choose the type of care you need
        </h1>
        <SchemaForm
          name="Type of care"
          title="Type of care"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={this.onChange}
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
  getUserSystems,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TypeOfCarePage);
