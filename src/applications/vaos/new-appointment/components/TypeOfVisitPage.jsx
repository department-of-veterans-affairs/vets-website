import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import { FLOW_TYPES, TYPE_OF_VISIT } from '../../utils/constants';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import { getPageTitle } from '../newAppointmentFlow';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';
import { getFormPageInfo, getNewAppointment } from '../redux/selectors';
import AppointmentsRadioWidget from './AppointmentsRadioWidget';

const pageKey = 'visitType';

export default function TypeOfVisitPage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const { schema, data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const { flowType } = useSelector(getNewAppointment);

  const uiSchema = {
    visitType: {
      'ui:title': pageTitle,
      'ui:widget': AppointmentsRadioWidget,
      'ui:errorMessages': {
        required: 'Select an option',
      },
      'ui:options': {
        classNames: 'vads-u-margin-top--neg2',
        hideLabelText: true,
      },
    },
  };

  const initialSchema = {
    type: 'object',
    required: ['visitType'],
    properties: {
      visitType: {
        type: 'string',
        enum: TYPE_OF_VISIT.map(v => v.id),
        enumNames: TYPE_OF_VISIT.map(v => {
          if (FLOW_TYPES.DIRECT === flowType) return v.name;

          // Request flow
          return v.name2;
        }),
      },
    },
  };

  const dispatch = useDispatch();
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
    <div>
      <h1 className="vaos__dynamic-font-size--h2">
        {pageTitle}
        <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-weight--normal">
          (*Required)
        </span>
      </h1>
      {!!schema && (
        <SchemaForm
          name="Type of visit"
          title="Type of visit"
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
