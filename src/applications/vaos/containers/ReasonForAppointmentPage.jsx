import React from 'react';
import { connect } from 'react-redux';
import {
  openReasonForAppointment,
  updateReasonForAppointmentData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import { getFormPageInfo } from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { PURPOSE_TEXT, FACILITY_TYPES } from '../utils/constants';
import TextareaWidget from '../components/TextareaWidget';
import { validateWhiteSpace } from 'platform/forms/validations';

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
        expandUnder: 'reasonForAppointment',
        expandUnderCondition: reasonForAppointment => !!reasonForAppointment,
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

export class ReasonForAppointmentPage extends React.Component {
  constructor(props) {
    super(props);

    this.isCommunityCare =
      this.props.data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
    this.uiSchema = this.isCommunityCare ? uiSchema.cc : uiSchema.default;
    this.initialSchema = this.isCommunityCare
      ? initialSchema.cc
      : initialSchema.default;
  }

  componentDidMount() {
    this.props.openReasonForAppointment(
      pageKey,
      this.uiSchema,
      this.initialSchema,
    );

    document.title = `${this.getPageTitle(
      this.isCommunityCare,
    )} | Veterans Affairs`;
    scrollAndFocus();
  }
  getPageTitle = isCommunityCare =>
    isCommunityCare
      ? 'Tell us the reason for this appointment'
      : 'Choose a reason for your appointment';

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.history, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.history, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;
    return (
      <div>
        <h1 className="vads-u-font-size--h2">
          {this.getPageTitle(data.facilityType)}
        </h1>
        <SchemaForm
          name="Reason for appointment"
          title="Reason for appointment"
          schema={schema || this.initialSchema}
          uiSchema={this.uiSchema}
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateReasonForAppointmentData(
              pageKey,
              this.uiSchema,
              newData,
            )
          }
          data={data}
        >
          <AlertBox
            status="warning"
            headline="If you have an urgent medical need, please:"
            className="vads-u-margin-y--3"
            content={
              <ul>
                <li>
                  Call <a href="tel:911">911</a>,{' '}
                  <span className="vads-u-font-weight--bold">or</span>
                </li>
                <li>
                  Call the Veterans Crisis hotline at{' '}
                  <a href="tel:8002738255">800-273-8255</a> and press 1,{' '}
                  <span className="vads-u-font-weight--bold">or</span>
                </li>
                <li>
                  Go to your nearest emergency room or VA medical center.{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="/find-locations"
                  >
                    Find your nearest VA medical center
                  </a>
                </li>
              </ul>
            }
          />
          <FormButtons
            onBack={this.goBack}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openReasonForAppointment,
  updateReasonForAppointmentData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReasonForAppointmentPage);
