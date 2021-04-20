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
  selectFeatureCommunityCare,
  selectFeatureDirectScheduling,
  selectIsCernerOnlyPatient,
} from '../../../redux/selectors';
import {
  getFormData,
  getNewAppointment,
  selectPageChangeInProgress,
} from '../../redux/selectors';
import { resetDataLayer } from '../../../utils/events';

import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { PODIATRY_ID, TYPES_OF_CARE } from '../../../utils/constants';
import useFormState from '../../../hooks/useFormState';

const pageKey = 'typeOfCare';
const pageTitle = 'Choose the type of care you need';

function TypeOfCarePage({
  hideUpdateAddressAlert,
  addressLine1,
  initialData,
  pageChangeInProgress,
  showPodiatryApptUnavailableModal,
  clickUpdateAddressButton,
  showDirectScheduling,
  showCommunityCare,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  hidePodiatryAppointmentUnavailableModal,
}) {
  const history = useHistory();
  const showUpdateAddressAlert =
    !hideUpdateAddressAlert && (!addressLine1 || addressLine1.match(/^PO Box/));

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();

    if (showUpdateAddressAlert) {
      recordEvent({
        event: 'vaos-update-address-alert-displayed',
      });
    }
  }, []);

  const { data, schema, setData, uiSchema } = useFormState({
    initialSchema: () => {
      const sortedCare = TYPES_OF_CARE.filter(
        typeOfCare => typeOfCare.id !== PODIATRY_ID || showCommunityCare,
      ).sort(
        (careA, careB) =>
          careA.name.toLowerCase() > careB.name.toLowerCase() ? 1 : -1,
      );
      return {
        type: 'object',
        required: ['typeOfCareId'],
        properties: {
          typeOfCareId: {
            type: 'string',
            enum: sortedCare.map(care => care.id || care.ccId),
            enumNames: sortedCare.map(care => care.label || care.name),
          },
        },
      };
    },
    uiSchema: {
      typeOfCareId: {
        'ui:title': 'Please choose a type of care',
        'ui:widget': 'radio',
      },
    },
    initialData,
  });

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
          onSubmit={() => routeToNextAppointmentPage(history, pageKey, data)}
          onChange={newData => {
            // When someone chooses a type of care that can be direct scheduled,
            // kick off the past appointments fetch, which takes a while
            // This could get called multiple times, but the function is memoized
            // and returns the previous promise if it eixsts
            if (showDirectScheduling) {
              getLongTermAppointmentHistory();
            }

            setData(newData);
          }}
          data={data}
        >
          <TypeOfCareAlert />
          <FormButtons
            onBack={() =>
              routeToPreviousAppointmentPage(history, pageKey, data)
            }
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
  const newAppointment = getNewAppointment(state);
  const address = selectVAPResidentialAddress(state);
  return {
    ...address,
    showPodiatryApptUnavailableModal:
      newAppointment.showPodiatryAppointmentUnavailableModal,
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showDirectScheduling: selectFeatureDirectScheduling(state),
    showCommunityCare: selectFeatureCommunityCare(state),
    hideUpdateAddressAlert: newAppointment.hideUpdateAddressAlert,
    pageChangeInProgress: selectPageChangeInProgress(state),
    initialData: getFormData(state),
  };
}

const mapDispatchToProps = {
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
