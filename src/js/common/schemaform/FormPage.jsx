import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash/fp';
import Scroll from 'react-scroll';

import SchemaForm from './SchemaForm';
import SaveFormLink from './SaveFormLink';
import ProgressButton from '../components/form-elements/ProgressButton';
import { focusElement, getActivePages } from '../utils/helpers';
import { expandArrayPages } from './helpers';
import { setData } from './actions';
import { SAVE_STATUSES, saveInProgressForm } from './save-load-actions';

import { updateLogInUrl } from '../../login/actions';

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
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    scrollToTop();
    focusForm();
  }

  // A successful form save will mean we go from pending to success,
  // and we need to redirect
  componentWillReceiveProps(newProps) {
    if (this.props.form.savedStatus === SAVE_STATUSES.pending && newProps.form.savedStatus === SAVE_STATUSES.success) {
      this.props.router.push(`${newProps.urlPrefix || ''}form-saved`);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.pageConfig.pageKey !== this.props.route.pageConfig.pageKey ||
      _.get('params.index', prevProps) !== _.get('params.index', this.props)) {
      scrollToTop();
      focusForm();
    }
  }

  onChange(formData) {
    let newData = formData;
    if (this.props.route.pageConfig.showPagePerItem) {
      // If this is a per item page, the formData object will have data for a particular
      // row in an array, so we need to update the full form data object and then call setData
      newData = _.set([this.props.route.pageConfig.arrayPath, this.props.params.index], formData, this.props.form.data);
    }
    this.props.setData(newData);
  }

  onSubmit() {
    const { pages, pageIndex } = this.getEligiblePages();
    this.props.router.push(pages[pageIndex + 1].path);
  }

  /*
   * Returns the page list without conditional pages that have not satisfied
   * their dependencies and therefore should be skipped.
   */
  getEligiblePages() {
    const { form, route: { pageConfig, pageList } } = this.props;
    const eligiblePageList = getActivePages(pageList, form.data);
    // Any `showPagePerItem` pages are expanded to create items for each array item.
    // We update the `path` for each of those pages to replace `:index` with the current item index.
    const expandedPageList = expandArrayPages(eligiblePageList, form.data);
    // We can't check the pageKey for showPagePerItem pages, because multiple pages will match
    const pageIndex = pageConfig.showPagePerItem
      ? _.findIndex(item => item.path === this.props.location.pathname, expandedPageList)
      : _.findIndex(item => item.pageKey === pageConfig.pageKey, expandedPageList);
    return { pages: expandedPageList, pageIndex };
  }

  goBack() {
    const { pages, pageIndex } = this.getEligiblePages();
    // if we found the current page, go to previous one
    // if not, go back to the beginning because they shouldn't be here
    const page = pageIndex >= 0 ? pageIndex - 1 : 0;
    this.props.router.push(pages[page].path);
  }

  handleSave() {
    const {
      formId,
      version,
      data
    } = this.props.form;
    const returnUrl = this.props.location.pathname;
    this.props.saveInProgressForm(formId, version, returnUrl, data);
  }

  render() {
    const { route, params, form } = this.props;
    let {
      schema,
      uiSchema
    } = form.pages[route.pageConfig.pageKey];

    let data = form.data;

    if (route.pageConfig.showPagePerItem) {
      // Instead of passing through the schema/uiSchema to SchemaForm, the
      // current item schema for the array at arrayPath is pulled out of the page state and passed
      schema = schema.properties[route.pageConfig.arrayPath].items[params.index];
      // Similarly, the items uiSchema and the data for just that particular item are passed
      uiSchema = uiSchema[route.pageConfig.arrayPath].items;
      // And the data should be for just the item in the array
      data = _.get([route.pageConfig.arrayPath, params.index], data);
    }

    return (
      <div className="form-panel">
        <SchemaForm
            name={route.pageConfig.pageKey}
            title={route.pageConfig.title}
            data={data}
            schema={schema}
            uiSchema={uiSchema}
            pagePerItemIndex={params ? params.index : undefined}
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
          {(!form.disableSave && __BUILDTYPE__ !== 'production') && <div className="row">
            <div className="small-12 columns">
              <SaveFormLink
                  saveForm={this.handleSave}
                  savedStatus={form.savedStatus}
                  user={this.props.user}
                  onUpdateLoginUrl={this.props.updateLogInUrl}/>
            </div>
          </div>}
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
    user: state.user
  };
}

const mapDispatchToProps = {
  setData,
  saveInProgressForm,
  updateLogInUrl
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
