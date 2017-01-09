import React from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash/fp';
import Scroll from 'react-scroll';
import Form from 'react-jsonschema-form';
import { uiSchemaValidate, transformErrors } from './validation';
import FieldTemplate from './FieldTemplate';
import * as widgets from './widgets';
import ProgressButton from '../components/form-elements/ProgressButton';

import { focusElement } from '../utils/helpers';

const fields = {
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
const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

/*
 * Each page uses this component and passes in config. This is where most of the page level
 * form logic should live.
 */
class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onError = this.onError.bind(this);
    this.goBack = this.goBack.bind(this);
    this.transformErrors = this.transformErrors.bind(this);
    this.state = this.getEmptyState(props.route.pageConfig);
  }
  componentDidMount() {
    scrollToTop();
  }
  componentWillReceiveProps(newProps) {
    if (newProps.route.pageConfig !== this.props.route.pageConfig) {
      this.setState(this.getEmptyState(newProps.route.pageConfig));
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.route.pageConfig !== this.props.route.pageConfig) {
      scrollToTop();
    }
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
    const { pageList, pageConfig } = this.props.route;
    const pageIndex = _.findIndex(item => item.pageKey === pageConfig.pageKey, pageList);
    this.props.router.push(pageList[pageIndex + 1].path);
  }
  getEmptyState(pageConfig) {
    return { formData: pageConfig.initialData, formContext: { touched: {}, submitted: false } };
  }
  goBack() {
    const { pageList, pageConfig } = this.props.route;
    const pageIndex = _.findIndex(item => item.pageKey === pageConfig.pageKey, pageList);
    this.props.router.push(pageList[pageIndex - 1].path);
  }
  transformErrors(errors) {
    return transformErrors(errors, this.props.route.pageConfig.errorMessages);
  }
  validate(formData, errors) {
    const { uiSchema } = this.props.route.pageConfig;
    if (uiSchema) {
      uiSchemaValidate(errors, uiSchema, formData);
    }
    return errors;
  }
  render() {
    const { schema, uiSchema } = this.props.route.pageConfig;
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
          transformErrors={this.transformErrors}>
        <div className="row form-progress-buttons schemaform-buttons">
          <div className="small-6 medium-5 columns">
            <ProgressButton
                onButtonClick={this.goBack}
                buttonText="Back"
                buttonClass="usa-button-outline"
                beforeText="«"/>
          </div>
          <div className="small-6 medium-5 end columns">
            <ProgressButton
                submitButton
                buttonText="Continue"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>
      </Form>
    );
  }
}

FormPage.propTypes = {
  route: React.PropTypes.shape({
    pageConfig: React.PropTypes.shape({
      schema: React.PropTypes.object.isRequired,
      uiSchema: React.PropTypes.object.isRequired,
      initialData: React.PropTypes.object.isRequired,
      errorMessages: React.PropTypes.object
    }),
    pageList: React.PropTypes.arrayOf(React.PropTypes.shape({
      path: React.PropTypes.string.isRequired
    }))
  })
};

export default withRouter(FormPage);
