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
    const form = this.props.form;
    const {
      data,
      schema,
      uiSchema
    } = form[route.pageConfig.pageKey];

    // Flatten the data from every page to pass to SchemaForm to eventually be
    //  used in uiSchemaValidate()
    // I'd rather not have this here, but console.time() tells me it's executing
    //  locally in 1.49e+12ms on the edu 5495, which is admittedly a relatively
    //  small form, but it shouldn't be a significant hit at any rate.
    const formData = Object.keys(form).reduce((carry, pageName) => {
      if (form[pageName].data) {
        Object.keys(form[pageName].data).forEach((fieldKey) => {
          carry[fieldKey] = form[pageName].data[fieldKey]; // eslint-disable-line
        });
      }
      return carry;
    }, {});

    return (
      <div className="form-panel">
        <SchemaForm
            name={route.pageConfig.pageKey}
            title={route.pageConfig.title}
            pageData={data}
            formData={formData}
            schema={schema}
            uiSchema={uiSchema}
            onChange={this.onChange}
            onSubmit={this.onSubmit}>
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
