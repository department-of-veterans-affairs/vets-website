import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { validateCurrentOrFutureDate } from 'platform/forms-system/src/js/validation';
import FormButtons from '../components/FormButtons';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getPreferredDate } from '../utils/selectors';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

const initialSchema = {
  type: 'object',
  required: ['preferredDate'],
  properties: {
    preferredDate: {
      type: 'string',
      format: 'date',
    },
  },
};

const uiSchema = {
  preferredDate: {
    'ui:title': "What is the earliest date you'd like to be seen?",
    'ui:widget': 'date',
    'ui:options': {
      hideLabelText: true,
    },
    'ui:validations': [validateCurrentOrFutureDate],
  },
};

const pageKey = 'preferredDate';

export class PreferredDatePage extends React.Component {
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
    const { schema, data, pageChangeInProgress, typeOfCare } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">
          What is the earliest date you would like to be seen?
        </h1>
        <legend className="schemaform-label vads-u-max-width--none vads-u-margin-bottom--1p5">
          What is the earliest date you'd like to be seen
          {typeOfCare && ` for ${typeOfCare}`}?
          <span className="schemaform-required-span">(*Required)</span>
        </legend>
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
          <div className="vads-u-margin-bottom--2p5 vads-u-margin-top--neg2">
            <AdditionalInfo triggerText="Why does this matter?">
              <ol>
                <li>
                  We can use it to present you something that looks like what
                  you want
                </li>
                <li>
                  It helps us understand how the system is working for Veterans
                </li>
              </ol>
            </AdditionalInfo>
          </div>
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
  return getPreferredDate(state, pageKey);
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
)(PreferredDatePage);
