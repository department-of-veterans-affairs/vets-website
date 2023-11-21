import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import {
  isReactComponent,
  focusElement,
  customScrollAndFocus,
  defaultFocusSelector,
} from 'platform/utilities/ui';
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
import { DevModeNavLinks } from '../components/dev/DevModeNavLinks';

function focusForm(route, index) {
  // Check main toggle to enable custom focus
  if (route.formConfig?.useCustomScrollAndFocus) {
    customScrollAndFocus(route.pageConfig?.scrollAndFocusTarget, index);
  } else {
    focusElement(defaultFocusSelector);
  }
}

class FormPage extends React.Component {
  componentDidMount() {
    this.prePopulateArrayData();
    if (!this.props.blockScrollOnMount) {
      focusForm(this.props.route, this.props?.params?.index);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.route.pageConfig.pageKey !==
        this.props.route.pageConfig.pageKey ||
      get('params.index', prevProps) !== get('params.index', this.props)
    ) {
      this.prePopulateArrayData();
      focusForm(this.props.route, this.props?.params?.index);
    }
  }

  onChange = formData => {
    const { pageConfig } = this.props.route;
    let newData = formData;
    if (pageConfig.showPagePerItem) {
      // If this is a per item page, the formData object will have data for a particular
      // row in an array, so we need to update the full form data object and then call setData
      newData = this.setArrayIndexedData(formData);
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
    const { form, route, location } = this.props;

    // This makes sure defaulted data on a page with no changes is saved
    // Probably safe to do this for regular pages, too, but it hasn’t been
    // necessary. Additionally, it should NOT setData for a CustomPage. The
    // CustomPage should take care of that itself.
    if (route.pageConfig.showPagePerItem && !route.pageConfig.CustomPage) {
      const newData = this.setArrayIndexedData(formData);
      this.props.setData(newData);
    }

    const path = getNextPagePath(route.pageList, form.data, location.pathname);

    if (typeof route.pageConfig.onNavForward === 'function') {
      route.pageConfig.onNavForward({
        formData,
        goPath: customPath => this.props.router.push(customPath),
        goNextPath: () => this.props.router.push(path),
      });
      return;
    }

    this.props.router.push(path);
  };

  getArrayIndexedData = () => {
    const { route, params, form } = this.props;
    return get([route.pageConfig.arrayPath, params.index], form.data);
  };

  // returns a duplicate of formData with newData at the indexed array
  setArrayIndexedData = newData => {
    let formData = this.props.form.data;
    const { arrayPath } = this.props.route.pageConfig;
    if (!get(arrayPath, this.props.form.data)) {
      // if array doesn't exist create it
      formData = set([arrayPath], [], this.props.form.data);
    }
    return set([arrayPath, this.props.params.index], newData, formData);
  };

  prePopulateArrayData = () => {
    const { pageConfig } = this.props.route;
    // only applicable to array routes with these settings
    if (pageConfig.showPagePerItem && pageConfig.allowPathWithNoItems) {
      const arrayFormData = this.getArrayIndexedData();
      if (!arrayFormData) {
        // we are trying to visit a route where there is no formData
        // for this index in the array, so we need to create and
        // pre-populate it with empty values for SchemaForm to work properly
        const defaultData = getDefaultFormState(
          pageConfig.schema.properties[pageConfig.arrayPath].items ||
            pageConfig.schema.properties[pageConfig.arrayPath].additionalItems,
        );
        const newData = this.setArrayIndexedData(defaultData);
        this.props.setData(newData);
      }
    }
  };

  formData = () => {
    const { pageConfig } = this.props.route;
    // If it's a CustomPage, return the entire form data
    if (pageConfig.CustomPage) return this.props.form.data;

    // If it's an array page, return only the data for that array item
    // Otherwise, return the data for the entire form
    return this.props.route.pageConfig.showPagePerItem
      ? this.getArrayIndexedData()
      : this.props.form.data;
  };

  goBack = () => {
    const { form, route, location } = this.props;

    const path = getPreviousPagePath(
      route.pageList,
      form.data,
      location.pathname,
    );

    if (typeof route.pageConfig.onNavBack === 'function') {
      route.pageConfig.onNavBack({
        formData: form.data,
        goPath: customPath => this.props.router.push(customPath),
        goPreviousPath: () => this.props.router.push(path),
      });
      return;
    }

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

    const pageProps = form.pages[route.pageConfig.pageKey];
    let { schema, uiSchema } = pageProps;

    const pageClasses = classNames('form-panel', route.pageConfig.pageClass);
    const data = this.formData();

    if (route.pageConfig.showPagePerItem && !route.pageConfig.CustomPage) {
      // Instead of passing through the schema/uiSchema to SchemaForm, the
      // current item schema for the array at arrayPath is pulled out of the page state and passed
      const { items, additionalItems } = schema.properties[
        route.pageConfig.arrayPath
      ];
      schema = items[params.index];
      if (!schema && route.pageConfig.allowPathWithNoItems) {
        schema = additionalItems;
      }
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

    const showNavLinks =
      environment.isLocalhost() && route.formConfig?.dev?.showNavLinks;
    const hideNavButtons =
      !environment.isProduction() && route.formConfig?.formOptions?.noBottomNav;

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
            schema={schema}
            uiSchema={uiSchema}
            goBack={this.goBack}
            goForward={this.onSubmit}
            goToPath={this.goToPath}
            callOnContinue={callOnContinue}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            setFormData={this.props.setData}
            contentBeforeButtons={contentBeforeButtons}
            contentAfterButtons={contentAfterButtons}
          />
        </div>
      );
    }

    return (
      <div className={pageClasses}>
        {showNavLinks && <DevModeNavLinks pageList={route.pageList} />}
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
          {hideNavButtons ? (
            <div />
          ) : (
            <>
              {contentBeforeButtons}
              <FormNavButtons
                goBack={!isFirstRoutePage && this.goBack}
                goForward={callOnContinue}
                submitToContinue
              />
              {contentAfterButtons}
            </>
          )}
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
  appStateData: PropTypes.shape({}),
  blockScrollOnMount: PropTypes.bool,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  params: PropTypes.shape({
    // for testing only?
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  route: PropTypes.shape({
    pageConfig: PropTypes.shape({
      allowPathWithNoItems: PropTypes.bool,
      arrayPath: PropTypes.string,
      CustomPage: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.elementType,
        PropTypes.func,
      ]),
      onContinue: PropTypes.func,
      onNavBack: PropTypes.func,
      onNavForward: PropTypes.func,
      pageClass: PropTypes.string,
      pageKey: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      scrollAndFocusTarget: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
      ]),
      showPagePerItem: PropTypes.bool,
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      uiSchema: PropTypes.object.isRequired,
      updateFormData: PropTypes.func,
    }),
    formConfig: PropTypes.shape({
      dev: PropTypes.shape({
        showNavLinks: PropTypes.bool,
      }),
      formOptions: PropTypes.shape({
        noBottomNav: PropTypes.bool,
      }),
    }),
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
    ),
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  setData: PropTypes.func,
  uploadFile: PropTypes.func,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FormPage),
);

export { FormPage };
