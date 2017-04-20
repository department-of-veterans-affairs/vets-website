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
import TitleField from './TitleField';
import ReviewObjectField from './review/ObjectField';
import { scrollToFirstError } from '../utils/helpers';

const fields = {
  ObjectField,
  ArrayField,
  address: Address,
  TitleField
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
    this.onBlur = this.onBlur.bind(this);
    this.setTouched = this.setTouched.bind(this);
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

  onBlur(id) {
    if (!this.state.formContext.touched[id]) {
      const formContext = _.set(['touched', id], true, this.state.formContext);
      this.setState({ formContext });
    }
  }

  getEmptyState() {
    const { onEdit, hideTitle, title } = this.props;
    return {
      formContext: {
        touched: {},
        submitted: false,
        onEdit,
        hideTitle,
        setTouched: this.setTouched,
        pageTitle: title
      }
    };
  }

  setTouched(touchedItem, setStateCallback) {
    const touched = _.merge(this.state.formContext.touched, touchedItem);
    const formContext = _.set('touched', touched, this.state.formContext);
    this.setState({ formContext }, setStateCallback);
  }

  /*
   * This gets the list of JSON Schema errors whenever validation
   * is run
   */
  transformErrors(errors) {
    return transformErrors(errors, this.props.uiSchema);
  }

  validate(pageData, formData, errors) {
    const { schema, uiSchema } = this.props;
    if (uiSchema) {
      console.log('SchemaForm -> validate() -> pageData:', pageData); // eslint-disable-line no-console
      uiSchemaValidate(errors, uiSchema, schema, pageData, formData);
    }
    return errors;
  }

  render() {
    const {
      pageData, // Unfortunately, Form calls this formData, but don't be confused,
      formData,
      schema,
      uiSchema,
      reviewMode,
      children,
      onSubmit,
      onChange,
      safeRenderCompletion
    } = this.props;
    console.log('SchemaForm -> render() -> pageData:', pageData); // eslint-disable-line no-console

    return (
      <div>
        <Form
            safeRenderCompletion={safeRenderCompletion}
            FieldTemplate={reviewMode ? ReviewFieldTemplate : FieldTemplate}
            formContext={this.state.formContext}
            liveValidate
            noHtml5Validate
            onError={this.onError}
            onBlur={this.onBlur}
            onChange={({ newData }) => onChange(newData)}
            onSubmit={onSubmit}
            schema={schema}
            uiSchema={uiSchema}
            validate={(pData, errors) => this.validate(pData, formData, errors)}
            showErrorList={false}
            formData={pageData}
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
