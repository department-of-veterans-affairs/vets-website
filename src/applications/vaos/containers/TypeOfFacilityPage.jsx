import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import { FACILITY_TYPES } from '../utils/constants';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';

const initialSchema = {
  type: 'object',
  required: ['facilityType'],
  properties: {
    facilityType: {
      type: 'string',
      enum: Object.keys(FACILITY_TYPES).map(key => FACILITY_TYPES[key]),
    },
  },
};

const uiSchema = {
  facilityType: {
    'ui:title':
      'You’re eligible to see either a VA provider or Community Care provider for this type of care.',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        [FACILITY_TYPES.VAMC]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              VA medical center or clinic
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              Go to a VA medical center or clinic for this appointment
            </span>
          </>
        ),
        [FACILITY_TYPES.COMMUNITY_CARE]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              Community Care facility
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              Go to a Community Care facility near your home
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'typeOfFacility';
const pageTitle = 'Choose where you want to receive your care';

export class TypeOfFacilityPage extends React.Component {
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
      <div className="vaos-form__facility-type vaos-form__detailed-radio">
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
)(TypeOfFacilityPage);
