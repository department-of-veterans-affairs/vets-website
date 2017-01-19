import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash/fp';
import Scroll from 'react-scroll';
import Form from 'react-jsonschema-form';

import { uiSchemaValidate, transformErrors } from './validation';
import FieldTemplate from './FieldTemplate';
import * as reviewWidgets from './review/widgets';
import ReviewFieldTemplate from './review/ReviewFieldTemplate';
import widgets from './widgets/index';
import ProgressButton from '../components/form-elements/ProgressButton';
import ObjectField from './ObjectField';
import ReviewObjectField from './review/ObjectField';
import { focusElement } from '../utils/helpers';
import { setValid, setData } from './actions';

const fields = {
  ObjectField
};

const reviewFields = {
  ObjectField: ReviewObjectField
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
    this.onSubmit = this.onSubmit.bind(this);
    this.onError = this.onError.bind(this);
    this.goBack = this.goBack.bind(this);
    this.getEmptyState = this.getEmptyState.bind(this);
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
    this.props.setData(this.props.route.pageConfig.pageKey, formData);
    const formContext = _.set('formData', formData, this.state.formContext);
    this.setState({ formContext });
  }
  onError() {
    const formContext = _.set('submitted', true, this.state.formContext);
    this.setState({ formContext });
    scrollToFirstError();
  }
  onSubmit() {
    this.props.setValid(this.props.route.pageConfig.pageKey, true);
    if (this.props.reviewPage) {
      this.props.onSubmit();
    } else {
      const { pageList, pageConfig } = this.props.route;
      const pageIndex = _.findIndex(item => item.pageKey === pageConfig.pageKey, pageList);
      this.props.router.push(pageList[pageIndex + 1].path);
    }
  }
  getEmptyState(pageConfig) {
    const { form, onEdit, hideTitle } = this.props;
    const formData = form[pageConfig.pageKey].data;
    return { formContext: { touched: {}, submitted: false, onEdit, hideTitle, formData } };
  }
  goBack() {
    const { pageList, pageConfig } = this.props.route;
    const pageIndex = _.findIndex(item => item.pageKey === pageConfig.pageKey, pageList);
    this.props.router.push(pageList[pageIndex - 1].path);
  }
  transformErrors(errors) {
    return transformErrors(errors, this.props.route.pageConfig.uiSchema);
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
    const formData = this.props.form[this.props.route.pageConfig.pageKey].data;
    const { reviewPage, reviewMode } = this.props;
    return (
      <Form
          FieldTemplate={reviewMode ? ReviewFieldTemplate : FieldTemplate}
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
          formData={formData}
          widgets={reviewMode ? reviewWidgets : widgets}
          fields={reviewMode ? reviewFields : fields}
          transformErrors={this.transformErrors}>
        {reviewPage && !reviewMode &&
          <ProgressButton
              submitButton
              buttonText="Update page"
              buttonClass="usa-button-primary"/>}
        {!reviewPage &&
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
          </div>}
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

const mapDispatchToProps = {
  setData,
  setValid
};

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
  }),
  reviewMode: React.PropTypes.bool,
  reviewPage: React.PropTypes.bool,
  onSubmit: React.PropTypes.func,
  hideTitle: React.PropTypes.bool
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormPage));
