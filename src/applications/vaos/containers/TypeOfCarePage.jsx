import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import { TYPES_OF_CARE } from '../utils/constants';
import { getLongTermAppointmentHistory } from '../api';
import FormButtons from '../components/FormButtons';
import TypeOfCareUnavailableModal from '../components/TypeOfCareUnavailableModal';
import {
  openTypeOfCarePage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  showTypeOfCareUnavailableModal,
  hideTypeOfCareUnavailableModal,
} from '../actions/newAppointment.js';
import { getFormPageInfo, getNewAppointment } from '../utils/selectors';

const sortedCare = TYPES_OF_CARE.sort(
  (careA, careB) => (careA.name > careB.name ? 1 : -1),
);

const initialSchema = {
  type: 'object',
  required: ['typeOfCareId'],
  properties: {
    typeOfCareId: {
      type: 'string',
      enum: sortedCare.map(care => care.id || care.ccId),
      enumNames: sortedCare.map(care => care.name),
    },
  },
};

const uiSchema = {
  typeOfCareId: {
    'ui:title': 'What type of care do you need?',
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
    },
  },
};

const pageKey = 'typeOfCare';

export class TypeOfCarePage extends React.Component {
  componentDidMount() {
    this.props.openTypeOfCarePage(pageKey, uiSchema, initialSchema);
  }

  onChange = newData => {
    // When someone chooses a type of care that can be direct scheduled,
    // kick off the past appointments fetch, which takes a while
    // This could get called multiple times, but the function is memoized
    // and returns the previous promise if it eixsts
    getLongTermAppointmentHistory();

    this.props.updateFormData(pageKey, uiSchema, newData);
  };

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
      showToCUnavailableModal,
    } = this.props;

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
        <TypeOfCareUnavailableModal
          typeOfCare="Podiatry"
          showModal={showToCUnavailableModal}
          onClose={this.props.hideTypeOfCareUnavailableModal}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const formInfo = getFormPageInfo(state, pageKey);
  const newAppointment = getNewAppointment(state);
  return {
    ...formInfo,
    showToCUnavailableModal: newAppointment.showTypeOfCareUnavailableModal,
  };
}

const mapDispatchToProps = {
  openTypeOfCarePage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  showTypeOfCareUnavailableModal,
  hideTypeOfCareUnavailableModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TypeOfCarePage);
