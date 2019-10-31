import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import {
  openFormPage,
  updateFormData,
  openTypeOfFacilityPage,
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
    this.props.openTypeOfFacilityPage(
      pageKey,
      uiSchema,
      initialSchema,
      this.props.data.typeOfCareId,
      this.props.router,
    );
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    if (pageChangeInProgress) {
      return (
        <div>
          <LoadingIndicator message="Finding your VA facility..." />
        </div>
      );
    }

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
  return {
    ...getFormPageInfo(state, pageKey),
    pageChangeInProgress: state.newAppointment?.pageChangeInProgress,
  };
}

const mapDispatchToProps = {
  openFormPage,
  openTypeOfFacilityPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TypeOfFacilityPage);
