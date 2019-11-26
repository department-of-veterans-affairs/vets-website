import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import {
  selectVet360EmailAddress,
  selectVet360HomePhoneString,
  selectVet360MobilePhoneString,
} from 'platform/user/selectors';

import { TYPES_OF_CARE, DIRECT_SCHEDULE_TYPES } from '../utils/constants';
import { getLongTermAppointmentHistory } from '../api';
import FormButtons from '../components/FormButtons';
import TypeOfCareUnavailableModal from '../components/TypeOfCareUnavailableModal';
import {
  openFormPage,
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
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    this.prefillContactInfo();
  }

  onChange = newData => {
    // When someone chooses a type of care that can be direct scheduled,
    // kick off the past appointments fetch, which takes a while
    if (DIRECT_SCHEDULE_TYPES.has(newData.typeOfCareId)) {
      // This could get called multiple times, but the function is memoized
      // and returns the previous promise if it eixsts
      getLongTermAppointmentHistory();
    }

    this.props.updateFormData(pageKey, uiSchema, newData);
  };

  prefillContactInfo = () => {
    const phoneNumber = this.props.mobilePhone || this.props.homePhone;
    // only prefill the phone number if it isn't already set. So if the user has
    // explicitly set a phone number and then gone back to the start of the New
    // Appointment flow (without a hard refresh), this prefill won't rerun,
    // overwriting what they have manually entered
    if (phoneNumber && !this.props.data.phoneNumber) {
      this.props.updateFormData(pageKey, uiSchema, {
        ...this.props.data,
        phoneNumber,
      });
    }
    // The following is disabled since we don't yet have email address on the
    // Contact Info page.. When it's enabled it'll be best to refactor this
    // function to make a single call to updateFormData rather than one for
    // phone number and one for email address.
    // // only prefill the email address if it isn't already set
    // if (this.props.emailAddress && !this.props.data.emailAddress) {
    //   this.props.updateFormData(pageKey, uiSchema, {
    //     ...this.props.data,
    //     emailAddress: this.props.emailAddress,
    //   });
    // }
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
  const formPageInfo = getFormPageInfo(state, pageKey);
  const newAppointment = getNewAppointment(state);

  return {
    ...formPageInfo,
    emailAddress: selectVet360EmailAddress(state),
    homePhone: selectVet360HomePhoneString(state),
    mobilePhone: selectVet360MobilePhoneString(state),
    showToCUnavailableModal: newAppointment.showTypeOfCareUnavailableModal,
  };
}

const mapDispatchToProps = {
  openFormPage,
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
