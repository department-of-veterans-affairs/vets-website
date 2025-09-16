import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { validateWhiteSpace } from '@department-of-veterans-affairs/platform-forms/validations';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import InfoAlert from '../../components/InfoAlert';
import NewTabAnchor from '../../components/NewTabAnchor';
import PostFormFieldContent from '../../components/PostFormFieldContent';
import TextareaWidget from '../../components/TextareaWidget';
import { FACILITY_TYPES, PURPOSE_TEXT_V2 } from '../../utils/constants';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import { getPageTitle } from '../newAppointmentFlow';
import {
  openReasonForAppointment,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateReasonForAppointmentData,
} from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';
import AppointmentsRadioWidget from './AppointmentsRadioWidget';

function isValidComment(value) {
  // exclude the ^ since the caret is a delimiter for MUMPS (Vista)
  if (value !== null) {
    return /^[^|^]+$/g.test(value);
  }
  return true;
}

function validComment(errors, input) {
  if (input && !isValidComment(input)) {
    errors.addError('following special characters are not allowed: ^ |');
  }
  if (input && !/\S/.test(input)) {
    errors.addError('Please provide a response');
  }
}

const initialSchema = {
  default: {
    type: 'object',
    required: ['reasonForAppointment', 'reasonAdditionalInfo'],
    properties: {
      reasonForAppointment: {
        type: 'string',
        enum: PURPOSE_TEXT_V2.map(purpose => purpose.id),
        enumNames: PURPOSE_TEXT_V2.map(purpose => purpose.label),
      },
      reasonAdditionalInfo: {
        type: 'string',
      },
    },
  },
  cc: {
    type: 'object',
    properties: {
      reasonAdditionalInfo: {
        type: 'string',
      },
    },
  },
};

const pageKey = 'reasonForAppointment';

export default function ReasonForAppointmentPage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const dispatch = useDispatch();
  const { schema, data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();
  const isCommunityCare =
    data.facilityType === FACILITY_TYPES.COMMUNITY_CARE.id;
  const pageInitialSchema = isCommunityCare
    ? initialSchema.cc
    : initialSchema.default;
  const uiSchema = {
    default: {
      reasonForAppointment: {
        'ui:widget': AppointmentsRadioWidget,
        'ui:title': pageTitle,
        'ui:errorMessages': {
          required: 'Select a reason for your appointment',
        },
        'ui:options': {
          hideLabelText: true,
        },
      },
      reasonAdditionalInfo: {
        'ui:widget': TextareaWidget,
        'ui:options': {
          hideLabelText: true,
          rows: 5,
        },
        'ui:validations': [validComment],
        'ui:errorMessages': {
          required:
            'Provide more information about why you are requesting this appointment',
        },
      },
    },
    cc: {
      reasonAdditionalInfo: {
        'ui:widget': TextareaWidget,
        'ui:options': {
          hideLabelText: true,
          rows: 5,
        },
        'ui:validations': [validateWhiteSpace],
      },
    },
  };
  const pageUISchema = isCommunityCare ? uiSchema.cc : uiSchema.default;

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      dispatch(
        openReasonForAppointment(pageKey, pageUISchema, pageInitialSchema),
      );
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (schema) {
        focusFormHeader();
      }
    },
    [schema],
  );

  return (
    <div className="vaos-form__radio-field">
      <h1 className="vaos__dynamic-font-size--h2">
        {pageTitle}
        {!isCommunityCare && (
          <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-weight--normal">
            (*Required)
          </span>
        )}
      </h1>
      {!!schema && (
        <SchemaForm
          name="Reason for appointment"
          title="Reason for appointment"
          schema={schema}
          uiSchema={pageUISchema}
          onSubmit={() =>
            dispatch(routeToNextAppointmentPage(history, pageKey))
          }
          onChange={newData =>
            dispatch(
              updateReasonForAppointmentData(pageKey, pageUISchema, newData),
            )
          }
          data={data}
        >
          <PostFormFieldContent>
            <InfoAlert
              status="warning"
              headline="If you have an urgent medical need, please:"
              className="vads-u-margin-y--3"
              level="2"
            >
              <ul>
                <li>
                  Call <VaTelephone contact="911" />,{' '}
                  <span className="vads-u-font-weight--bold">or</span>
                </li>
                <li>
                  Call the Veterans Crisis hotline at{' '}
                  <VaTelephone
                    contact="988"
                    data-testid="crisis-hotline-telephone"
                  />{' '}
                  and select 1,{' '}
                  <span className="vads-u-font-weight--bold">or</span>
                </li>
                <li>
                  Go to your nearest emergency room or VA medical center.{' '}
                  <NewTabAnchor href="/find-locations">
                    Find your nearest VA medical center
                  </NewTabAnchor>
                </li>
              </ul>
            </InfoAlert>
          </PostFormFieldContent>
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
