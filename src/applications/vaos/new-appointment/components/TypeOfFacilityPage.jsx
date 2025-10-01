import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import { FACILITY_TYPES } from '../../utils/constants';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import { getPageTitle } from '../newAppointmentFlow';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  startDirectScheduleFlow,
  updateFormData,
} from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';
import AppointmentsRadioWidget from './AppointmentsRadioWidget';

const facilityTypesValues = Object.values(FACILITY_TYPES);

const initialSchema = {
  type: 'object',
  required: ['facilityType'],
  properties: {
    facilityType: {
      type: 'string',
      enum: facilityTypesValues.map(type => type.id),
      enumNames: facilityTypesValues.map(type => type.name),
    },
  },
};

const pageKey = 'typeOfFacility';

export default function TypeOfFacilityPage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const uiSchema = {
    facilityType: {
      'ui:title': pageTitle,
      'ui:widget': AppointmentsRadioWidget,
      'ui:options': {
        classNames: 'vads-u-margin-top--neg2',
        hideLabelText: true,
      },
    },
  };

  const dispatch = useDispatch();
  const { schema, data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();
  useEffect(() => {
    dispatch(openFormPage(pageKey, uiSchema, initialSchema));
    document.title = `${pageTitle} | Veterans Affairs`;
    dispatch(startDirectScheduleFlow({ isRecordEvent: false }));
  }, []);

  useEffect(
    () => {
      if (schema) {
        focusFormHeader();
      }
    },
    [schema],
  );

  return (
    <div className="vaos-form__facility-type">
      <h1 className="vaos__dynamic-font-size--h2">
        {pageTitle}
        <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-weight--normal">
          (*Required)
        </span>
      </h1>
      {!!schema && (
        <SchemaForm
          name="Type of appointment"
          title="Type of appointment"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() =>
            dispatch(routeToNextAppointmentPage(history, pageKey))
          }
          onChange={newData =>
            dispatch(updateFormData(pageKey, uiSchema, newData))
          }
          data={data}
        >
          <va-additional-info
            trigger="What to know about scheduling at community care facilities"
            class="vads-u-margin-bottom--4"
          >
            <div>
              If you select community care, we’ll ask for your preferred date,
              timeframe, and provider. Then we’ll contact you to finish
              scheduling your appointment.
            </div>
          </va-additional-info>

          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey))
            }
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}
