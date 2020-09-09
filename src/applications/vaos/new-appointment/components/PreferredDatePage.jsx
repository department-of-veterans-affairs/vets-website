import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';
import { getPreferredDate } from '../../utils/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

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
    'ui:description': 'Please pick a date within the next 13 months.',
    'ui:validations': [
      (errors, preferredDate) => {
        const maxDate = moment().add(13, 'months');
        if (moment(preferredDate).isBefore(moment(), 'day')) {
          errors.addError('Please enter a future date ');
        }
        if (moment(preferredDate).isAfter(maxDate, 'day')) {
          errors.addError(
            'Please enter a date less than 395 days in the future ',
          );
        }
      },
    ],
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
    this.props.routeToPreviousAppointmentPage(this.props.history, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.history, pageKey);
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
              Tell us the earliest day you’re available and we'll try find the
              date closest to your request. Please note that we might not be
              able to find an appointment for that particular day.
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
