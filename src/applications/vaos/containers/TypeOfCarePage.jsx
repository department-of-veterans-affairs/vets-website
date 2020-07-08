import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { scrollAndFocus } from '../utils/scrollAndFocus';
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
import {
  getFormPageInfo,
  getNewAppointment,
  vaosDirectScheduling,
  getResidentialAddress,
} from '../utils/selectors';

import { selectIsCernerOnlyPatient } from 'platform/user/selectors';

const initialSchema = {
  type: 'object',
  required: ['typeOfCareId'],
  properties: {
    typeOfCareId: {
      type: 'string',
    },
  },
};

const uiSchema = {
  typeOfCareId: {
    'ui:title': 'Please choose a type of care',
    'ui:widget': 'radio',
  },
};

const pageKey = 'typeOfCare';
const pageTitle = 'Choose the type of care you need';

function UpdateAddress({ address, showAlert, onHide }) {
  const regexp = /^PO Box/;
  if (showAlert && (!address || address.match(regexp))) {
    return (
      <AlertBox
        status="warning"
        headline="You need to have a home address on file to use some of the tool's features"
        className="vads-u-margin-y--3"
        content={
          <p>
            You can update your address in your VA profile. Please allow some
            time for your address update to process through our system. <br />
            <a
              className="usa-button usa-button-primary vads-u-margin-top--4"
              target="_blank"
              rel="noopener noreferrer"
              href="/change-address/#how-do-i-change-my-address-in-"
              onClick={onHide}
            >
              Update your address
            </a>
          </p>
        }
      />
    );
  }
  return null;
}

export class TypeOfCarePage extends React.Component {
  componentDidMount() {
    this.props.openTypeOfCarePage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }

  constructor(props) {
    super(props);
    this.state = {
      showAlert: true,
    };
  }

  hideAlert = () => {
    const showAlert = !this.state.showAlert;
    this.setState({ showAlert });
  };

  onChange = newData => {
    // When someone chooses a type of care that can be direct scheduled,
    // kick off the past appointments fetch, which takes a while
    // This could get called multiple times, but the function is memoized
    // and returns the previous promise if it eixsts
    if (this.props.showDirectScheduling) {
      getLongTermAppointmentHistory();
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
    const {
      schema,
      data,
      pageChangeInProgress,
      showToCUnavailableModal,
      address,
    } = this.props;

    if (!schema) {
      return null;
    }

    return (
      <div>
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        <UpdateAddress
          address={this.props.addressLine1}
          showAlert={this.state.showAlert}
          onHide={this.hideAlert}
        />

        <SchemaForm
          name="Type of care"
          title="Type of care"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={this.onChange}
          data={data}
        >
          <FormButtons
            onBack={this.goBack}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
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
  const address = getResidentialAddress(state);
  return {
    ...formInfo,
    ...address,
    showToCUnavailableModal: newAppointment.showTypeOfCareUnavailableModal,
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showDirectScheduling: vaosDirectScheduling(state),
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
