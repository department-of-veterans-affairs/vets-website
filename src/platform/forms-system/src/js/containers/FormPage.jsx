import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import get from '../../../../utilities/data/get';
import set from '../../../../utilities/data/set';

import FormNavButtons from '../components/FormNavButtons';
import SchemaForm from '../components/SchemaForm';
import { setData, uploadFile } from '../actions';
import {
  getNextPagePath,
  getPreviousPagePath,
  checkValidPagePath,
} from '../routing';
import { focusElement } from '../utilities/ui';
import { isReactComponent, getScrollOptions } from '~/platform/utilities/ui';

function focusForm() {
  focusElement('.nav-header > h2');
}

class FormPage extends React.Component {
  componentDidMount() {
    if (!this.props.blockScrollOnMount) {
      scrollToTop('topScrollElement', getScrollOptions());
      focusForm();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.route.pageConfig.pageKey !==
        this.props.route.pageConfig.pageKey ||
      get('params.index', prevProps) !== get('params.index', this.props)
    ) {
      scrollToTop('topScrollElement', getScrollOptions());
      focusForm();
    }
  }

  onChange = formData => {
    const { pageConfig } = this.props.route;
    let newData = formData;
    if (pageConfig.showPagePerItem) {
      // If this is a per item page, the formData object will have data for a particular
      // row in an array, so we need to update the full form data object and then call setData
      newData = set(
        [this.props.route.pageConfig.arrayPath, this.props.params.index],
        formData,
        this.props.form.data,
      );
    }
    if (typeof pageConfig.updateFormData === 'function') {
      newData = pageConfig.updateFormData(
        this.formData(),
        newData,
        this.props.params.index,
      );
    }
    this.props.setData(newData);
  };

  // Navigate to the next page
  onSubmit = ({ formData }) => {
    const { form, params, route, location } = this.props;

    // This makes sure defaulted data on a page with no changes is saved
    // Probably safe to do this for regular pages, too, but it hasn’t been
    // necessary. Additionally, it should NOT setData for a CustomPage. The
    // CustomPage should take care of that itself.
    if (route.pageConfig.showPagePerItem && !route.pageConfig.CustomPage) {
      const newData = set(
        [route.pageConfig.arrayPath, params.index],
        formData,
        form.data,
      );
      this.props.setData(newData);
    }

    const path = getNextPagePath(route.pageList, form.data, location.pathname);

    this.props.router.push(path);
  };

  formData = () => {
    const { pageConfig } = this.props.route;
    // If it's a CustomPage, return the entire form data
    if (pageConfig.CustomPage) return this.props.form.data;

    // If it's an array page, return only the data for that array item
    // Otherwise, return the data for the entire form
    return this.props.route.pageConfig.showPagePerItem
      ? get(
          [pageConfig.arrayPath, this.props.params.index],
          this.props.form.data,
        )
      : this.props.form.data;
  };

  goBack = () => {
    const {
      form,
      route: { pageList },
      location,
    } = this.props;

    const path = getPreviousPagePath(pageList, form.data, location.pathname);

    this.props.router.push(path);
  };

  goToPath = customPath => {
    const {
      form,
      route: { pageList },
      location,
    } = this.props;

    const path =
      customPath &&
      checkValidPagePath(pageList, this.props.form.data, customPath)
        ? customPath
        : getPreviousPagePath(pageList, form.data, location.pathname);

    this.props.router.push(path);
  };

  render() {
    const {
      route,
      params,
      form,
      contentBeforeButtons,
      contentAfterButtons,
      formContext,
      appStateData,
    } = this.props;

    let { schema, uiSchema } = form.pages[route.pageConfig.pageKey];

    const pageClasses = classNames('form-panel', route.pageConfig.pageClass);
    const data = this.formData();

    if (route.pageConfig.showPagePerItem && !route.pageConfig.CustomPage) {
      // Instead of passing through the schema/uiSchema to SchemaForm, the
      // current item schema for the array at arrayPath is pulled out of the page state and passed
      schema =
        schema.properties[route.pageConfig.arrayPath].items[params.index];
      // Similarly, the items uiSchema and the data for just that particular item are passed
      uiSchema = uiSchema[route.pageConfig.arrayPath].items;
    }
    // It should be "safe" to check that this is the first page because it is
    // always eligible and enabled, no need to call getPreviousPagePath.
    const isFirstRoutePage =
      route.pageList[0].path === this.props.location.pathname;

    function callOnContinue() {
      if (typeof route.pageConfig.onContinue === 'function') {
        route.pageConfig.onContinue(data);
      }
    }

    // Bypass the SchemaForm and render the custom component
    // NOTE: I don't think FormPage is rendered on the review page, so I believe
    // onReviewPage will always be false here
    if (isReactComponent(route.pageConfig.CustomPage)) {
      return (
        <div className={pageClasses}>
          <route.pageConfig.CustomPage
            name={route.pageConfig.pageKey}
            title={route.pageConfig.title}
            data={data}
            pagePerItemIndex={params ? params.index : undefined}
            onReviewPage={formContext?.onReviewPage}
            trackingPrefix={this.props.form.trackingPrefix}
            uploadFile={this.props.uploadFile}
            goBack={this.goBack}
            goForward={this.onSubmit}
            goToPath={this.goToPath}
          />
        </div>
      );
    }

    return (
      <div className={pageClasses}>
        <SchemaForm
          name={route.pageConfig.pageKey}
          title={route.pageConfig.title}
          data={data}
          appStateData={appStateData}
          schema={schema}
          uiSchema={uiSchema}
          pagePerItemIndex={params ? params.index : undefined}
          formContext={formContext}
          trackingPrefix={this.props.form.trackingPrefix}
          uploadFile={this.props.uploadFile}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
        >
          {contentBeforeButtons}
          <FormNavButtons
            goBack={!isFirstRoutePage && this.goBack}
            goForward={callOnContinue}
            submitToContinue
          />
          {contentAfterButtons}
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { appStateSelector } = ownProps.route.pageConfig;
  return {
    form: state.form,
    user: state.user,
    appStateData: appStateSelector && appStateSelector(state),
  };
}

const mapDispatchToProps = {
  setData,
  uploadFile,
};

FormPage.propTypes = {
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    pageConfig: PropTypes.shape({
      pageKey: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      uiSchema: PropTypes.object.isRequired,
      onContinue: PropTypes.func,
      updateFormData: PropTypes.func,
    }),
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
    ),
  }),
  contentBeforeButtons: PropTypes.element,
  contentAfterButtons: PropTypes.element,
  setData: PropTypes.func,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FormPage),
);

export { FormPage };
