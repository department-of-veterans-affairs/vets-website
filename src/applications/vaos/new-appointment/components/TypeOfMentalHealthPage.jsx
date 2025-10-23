import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import { TYPES_OF_MENTAL_HEALTH } from '../../utils/constants';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import { getFormPageInfo } from '../redux/selectors';

import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';
import AppointmentsRadioWidget from './AppointmentsRadioWidget';

const pageKey = 'typeOfMentalHealth';
const pageTitle = 'Which type of mental health care do you need?';

const initialSchema = {
  type: 'object',
  required: ['typeOfMentalHealthId'],
  properties: {
    typeOfMentalHealthId: {
      type: 'string',
      enum: TYPES_OF_MENTAL_HEALTH.map(type => type.id),
    },
  },
};

const uiSchema = {
  typeOfMentalHealthId: {
    'ui:title': pageTitle,
    'ui:widget': AppointmentsRadioWidget,
    'ui:options': {
      classNames: 'vads-u-margin-top--neg2',
      hideLabelText: true,
      labels: {
        [TYPES_OF_MENTAL_HEALTH[0].id]: TYPES_OF_MENTAL_HEALTH[0].name,
        [TYPES_OF_MENTAL_HEALTH[1].id]: TYPES_OF_MENTAL_HEALTH[1].name,
      },
      descriptions: {
        [TYPES_OF_MENTAL_HEALTH[0].id]:
          'Therapy, medication, and other services to help with posttraumatic ' +
          'stress disorder (PTSD), psychological effects of military sexual ' +
          'trauma (MST), depression, grief, anxiety, and other needs.',
        [TYPES_OF_MENTAL_HEALTH[1].id]:
          'Counseling, recovery support, and treatment options for Veterans ' +
          'seeking help with alcohol or other substance use.',
      },
    },
  },
};

export default function TypeOfMentalHealthPage() {
  const dispatch = useDispatch();
  const { schema, data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();
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
          name="Type of mental health care"
          title="Type of mental health care"
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
