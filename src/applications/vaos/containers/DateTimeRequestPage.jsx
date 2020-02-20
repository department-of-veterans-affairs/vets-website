import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { focusElement } from 'platform/utilities/ui';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import FormButtons from '../components/FormButtons';
import { getFormPageInfo } from '../utils/selectors';
import DateTimeRequestField from '../components/DateTimeRequestField';

const pageKey = 'requestDateTime';
const pageTitle = 'Choose a day and time for your appointment';

const initialSchema = {
  type: 'object',
  required: ['calendarData'],
  properties: {
    calendarData: {
      type: 'object',
      properties: {
        currentlySelectedDate: {
          type: 'string',
        },
        currentRowIndex: {
          type: 'number',
        },
        selectedDates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
              },
              optionTime: {
                type: 'string',
                enum: ['AM', 'PM'],
              },
            },
          },
        },
      },
    },
  },
};

const uiSchema = {
  calendarData: {
    'ui:field': DateTimeRequestField,
    'ui:title': 'What date and time would you like to make an appointment?',
    'ui:options': {
      hideLabelText: true,
    },
  },
};

const missingDateError =
  'Please select at least one preferred date for your appointment. You can select up to three dates.';

export class DateTimeRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      validationError: this.userSelectedSlot(props.data)
        ? null
        : missingDateError,
    };
  }

  componentDidMount() {
    focusElement('h1.vads-u-font-size--h2');
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.validationError &&
      !prevState.submitted &&
      this.state.submitted
    ) {
      scrollAndFocus('.usa-input-error-message');
    }
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    if (this.userSelectedSlot(this.props.data)) {
      this.props.routeToNextAppointmentPage(this.props.router, pageKey);
    } else if (this.state.submitted) {
      scrollAndFocus('.usa-input-error-message');
    } else {
      this.setState({ submitted: true });
    }
  };

  validate = data => {
    if (this.userSelectedSlot(data)) {
      this.setState({ validationError: null });
    } else {
      this.setState({
        validationError: missingDateError,
      });
    }
  };

  userSelectedSlot(data) {
    return data.calendarData?.selectedDates?.length > 0;
  }

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
      <div className="vaos-form__detailed-radio">
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        <p>
          You can choose up to 3 dates. A scheduling coordinator will call you
          to schedule the best time for your appointment.
        </p>
        <SchemaForm
          name="Request appointment"
          title="Request appointment"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData => {
            this.validate(newData);
            this.props.updateFormData(pageKey, uiSchema, newData);
          }}
          formContext={{
            validationError: this.state.submitted
              ? this.state.validationError
              : null,
          }}
          data={data}
        >
          <FormButtons
            onBack={this.goBack}
            pageChangeInProgress={pageChangeInProgress}
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
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeRequestPage);
