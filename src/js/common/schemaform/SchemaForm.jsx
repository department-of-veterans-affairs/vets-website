import React from 'react';
import _ from 'lodash/fp';
import Form from 'react-jsonschema-form';

import { uiSchemaValidate, transformErrors } from './validation';
import Address from './Address';
import FieldTemplate from './FieldTemplate';
import * as reviewWidgets from './review/widgets';
import ReviewFieldTemplate from './review/ReviewFieldTemplate';
import StringField from './review/StringField';
import widgets from './widgets/index';
import ObjectField from './ObjectField';
import ArrayField from './ArrayField';
import ReviewObjectField from './review/ObjectField';
import { scrollToFirstError } from '../utils/helpers';

const fields = {
  ObjectField,
  ArrayField,
  address: Address
};

const reviewFields = {
  ObjectField: ReviewObjectField,
  ArrayField,
  address: ReviewObjectField,
  StringField
};

/*
 * Each page uses this component and passes in config. This is where most of the page level
 * form logic should live.
 */
class SchemaForm extends React.Component {
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.onError = this.onError.bind(this);
    this.getEmptyState = this.getEmptyState.bind(this);
    this.transformErrors = this.transformErrors.bind(this);
    this.state = this.getEmptyState(props);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.name !== this.props.name) {
      this.setState(this.getEmptyState(newProps));
    }
  }

  onError() {
    const formContext = _.set('submitted', true, this.state.formContext);
    this.setState({ formContext });
    scrollToFirstError();
  }

  getEmptyState() {
    const { onEdit, hideTitle, title } = this.props;
    return {
      formContext: {
        touched: {},
        submitted: false,
        onEdit,
        hideTitle,
        pageTitle: title
      }
    };
  }

  /*
   * This gets the list of JSON Schema errors whenever validation
   * is run
   */
  transformErrors(errors) {
    return transformErrors(errors, this.props.uiSchema);
  }

  validate(formData, errors) {
    const { schema, uiSchema } = this.props;
    if (uiSchema) {
      uiSchemaValidate(errors, uiSchema, schema, schema.definitions, formData);
    }
    return errors;
  }

  render() {
    const {
      data,
      schema,
      uiSchema,
      reviewMode,
      children,
      onSubmit,
      onChange
    } = this.props;
    return (
      <div>
        <Form
            FieldTemplate={reviewMode ? ReviewFieldTemplate : FieldTemplate}
            formContext={this.state.formContext}
            liveValidate
            noHtml5Validate
            onError={this.onError}
            onChange={({ formData }) => onChange(formData)}
            onSubmit={onSubmit}
            schema={schema}
            uiSchema={uiSchema}
            validate={this.validate}
            showErrorList={false}
            formData={data}
            widgets={reviewMode ? reviewWidgets : widgets}
            fields={reviewMode ? reviewFields : fields}
            transformErrors={this.transformErrors}>
          {children}
        </Form>
      </div>
    );
  }
}

SchemaForm.propTypes = {
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  schema: React.PropTypes.object.isRequired,
  uiSchema: React.PropTypes.object.isRequired,
  reviewMode: React.PropTypes.bool,
  onSubmit: React.PropTypes.func,
  onChange: React.PropTypes.func,
  hideTitle: React.PropTypes.bool
};

export default SchemaForm;
