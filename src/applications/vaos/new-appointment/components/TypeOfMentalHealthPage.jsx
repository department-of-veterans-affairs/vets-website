import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import { TYPES_OF_MENTAL_HEALTH } from '../../utils/constants';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import { getFormPageInfo } from '../redux/selectors';
import {
  selectFeaturePCMHI,
  selectFeatureSubstanceUseDisorder,
} from '../../redux/selectors';

import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';
import AppointmentsRadioWidget from './AppointmentsRadioWidget';

const pageKey = 'typeOfMentalHealth';
const pageTitle = 'Which type of mental health care do you need?';

export default function TypeOfMentalHealthPage() {
  const dispatch = useDispatch();
  const featurePCMHI = useSelector(selectFeaturePCMHI);
  const featureSUD = useSelector(selectFeatureSubstanceUseDisorder);

  let supportedTypesOfMentalHealth = [...TYPES_OF_MENTAL_HEALTH];
  if (!featurePCMHI) {
    supportedTypesOfMentalHealth = supportedTypesOfMentalHealth.filter(
      type => type.id !== '534',
    );
  }
  if (!featureSUD) {
    supportedTypesOfMentalHealth = supportedTypesOfMentalHealth.filter(
      type => type.id !== '513',
    );
  }

  const initialSchema = {
    type: 'object',
    required: ['typeOfMentalHealthId'],
    properties: {
      typeOfMentalHealthId: {
        type: 'string',
        enum: supportedTypesOfMentalHealth.map(type => type.id),
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
        labels: supportedTypesOfMentalHealth.reduce((acc, care) => {
          acc[care.id] = care.name;
          return acc;
        }, {}),
        descriptions: supportedTypesOfMentalHealth.reduce((acc, care) => {
          acc[care.id] = care.description;
          return acc;
        }, {}),
      },
    },
  };

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
