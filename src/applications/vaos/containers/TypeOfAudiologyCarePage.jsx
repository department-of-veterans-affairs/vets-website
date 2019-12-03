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

const initialSchema = {
  type: 'object',
  required: ['audiologyType'],
  properties: {
    audiologyType: {
      type: 'string',
      enum: ['CCAUDRTNE', 'CCAUDHEAR'],
    },
  },
};

const uiSchema = {
  audiologyType: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {
        CCAUDRTNE: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              Routine hearing exam
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This incudes an office visit for a hearing exam and an evaluation
              using non-invasive tests to check your hearing and inner ear
              health. A routine exam is not meant for any new or sudden changes
              with your hearing or ears.
            </span>
          </>
        ),
        CCAUDHEAR: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              Hearing aid support
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit for Veterans who already have a
              hearing aid and need assistance with this device. This visit is
              for troubleshooting or adjusting a hearing aid to improve
              performance. A hearing aid support visit is not for initial
              evaluation to obtain a hearing aid.
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'audiologyCareType';

export class TypeOfAudiologyCarePage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
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
        <h1 className="vads-u-font-size--h2">
          Choose the type of audiology care you need
        </h1>
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
)(TypeOfAudiologyCarePage);
