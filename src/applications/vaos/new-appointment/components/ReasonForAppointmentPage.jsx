import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { validateWhiteSpace } from 'platform/forms/validations';
import * as actions from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { getFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { PURPOSE_TEXT, FACILITY_TYPES } from '../../utils/constants';
import TextareaWidget from '../../components/TextareaWidget';
import { useHistory } from 'react-router-dom';
import PostFormFieldContent from '../../components/PostFormFieldContent';
import NewTabAnchor from '../../components/NewTabAnchor';

const initialSchema = {
  default: {
    type: 'object',
    required: ['reasonForAppointment', 'reasonAdditionalInfo'],
    properties: {
      reasonForAppointment: {
        type: 'string',
        enum: PURPOSE_TEXT.map(purpose => purpose.id),
        enumNames: PURPOSE_TEXT.map(purpose => purpose.label),
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
      'ui:title': 'Please let us know why you’re making this appointment.',
    },
    reasonAdditionalInfo: {
      'ui:widget': TextareaWidget,
      'ui:options': {
        rows: 5,
      },
      'ui:validations': [validateWhiteSpace],
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

function ReasonForAppointmentPage({
  data,
  openReasonForAppointment,
  pageChangeInProgress,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  schema,
  updateReasonForAppointmentData,
}) {
  const history = useHistory();
  const isCommunityCare = data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
  const pageUISchema = isCommunityCare ? uiSchema.cc : uiSchema.default;
  const pageInitialSchema = isCommunityCare
    ? initialSchema.cc
    : initialSchema.default;
  const pageTitle = isCommunityCare
    ? 'Tell us the reason for this appointment'
    : 'Choose a reason for your appointment';
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    openReasonForAppointment(pageKey, pageUISchema, pageInitialSchema);
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
          onSubmit={() => routeToNextAppointmentPage(history, pageKey)}
          onChange={newData =>
            updateReasonForAppointmentData(pageKey, pageUISchema, newData)
          }
          data={data}
        >
          <PostFormFieldContent>
            <AlertBox
              status="warning"
              headline="If you have an urgent medical need, please:"
              className="vads-u-margin-y--3"
              level="2"
              content={
                <ul>
                  <li>
                    Call <Telephone contact={CONTACTS['911']} />,{' '}
                    <span className="vads-u-font-weight--bold">or</span>
                  </li>
                  <li>
                    Call the Veterans Crisis hotline at{' '}
                    <Telephone contact={CONTACTS.CRISIS_LINE} /> and press 1,{' '}
                    <span className="vads-u-font-weight--bold">or</span>
                  </li>
                  <li>
                    Go to your nearest emergency room or VA medical center.{' '}
                    <NewTabAnchor href="/find-locations">
                      Find your nearest VA medical center
                    </NewTabAnchor>
                  </li>
                </ul>
              }
            />
          </PostFormFieldContent>
          <FormButtons
            onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openReasonForAppointment: actions.openReasonForAppointment,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  updateReasonForAppointmentData: actions.updateReasonForAppointmentData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReasonForAppointmentPage);
