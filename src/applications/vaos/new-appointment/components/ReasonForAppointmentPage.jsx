import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { validateWhiteSpace } from '@department-of-veterans-affairs/platform-forms/validations';
import { useHistory } from 'react-router-dom';
import { VaRadioField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import classNames from 'classnames';
import FormButtons from '../../components/FormButtons';
import { getFormPageInfo } from '../redux/selectors';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import { PURPOSE_TEXT_V2, FACILITY_TYPES } from '../../utils/constants';
import TextareaWidget from '../../components/TextareaWidget';
import PostFormFieldContent from '../../components/PostFormFieldContent';
import NewTabAnchor from '../../components/NewTabAnchor';
import InfoAlert from '../../components/InfoAlert';
import {
  openReasonForAppointment,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateReasonForAppointmentData,
} from '../redux/actions';
import { getPageTitle } from '../newAppointmentFlow';

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
        'ui:widget': 'radio', // Required
        'ui:webComponentField': VaRadioField,
        'ui:title': pageTitle,
        'ui:errorMessages': {
          required: 'Select a reason for your appointment',
        },
        'ui:options': {
          labelHeaderLevel: '1',
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
    <div
      className={classNames('vaos-form__radio-field', {
        'vads-u-margin-top--neg3': !isCommunityCare,
      })}
    >
      {isCommunityCare && (
        <h1 className="vaos__dynamic-font-size--h2">{pageTitle}</h1>
      )}
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
              headline="Only schedule appointments for non-urgent needs"
              className="vads-u-margin-y--3"
              level="2"
            >
              <ul>
                <li>
                  Call <VaTelephone contact="911" />,{' '}
                  <span className="vads-u-font-weight--bold">or</span>
                </li>
                <li>
                  Call
                  {
                    // eslint-disable-next-line @department-of-veterans-affairs/prefer-telephone-component
                    <a href="tel:988">988 and select 1</a>
                  }{' '}
                  for the Veterans Crisis Line,{' '}
                  <span className="vads-u-font-weight--bold">or</span>
                </li>
                <li>
                  Go to your nearest emergency room or{' '}
                  <NewTabAnchor href="/find-locations/?facilityType=urgent_care">
                    urgent care facility (opens in a new tab)
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
