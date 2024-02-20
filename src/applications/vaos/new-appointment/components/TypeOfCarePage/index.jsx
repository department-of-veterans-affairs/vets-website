import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import recordEvent from 'platform/monitoring/record-event';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import FormButtons from '../../../components/FormButtons';
import PodiatryAppointmentUnavailableModal from './PodiatryAppointmentUnavailableModal';
import UpdateAddressAlert from './UpdateAddressAlert';
import TypeOfCareAlert from './TypeOfCareAlert';
import {
  clickUpdateAddressButton,
  hidePodiatryAppointmentUnavailableModal,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../../redux/actions';
import { selectTypeOfCarePage } from '../../redux/selectors';
import { resetDataLayer } from '../../../utils/events';

import { PODIATRY_ID, TYPES_OF_CARE } from '../../../utils/constants';
import useFormState from '../../../hooks/useFormState';
import { getLongTermAppointmentHistoryV2 } from '../../../services/appointment';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';

const pageKey = 'typeOfCare';
const pageTitle = 'Choose the type of care you need';

export default function TypeOfCarePage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const dispatch = useDispatch();
  const {
    addressLine1,
    hideUpdateAddressAlert,
    initialData,
    pageChangeInProgress,
    showCommunityCare,
    showDirectScheduling,
    showPodiatryApptUnavailableModal,
  } = useSelector(selectTypeOfCarePage, shallowEqual);

  const history = useHistory();
  const showUpdateAddressAlert =
    !hideUpdateAddressAlert && (!addressLine1 || addressLine1.match(/^PO Box/));

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();

      if (showUpdateAddressAlert) {
        recordEvent({
          event: 'vaos-update-address-alert-displayed',
        });
      }
    },
    [showUpdateAddressAlert],
  );

  useEffect(() => {
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
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
        'ui:title': 'What care do you need?',
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
            dispatch(clickUpdateAddressButton());
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
          onSubmit={() =>
            dispatch(routeToNextAppointmentPage(history, pageKey, data))
          }
          onChange={newData => {
            // When someone chooses a type of care that can be direct scheduled,
            // kick off the past appointments fetch, which takes a while
            // This could get called multiple times, but the function is memoized
            // and returns the previous promise if it eixsts
            if (showDirectScheduling) {
              getLongTermAppointmentHistoryV2();
            }

            setData(newData);
          }}
          data={data}
        >
          <TypeOfCareAlert />
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey, data))
            }
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
      <PodiatryAppointmentUnavailableModal
        showModal={showPodiatryApptUnavailableModal}
        onClose={() => dispatch(hidePodiatryAppointmentUnavailableModal())}
      />
    </div>
  );
}

TypeOfCarePage.propTypes = {
  changeCrumb: PropTypes.func,
};
