import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import recordEvent from 'platform/monitoring/record-event';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getLongTermAppointmentHistory } from '../../../services/var';
import FormButtons from '../../../components/FormButtons';
import TypeOfCareUnavailableModal from './TypeOfCareUnavailableModal';
import UpdateAddressAlert from './UpdateAddressAlert';
import {
  openTypeOfCarePage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  showTypeOfCareUnavailableModal,
  hideTypeOfCareUnavailableModal,
  clickUpdateAddressButton,
} from '../../redux/actions';
import {
  getFormPageInfo,
  getNewAppointment,
  vaosDirectScheduling,
  selectIsCernerOnlyPatient,
} from '../../../utils/selectors';
import { resetDataLayer } from '../../../utils/events';

import { selectVet360ResidentialAddress } from 'platform/user/selectors';

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

export class TypeOfCarePage extends React.Component {
  componentDidMount() {
    this.props.openTypeOfCarePage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();

    if (this.showUpdateAddressAlert()) {
      recordEvent({
        event: 'vaos-update-address-alert-displayed',
      });
    }
  }

  onClickUpdateAddress = heading => {
    this.props.clickUpdateAddressButton();
    recordEvent({
      event: 'nav-warning-alert-box-content-link-click',
      alertBoxHeading: heading,
    });
    resetDataLayer();
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
    this.props.routeToPreviousAppointmentPage(this.props.history, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.history, pageKey);
  };

  showUpdateAddressAlert = () => {
    const { hideUpdateAddressAlert, addressLine1 } = this.props;
    return (
      !hideUpdateAddressAlert &&
      (!addressLine1 || addressLine1.match(/^PO Box/))
    );
  };

  render() {
    const {
      schema,
      data,
      pageChangeInProgress,
      showToCUnavailableModal,
    } = this.props;

    if (!schema) {
      return null;
    }

    return (
      <div>
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        {this.showUpdateAddressAlert() && (
          <UpdateAddressAlert
            onClickUpdateAddress={this.onClickUpdateAddress}
          />
        )}

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
  const address = selectVet360ResidentialAddress(state);
  return {
    ...formInfo,
    ...address,
    showToCUnavailableModal: newAppointment.showTypeOfCareUnavailableModal,
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showDirectScheduling: vaosDirectScheduling(state),
    hideUpdateAddressAlert: newAppointment.hideUpdateAddressAlert,
  };
}

const mapDispatchToProps = {
  openTypeOfCarePage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  showTypeOfCareUnavailableModal,
  hideTypeOfCareUnavailableModal,
  clickUpdateAddressButton,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TypeOfCarePage);
