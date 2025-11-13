import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import { TYPES_OF_SLEEP_CARE } from '../../utils/constants';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';
import AppointmentsRadioWidget from './AppointmentsRadioWidget';

const pageKey = 'typeOfSleepCare';
const pageTitle = 'Which type of sleep care do you need?';

const initialSchema = {
  type: 'object',
  required: ['typeOfSleepCareId'],
  properties: {
    typeOfSleepCareId: {
      type: 'string',
      enum: TYPES_OF_SLEEP_CARE.map(care => care.id),
    },
  },
};

const uiSchema = {
  typeOfSleepCareId: {
    'ui:title': pageTitle,
    'ui:widget': AppointmentsRadioWidget,
    'ui:options': {
      classNames: 'vads-u-margin-top--neg2',
      hideLabelText: true,
      labels: {
        [TYPES_OF_SLEEP_CARE[0].id]: TYPES_OF_SLEEP_CARE[0].name,
        [TYPES_OF_SLEEP_CARE[1].id]: TYPES_OF_SLEEP_CARE[1].name,
      },
      descriptions: {
        [TYPES_OF_SLEEP_CARE[0].id]:
          'This includes an office visit to set up or fix your CPAP machine. ' +
          'You shouldn’t book a CPAP appointment if you want to schedule a ' +
          'sleep study or if you have an undiagnosed sleep issue.',
        [TYPES_OF_SLEEP_CARE[1].id]:
          'This includes an office visit for the diagnosis and treatment of ' +
          'sleep problems, such as difficulty sleeping or breathing, snoring, ' +
          'teeth grinding, and jaw clenching. You can also choose this type ' +
          'of appointment if you want to schedule a home or lab sleep study.',
      },
    },
  },
};

export default function TypeOfSleepCarePage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { schema, data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  useEffect(() => {
    dispatch(openFormPage(pageKey, uiSchema, initialSchema));
    document.title = `${pageTitle} | Veterans Affairs`;
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
    <div className="vaos-form__radio-field-descriptive">
      <h1 className="vaos__dynamic-font-size--h2">
        {pageTitle}
        <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-weight--normal">
          (*Required)
        </span>
      </h1>
      {!!schema && (
        <SchemaForm
          name="Type of sleep care"
          title="Type of sleep care"
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
