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
import { LANGUAGES, DISTANCES } from './../utils/constants';

const initialSchema = {
  type: 'object',
  required: ['distanceWillingToTravel', 'preferredLanguage'],
  properties: {
    distanceWillingToTravel: {
      type: 'string',
      enum: DISTANCES.map(dist => dist.id),
      enumNames: DISTANCES.map(dist => dist.name),
    },
    preferredLanguage: {
      type: 'string',
      enum: LANGUAGES.map(l => l.id),
      enumNames: LANGUAGES.map(l => l.text),
    },
  },
};

const uiSchema = {
  distanceWillingToTravel: {
    'ui:title': 'How many miles are you willing to travel for an appointment?',
    'ui:widget': 'radio',
  },
  preferredLanguage: {
    'ui:title': 'Select your preferred language',
  },
};

const pageKey = 'ccPreferences';

export class CommunityCarePreferencesPage extends React.Component {
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
      <div>
        <h1 className="vads-u-font-size--h2">
          Share your community care provider preferences (2/2)
        </h1>
        <SchemaForm
          name="Community care preferences"
          title="Community care preferences"
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
)(CommunityCarePreferencesPage);
