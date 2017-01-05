import React from 'react';
import _ from 'lodash/fp';
import Scroll from 'react-scroll';
import Form from 'react-jsonschema-form';
import { uiSchemaValidate, transformErrors } from './validation';
import FieldTemplate from './FieldTemplate';
import * as widgets from './widgets';
import DateField from './DateField';
import ExpandableField from './ExpandableField';
import ArrayField from './ArrayField';

import { focusElement } from '../utils/helpers';

const fields = {
  mydate: DateField,
  expandableGroup: ExpandableField,
  ArrayField
};

const scrollToFirstError = () => {
  setTimeout(() => {
    const errorEl = document.querySelector('.usa-input-error, .input-error-date');
    if (errorEl) {
      const position = errorEl.getBoundingClientRect().top + document.body.scrollTop;
      Scroll.animateScroll.scrollTo(position - 10, {
        duration: 500,
        delay: 0,
        smooth: true
      });
      focusElement(errorEl);
    }
  }, 100);
};

export default class FormPage extends React.Component {
  static getExternalData(state) {
    return {
      neededData: state.otherForm.someData
    };
  }
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onError = this.onError.bind(this);
    this.state = { formData: props.formData, formContext: { touched: {}, submitted: false } };
  }
  onBlur(id) {
    const formContext = _.set(['touched', id], true, this.state.formContext);
    this.setState({ formContext });
  }
  onChange({ formData }) {
    this.setState({ formData });
  }
  onError() {
    const formContext = _.set('submitted', true, this.state.formContext);
    this.setState({ formContext });
    scrollToFirstError();
  }
  onSubmit() {
    console.log('Hooray!');
  }
  validate(formData, errors) {
    if (this.props.uiSchema) {
      uiSchemaValidate(errors, this.props.uiSchema, formData);
    }
    return errors;
  }
  render() {
    const { schema, uiSchema } = this.props;
    return (
      <Form
          FieldTemplate={FieldTemplate}
          formContext={this.state.formContext}
          liveValidate
          noHtml5Validate
          onError={this.onError}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          schema={schema}
          uiSchema={uiSchema}
          validate={this.validate}
          showErrorList={false}
          formData={this.state.formData}
          widgets={widgets}
          fields={fields}
          transformErrors={(errors) => transformErrors(errors, this.props.errorMessages)}/>
    );
  }
}

FormPage.propTypes = {
  schema: React.PropTypes.object.isRequired,
  uiSchema: React.PropTypes.object.isRequired,
  formData: React.PropTypes.object.isRequired,
  errorMessages: React.PropTypes.object,
  validations: React.PropTypes.object,
  validate: React.PropTypes.func,
  onSubmit: React.PropTypes.func.isRequired
};
