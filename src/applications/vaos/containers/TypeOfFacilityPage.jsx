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
  required: ['facilityType'],
  properties: {
    facilityType: {
      type: 'string',
      enum: ['vamc', 'communityCare'],
    },
  },
};

const uiSchema = {
  facilityType: {
    'ui:title':
      'You are eligible to see either a VA provider or community care provider for this type of service.',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        vamc: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              VA medical center or clinic
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              Go to a VA medical center or clinic for this appointment
            </span>
          </>
        ),
        communityCare: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              Community care facility
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              Go to a community care facility near your home
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'typeOfFacility';

export class TypeOfFacilityPage extends React.Component {
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
      <div className="vaos-form__facility-type vaos-form__detailed-radio">
        <h1 className="vads-u-font-size--h2">
          Choose where you would prefer to receive your care
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
)(TypeOfFacilityPage);
