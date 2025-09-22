import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';
import AppointmentsRadioWidget from './AppointmentsRadioWidget';

const pageKey = 'audiologyCareType';
const pageTitle = 'Which type of audiology care do you need?';

const initialSchema = {
  type: 'object',
  required: ['audiologyType'],
  properties: {
    audiologyType: {
      type: 'string',
      enum: ['CCAUDRTNE', 'CCAUDHEAR'],
    },
  },
};

const uiSchema = {
  audiologyType: {
    'ui:title': pageTitle,
    'ui:widget': AppointmentsRadioWidget,
    'ui:options': {
      classNames: 'vads-u-margin-top--neg2',
      hideLabelText: true,
      labels: {
        CCAUDRTNE: 'Routine hearing exam',
        CCAUDHEAR: 'Hearing aid support',
      },
      descriptions: {
        CCAUDRTNE:
          'This includes an office visit for a hearing exam and an evaluation ' +
          'using non-invasive tests to check your hearing and inner ear ' +
          'health. A routine exam is not meant for any new or sudden changes ' +
          'with your hearing or ears.',
        CCAUDHEAR:
          'This includes an office visit for Veterans who already have a ' +
          'hearing aid and need assistance with this device. This visit is ' +
          'for troubleshooting or adjusting a hearing aid to improve ' +
          'performance. A hearing aid support visit is not for initial ' +
          'evaluation to obtain a hearing aid.',
      },
    },
  },
};

export default function TypeOfAudiologyCarePage() {
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
