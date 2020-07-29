import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import FormButtons from '../components/FormButtons';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/expressCare';
import { getExpressCareFormPageInfo } from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { EXPRESS_CARE_REASONS } from '../utils/constants';
import RadioTextAreaWidget from '../components/RadioTextAreaWidget';

const pageKey = 'reason';

const initialSchema = {
  type: 'object',
  required: ['reasonForRequest', 'phone', 'email'],
  properties: {
    reasonForRequest: {
      type: 'object',
      required: ['reason'],
      properties: {
        reason: {
          type: 'string',
        },
        additionalDetails: {
          type: 'string',
        },
      },
    },
    phone: {
      type: 'string',
      pattern: '^[0-9]{10}$',
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

const uiSchema = {
  reasonForRequest: {
    'ui:field': RadioTextAreaWidget,
    'ui:description': <h3>text</h3>,
    options: {
      items: EXPRESS_CARE_REASONS.map((r, index) => ({
        id: `express-care-reason-${index}`,
        value: r.reason,
        label: r.reason,
        secondaryLabel: r.secondaryLabel,
      })),
    },
  },
  phone: phoneUI('Phone number'),
  email: {
    'ui:title': 'Email address',
    'ui:description': <h3>text</h3>,
  },
};

class ReasonForExpressCareRequestPage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
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
      <div>
        <h1>Select a reason for your Express Care request</h1>
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
            nextButtonText="Submit Express Care request"
            onBack={this.goBack}
          />
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return getExpressCareFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  openFormPage,
  updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReasonForExpressCareRequestPage);
