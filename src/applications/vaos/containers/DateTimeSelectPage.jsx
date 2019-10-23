import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import {
  openSelectAppointmentPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { focusElement } from 'platform/utilities/ui';
import FormButtons from '../components/FormButtons';
import { getDateTimeSelect } from '../utils/selectors';
import DateTimeSelectField from '../components/DateTimeSelectField';

const pageKey = 'selectDateTime';

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
              datetime: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

const uiSchema = {
  // 'ui:validations': [
  //   (errors, pageData) => {
  //     errors.calendarData.addError('Error');
  //     debugger;
  //   },
  // ],
  calendarData: {
    'ui:field': DateTimeSelectField,
    'ui:title': 'What date and time would you like to make an appointment?',
    'ui:options': {
      hideLabelText: true,
    },
  },
};

export class DateTimeSelectPage extends React.Component {
  componentDidMount() {
    focusElement('h1.vads-u-font-size--h2');
    this.props.openSelectAppointmentPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const {
      schema,
      data,
      pageChangeInProgress,
      availableSlots,
      availableDates,
      loadingAppointmentSlots,
    } = this.props;

    const title = (
      <h1 className="vads-u-font-size--h2">
        What date and time would you like to make an appointment?
      </h1>
    );

    if (loadingAppointmentSlots) {
      return (
        <div>
          {title}
          <LoadingIndicator message="Finding appointment availability..." />
        </div>
      );
    }

    return (
      <div>
        {title}
        <SchemaForm
          name="Schedule appointment"
          title="Schedule appointment"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData => {
            this.props.updateFormData(pageKey, uiSchema, newData);
          }}
          formContext={{ availableSlots, availableDates }}
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
  return getDateTimeSelect(state, pageKey);
}

const mapDispatchToProps = {
  openSelectAppointmentPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeSelectPage);
