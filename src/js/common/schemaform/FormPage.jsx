import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash/fp';
import Scroll from 'react-scroll';

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

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

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
    scrollToTop();
    focusForm();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.pageConfig.pageKey !== this.props.route.pageConfig.pageKey) {
      scrollToTop();
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
    const eligiblePageList = getActivePages(pageList, form.data);
    const pageIndex = _.findIndex(item => item.pageKey === pageConfig.pageKey, eligiblePageList);
    return { eligiblePageList, pageIndex };
  }

  goBack() {
    const { eligiblePageList, pageIndex } = this.getEligiblePages();
    // if we found the current page, go to previous one
    // if not, go back to the beginning because they shouldn't be here
    const page = pageIndex >= 0 ? pageIndex - 1 : 0;
    this.props.router.push(eligiblePageList[page].path);
  }

  render() {
    const { route } = this.props;
    const {
      schema,
      uiSchema
    } = this.props.form.pages[route.pageConfig.pageKey];
    const data = this.props.form.data;
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
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    pageConfig: PropTypes.shape({
      pageKey: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      uiSchema: PropTypes.object.isRequired
    }),
    pageList: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string.isRequired
    }))
  }),
  setData: PropTypes.func
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormPage));

export { FormPage };
