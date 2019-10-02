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
import { LANGUAGES } from './../utils/constants';

const initialSchema = {
  type: 'object',
  required: ['distanceWillingToTravel', 'preferredLanguage'],
  properties: {
    distanceWillingToTravel: {
      type: 'string',
      enum: ['25', '50', '50 or more'],
    },
    preferredLanguage: {
      type: 'string',
      enum: LANGUAGES.map(l => l.value),
    },
  },
};

const uiSchema = {
  distanceWillingToTravel: {
    'ui:title': 'How many miles are you willing to travel for an appointment?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        25: 'Up to 25 miles',
        50: '25 to 50 miles',
        '50 or more': 'Farther than 50 miles',
      },
    },
  },
  preferredLanguage: {
    'ui:title': 'Select your preferred language',
    'ui:options': {
      labels: LANGUAGES.reduce((allLanguages, language) => {
        const result = { ...allLanguages };
        result[language] = language.text;
        return result;
      }),
    },
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
