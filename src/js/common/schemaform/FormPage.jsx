import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash/fp';

import SchemaForm from './SchemaForm';
import ProgressButton from '../components/form-elements/ProgressButton';
import { focusElement, getActivePages } from '../utils/helpers';
import { setData } from './actions';

function focusForm() {
  const legend = document.querySelector('.form-panel legend');
  if (legend && legend.getBoundingClientRect().height > 0) {
    focusElement(legend);
  } else {
    focusElement('.nav-header');
  }
}

/*
 * Component for regular form pages (i.e. not on the review page). Handles moving back
 * and forward through pages
 */
class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
    this.getEligiblePages = this.getEligiblePages.bind(this);
  }

  componentDidMount() {
    focusForm();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.pageConfig.pageKey !== this.props.route.pageConfig.pageKey) {
      focusForm();
    }
  }

  onChange(formData) {
    this.props.setData(this.props.route.pageConfig.pageKey, formData);
  }

  onSubmit() {
    const { eligiblePageList, pageIndex } = this.getEligiblePages();
    this.props.router.push(eligiblePageList[pageIndex + 1].path);
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

  goBack() {
    const { eligiblePageList, pageIndex } = this.getEligiblePages();
    this.props.router.push(eligiblePageList[pageIndex - 1].path);
  }

  render() {
    const { route } = this.props;
    const {
      data,
      schema,
      uiSchema
    } = this.props.form[route.pageConfig.pageKey];
    return (
      <div className="form-panel">
        <SchemaForm
            name={route.pageConfig.pageKey}
            title={route.pageConfig.title}
            data={data}
            schema={schema}
            uiSchema={uiSchema}
            onChange={this.onChange}
            onSubmit={this.onSubmit}>
          <div className="row form-progress-buttons schemaform-buttons">
            <div className="small-6 usa-width-five-twelfths medium-5 columns">
              <ProgressButton
                  onButtonClick={this.goBack}
                  buttonText="Back"
                  buttonClass="usa-button-outline"
                  beforeText="«"/>
            </div>
            <div className="small-6 usa-width-five-twelfths medium-5 end columns">
              <ProgressButton
                  submitButton
                  buttonText="Continue"
                  buttonClass="usa-button-primary"
                  afterText="»"/>
            </div>
          </div>
        </SchemaForm>
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
      uiSchema: React.PropTypes.object.isRequired
    }),
    pageList: React.PropTypes.arrayOf(React.PropTypes.shape({
      path: React.PropTypes.string.isRequired
    }))
  }),
  setData: React.PropTypes.func
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormPage));

export { FormPage };
