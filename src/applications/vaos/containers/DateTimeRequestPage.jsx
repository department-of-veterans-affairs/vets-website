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
import FormButtons from '../components/FormButtons';
import { getFormPageInfo } from '../utils/selectors';
import DateTimeRequestField from '../components/DateTimeRequestField';

const pageKey = 'requestDateTime';

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
  componentDidMount() {
    focusElement('h1.vads-u-font-size--h2');
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    if (this.props.data.calendarData?.selectedDates?.length) {
      this.props.routeToNextAppointmentPage(this.props.router, pageKey);
    }
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
      <div className="vaos-form__detailed-radio">
        <h1 className="vads-u-font-size--h2">
          What date and time would you like to make an appointment?
        </h1>
        <p>
          You may choose up to three dates. A scheduling clerk will contact you
          to coordinate the best time for you.
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
