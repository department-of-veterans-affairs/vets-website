import React from 'react';
import { connect } from 'react-redux';
import { openFormPage, updateFormData } from '../actions/newAppointment.js';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import { TYPES_OF_CARE } from '../utils/constants';
import TypeOfCareField from '../components/TypeOfCareField';

const initialSchema = {
  type: 'object',
  required: ['typeOfCareId'],
  properties: {
    typeOfCareId: {
      type: 'string',
      enum: TYPES_OF_CARE.map(care => care.id || care.ccId),
    },
  },
};

const uiSchema = {
  typeOfCareId: {
    'ui:title': 'What type of care do you need?',
    'ui:field': TypeOfCareField,
    'ui:options': {
      hideLabelText: true,
    },
  },
};

const pageKey = 'type-of-care';

export class TypeOfCarePage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.router.push('/');
  };

  goForward = () => {
    this.props.router.push('/new-appointment/contact-info');
  };

  render() {
    const { schema, data } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">
          Choose the type of care you need
        </h1>
        <SchemaForm
          name="Type of care"
          title="Type of care"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateFormData(pageKey, uiSchema, newData)
          }
          data={data}
        >
          <div className="vads-l-row form-progress-buttons schemaform-buttons">
            <div className="vads-l-col--6 vads-u-padding-right--2p5">
              <ProgressButton
                onButtonClick={this.goBack}
                buttonText="Back"
                buttonClass="usa-button-secondary vads-u-width--full"
                beforeText="«"
              />
            </div>
            <div className="vads-l-col--6">
              <ProgressButton
                submitButton
                buttonText="Continue"
                buttonClass="usa-button-primary"
                afterText="»"
              />
            </div>
          </div>
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    schema: state.newAppointment.pages[pageKey] || initialSchema,
    data: state.newAppointment.data,
  };
}

const mapDispatchToProps = {
  openFormPage,
  updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TypeOfCarePage);
