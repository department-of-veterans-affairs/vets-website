import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash/fp';
import Scroll from 'react-scroll';
import Form from 'react-jsonschema-form';

import { uiSchemaValidate, transformErrors } from './validation';
import Address from './Address';
import FieldTemplate from './FieldTemplate';
import * as reviewWidgets from './review/widgets';
import ReviewFieldTemplate from './review/ReviewFieldTemplate';
import widgets from './widgets/index';
import ProgressButton from '../components/form-elements/ProgressButton';
import ObjectField from './ObjectField';
import ArrayField from './ArrayField';
import ReviewObjectField from './review/ObjectField';
import { focusElement, scrollToFirstError, getActivePages } from '../utils/helpers';
import { setData } from './actions';

const fields = {
  ObjectField,
  ArrayField,
  address: Address
};

const reviewFields = {
  ObjectField: ReviewObjectField,
  ArrayField,
  address: ReviewObjectField
};

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

function focusForm() {
  const legend = document.querySelector('.form-panel legend');
  if (legend && legend.getBoundingClientRect().height > 0) {
    focusElement(legend);
  } else {
    focusElement('.nav-header');
  }
}

/*
 * Each page uses this component and passes in config. This is where most of the page level
 * form logic should live.
 */
class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onError = this.onError.bind(this);
    this.goBack = this.goBack.bind(this);
    this.getEligiblePages = this.getEligiblePages.bind(this);
    this.getEmptyState = this.getEmptyState.bind(this);
    this.transformErrors = this.transformErrors.bind(this);
    this.state = this.getEmptyState(props.route.pageConfig);
  }

  componentDidMount() {
    if (!this.props.reviewPage) {
      scrollToTop();
      focusForm();
    } else if (this.props.reviewPage && this.props.reviewMode) {
      focusForm();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.route.pageConfig.pageKey !== this.props.route.pageConfig.pageKey) {
      this.setState(this.getEmptyState(newProps.route.pageConfig), () => {
        focusForm();
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.pageConfig.pageKey !== this.props.route.pageConfig.pageKey) {
      scrollToTop();
    }
  }

  onChange({ formData }) {
    this.props.setData(this.props.route.pageConfig.pageKey, formData);
  }

  onError() {
    const formContext = _.set('submitted', true, this.state.formContext);
    this.setState({ formContext });
    scrollToFirstError();
  }

  onSubmit() {
    if (this.props.reviewPage) {
      this.props.onSubmit();
    } else {
      const { eligiblePageList, pageIndex } = this.getEligiblePages();
      this.props.router.push(eligiblePageList[pageIndex + 1].path);
    }
  }

  /*
   * Returns the page list without conditional pages that have not satisfied
   * their dependencies and therefore should be skipped.
   */
  getEligiblePages() {
    const { form, route: { pageConfig, pageList } } = this.props;
    const eligiblePageList = getActivePages(pageList, form);
    const pageIndex = _.findIndex(item => item.pageKey === pageConfig.pageKey, eligiblePageList);
    return { eligiblePageList, pageIndex };
  }

  getEmptyState() {
    const { onEdit, hideTitle, route: { pageConfig } } = this.props;
    return {
      formContext: {
        touched: {},
        submitted: false,
        onEdit,
        hideTitle,
        pageTitle: pageConfig.title
      }
    };
  }

  goBack() {
    const { eligiblePageList, pageIndex } = this.getEligiblePages();
    this.props.router.push(eligiblePageList[pageIndex - 1].path);
  }

  transformErrors(errors) {
    return transformErrors(errors, this.props.route.pageConfig.uiSchema);
  }

  validate(formData, errors) {
    const { schema, uiSchema } = this.props.form[this.props.route.pageConfig.pageKey];
    if (uiSchema) {
      uiSchemaValidate(errors, uiSchema, schema, schema.definitions, formData);
    }
    return errors;
  }

  render() {
    const { uiSchema } = this.props.route.pageConfig;
    const { data, schema } = this.props.form[this.props.route.pageConfig.pageKey];
    const { reviewPage, reviewMode, children } = this.props;
    return (
      <div className={reviewPage ? null : 'form-panel'}>
        <Form
            FieldTemplate={reviewMode ? ReviewFieldTemplate : FieldTemplate}
            formContext={this.state.formContext}
            liveValidate
            noHtml5Validate
            onError={this.onError}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            schema={schema}
            uiSchema={uiSchema}
            validate={this.validate}
            showErrorList={false}
            formData={data}
            widgets={reviewMode ? reviewWidgets : widgets}
            fields={reviewMode ? reviewFields : fields}
            transformErrors={this.transformErrors}>
          {children}
          {!children &&
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

const mapDispatchToProps = {
  setData
};

FormPage.propTypes = {
  form: React.PropTypes.object.isRequired,
  route: React.PropTypes.shape({
    pageConfig: React.PropTypes.shape({
      pageKey: React.PropTypes.string.isRequired,
      schema: React.PropTypes.object.isRequired,
      uiSchema: React.PropTypes.object.isRequired,
      errorMessages: React.PropTypes.object
    }),
    pageList: React.PropTypes.arrayOf(React.PropTypes.shape({
      path: React.PropTypes.string.isRequired
    }))
  }),
  reviewMode: React.PropTypes.bool,
  reviewPage: React.PropTypes.bool,
  onSubmit: React.PropTypes.func,
  setData: React.PropTypes.func,
  hideTitle: React.PropTypes.bool
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormPage));

export { FormPage };
