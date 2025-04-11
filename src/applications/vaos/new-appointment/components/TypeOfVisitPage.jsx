import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaRadioField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import FormButtons from '../../components/FormButtons';
import { getFormPageInfo, getNewAppointment } from '../redux/selectors';
import { FLOW_TYPES, TYPE_OF_VISIT } from '../../utils/constants';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';
import { getPageTitle } from '../newAppointmentFlow';

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
      'ui:widget': 'radio', // Required
      'ui:webComponentField': VaRadioField,
      'ui:title': pageTitle,
      'ui:errorMessages': {
        required: 'Select an option',
      },
      'ui:options': {
        labelHeaderLevel: '1',
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
    <div className="vads-u-margin-top--neg3">
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
