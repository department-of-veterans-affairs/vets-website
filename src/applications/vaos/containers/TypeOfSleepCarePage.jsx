import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { TYPES_OF_SLEEP_CARE } from '../utils/constants';

const initialSchema = {
  type: 'object',
  required: ['typeOfSleepCareId'],
  properties: {
    typeOfSleepCareId: {
      type: 'string',
      enum: TYPES_OF_SLEEP_CARE.map(care => care.id),
    },
  },
};

const uiSchema = {
  typeOfSleepCareId: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {
        [TYPES_OF_SLEEP_CARE[0].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_SLEEP_CARE[0].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit to set up or fix your CPAP machine.
              You shouldn’t book a CPAP appointment if you want to schedule a
              sleep study or if you have an undiagnosed sleep issue.{' '}
            </span>
          </>
        ),
        [TYPES_OF_SLEEP_CARE[1].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_SLEEP_CARE[1].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit for the diagnosis and treatment of
              sleep problems, such as difficulty sleeping or breathing, snoring,
              teeth grinding, and jaw clenching. You can also choose this type
              of appointment if you want to schedule a home or lab sleep study.
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'typeOfSleepCare';
const pageTitle = 'Choose the type of sleep care you need';

export class TypeOfSleepCarePage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
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
      <div className="vaos-form__detailed-radio">
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        <SchemaForm
          name="Type of sleep care"
          title="Type of sleep care"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateFormData(pageKey, uiSchema, newData)
          }
          data={data}
        >
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
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TypeOfSleepCarePage);
