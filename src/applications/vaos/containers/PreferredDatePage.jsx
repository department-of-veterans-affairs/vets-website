import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { validateCurrentOrFutureDate } from 'platform/forms-system/src/js/validation';
import FormButtons from '../components/FormButtons';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getPreferredDate } from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

const initialSchema = {
  type: 'object',
  required: ['preferredDate'],
  properties: {
    preferredDate: {
      type: 'string',
      format: 'date',
    },
  },
};

const uiSchema = {
  preferredDate: {
    'ui:title': 'What is the earliest date you’d like to be seen?',
    'ui:widget': 'date',
    'ui:validations': [validateCurrentOrFutureDate],
  },
};

const pageKey = 'preferredDate';
const pageTitle = 'Tell us when you want to schedule your appointment';

export class PreferredDatePage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle}  | Veterans Affairs`;
    scrollAndFocus();
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        <SchemaForm
          name="Type of appointment"
          title="Type of appointment"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateFormData(pageKey, uiSchema, newData)
          }
          data={data}
        >
          <div className="vads-u-margin-bottom--2p5 vads-u-margin-top--neg2">
            <AdditionalInfo triggerText="Why are you asking me this?">
              If you tell us the earliest date you’re available for your
              appointment, we’ll try to find the closest date to your request.
              Note we might not be able to find the appointment for that
              particular day.
            </AdditionalInfo>
          </div>
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
  return getPreferredDate(state, pageKey);
}

const mapDispatchToProps = {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreferredDatePage);
