import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import recordEvent from 'platform/monitoring/record-event';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getLongTermAppointmentHistory } from '../../../services/var';
import FormButtons from '../../../components/FormButtons';
import PodiatryAppointmentUnavailableModal from './PodiatryAppointmentUnavailableModal';
import UpdateAddressAlert from './UpdateAddressAlert';
import TypeOfCareAlert from './TypeOfCareAlert';
import * as actions from '../../redux/actions';
import {
  selectFeatureDirectScheduling,
  selectIsCernerOnlyPatient,
} from '../../../redux/selectors';
import { getFormPageInfo, getNewAppointment } from '../../redux/selectors';
import { resetDataLayer } from '../../../utils/events';

import { selectVAPResidentialAddress } from 'platform/user/selectors';

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

function TypeOfCarePage({
  hideUpdateAddressAlert,
  addressLine1,
  data,
  pageChangeInProgress,
  schema,
  showPodiatryApptUnavailableModal,
  openTypeOfCarePage,
  clickUpdateAddressButton,
  showDirectScheduling,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
  hidePodiatryAppointmentUnavailableModal,
}) {
  const history = useHistory();
  const showUpdateAddressAlert =
    !hideUpdateAddressAlert && (!addressLine1 || addressLine1.match(/^PO Box/));

  useEffect(() => {
    openTypeOfCarePage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();

    if (showUpdateAddressAlert) {
      recordEvent({
        event: 'vaos-update-address-alert-displayed',
      });
    }
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {showUpdateAddressAlert && (
        <UpdateAddressAlert
          onClickUpdateAddress={heading => {
            clickUpdateAddressButton();
            recordEvent({
              event: 'nav-warning-alert-box-content-link-click',
              alertBoxHeading: heading,
            });
            resetDataLayer();
          }}
        />
      )}

      {!!schema && (
        <SchemaForm
          name="Type of care"
          title="Type of care"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => routeToNextAppointmentPage(history, pageKey)}
          onChange={newData => {
            // When someone chooses a type of care that can be direct scheduled,
            // kick off the past appointments fetch, which takes a while
            // This could get called multiple times, but the function is memoized
            // and returns the previous promise if it eixsts
            if (showDirectScheduling) {
              getLongTermAppointmentHistory();
            }

            updateFormData(pageKey, uiSchema, newData);
          }}
          data={data}
        >
          <TypeOfCareAlert />
          <FormButtons
            onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
      <PodiatryAppointmentUnavailableModal
        showModal={showPodiatryApptUnavailableModal}
        onClose={hidePodiatryAppointmentUnavailableModal}
      />
    </div>
  );
}

function mapStateToProps(state) {
  const formInfo = getFormPageInfo(state, pageKey);
  const newAppointment = getNewAppointment(state);
  const address = selectVAPResidentialAddress(state);
  return {
    ...formInfo,
    ...address,
    showPodiatryApptUnavailableModal:
      newAppointment.showPodiatryAppointmentUnavailableModal,
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showDirectScheduling: selectFeatureDirectScheduling(state),
    hideUpdateAddressAlert: newAppointment.hideUpdateAddressAlert,
  };
}

const mapDispatchToProps = {
  openTypeOfCarePage: actions.openTypeOfCarePage,
  updateFormData: actions.updateFormData,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  showPodiatryAppointmentUnavailableModal:
    actions.showPodiatryAppointmentUnavailableModal,
  hidePodiatryAppointmentUnavailableModal:
    actions.hidePodiatryAppointmentUnavailableModal,
  clickUpdateAddressButton: actions.clickUpdateAddressButton,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TypeOfCarePage);
