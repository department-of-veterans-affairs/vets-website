import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { validateWhiteSpace } from 'platform/forms/validations';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import { getFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
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
import {
  selectFeatureVAOSServiceRequests,
  selectFeatureBreadcrumbUrlUpdate,
} from '../../redux/selectors';

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

const uiSchema = {
  default: {
    reasonForAppointment: {
      'ui:widget': 'radio',
      'ui:title': 'Let us know why you’re making this appointment.',
      'ui:errorMessages': {
        required: 'Select a reason for your appointment',
      },
    },
    reasonAdditionalInfo: {
      'ui:widget': TextareaWidget,
      'ui:options': {
        rows: 5,
      },
      'ui:validations': [validComment],
      'ui:errorMessages': {
        required:
          'Provide more details about why you are requesting this appointment',
      },
    },
  },
  cc: {
    reasonAdditionalInfo: {
      'ui:widget': TextareaWidget,
      'ui:title':
        'Please let us know any additional details about your symptoms that may be helpful for the community health provider to know. (Optional)',
      'ui:options': {
        rows: 5,
      },
      'ui:validations': [validateWhiteSpace],
    },
  },
};

const pageKey = 'reasonForAppointment';

export default function ReasonForAppointmentPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const dispatch = useDispatch();
  const { schema, data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();
  const isCommunityCare = data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
  const pageUISchema = isCommunityCare ? uiSchema.cc : uiSchema.default;
  const pageInitialSchema = isCommunityCare
    ? initialSchema.cc
    : initialSchema.default;
  const pageTitle = isCommunityCare
    ? 'Tell us the reason for this appointment'
    : 'Choose a reason for this appointment';
  const useV2 = useSelector(state => selectFeatureVAOSServiceRequests(state));

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    dispatch(
      openReasonForAppointment(pageKey, pageUISchema, pageInitialSchema, useV2),
    );
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
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
              updateReasonForAppointmentData(
                pageKey,
                pageUISchema,
                newData,
                useV2,
              ),
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

ReasonForAppointmentPage.propTypes = {
  changeCrumb: PropTypes.func,
};
