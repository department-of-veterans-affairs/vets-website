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

export class DateTimeRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { validationError: null };
  }

  componentDidMount() {
    focusElement('h1.vads-u-font-size--h2');
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.validationError && this.state.validationError?.length > 0) {
      scrollAndFocus('.usa-input-error-message');
    }

    const prevSelectedSlotsCount =
      prevProps.data.calendarData?.selectedDates?.length || 0;
    const newSelectedSlotsCount =
      this.props.data.calendarData?.selectedDates?.length || 0;

    if (prevSelectedSlotsCount !== newSelectedSlotsCount) {
      this.validate();
    }
  }

  goBack = () => {
    if (!this.state.validationError) {
      this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
    }
  };

  goForward = () => {
    this.validate();
    if (this.userSelectedSlot()) {
      this.props.routeToNextAppointmentPage(this.props.router, pageKey);
    } else {
      scrollAndFocus('.usa-input-error-message');
    }
  };

  validate = () => {
    if (this.userSelectedSlot()) {
      this.setState({ validationError: null });
    } else {
      this.setState({
        validationError:
          'Please select at least once preferred date for your appointment. You can select up to three dates.',
      });
    }
  };

  userSelectedSlot = () =>
    this.props.data.calendarData?.selectedDates?.length > 0;

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
            this.props.updateFormData(pageKey, uiSchema, newData);
          }}
          formContext={{ validationError: this.state.validationError }}
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
