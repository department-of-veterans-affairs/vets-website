import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
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

import FormNavButtons, {
  FormNavButtonContinue,
} from '../components/FormNavButtons';
import SchemaForm from '../components/SchemaForm';
import { setData as setFormData, uploadFile } from '../actions';
import {
  getNextPagePath,
  getPreviousPagePath,
  checkValidPagePath,
} from '../routing';
import { DevModeNavLinks } from '../components/dev/DevModeNavLinks';
import { stringifyUrlParams } from '../helpers';

function focusForm(route, index) {
  // Check main toggle to enable custom focus
  if (route.formConfig?.useCustomScrollAndFocus) {
    const scrollAndFocusTarget =
      route.pageConfig?.scrollAndFocusTarget ||
      route.formConfig?.scrollAndFocusTarget;
    customScrollAndFocus(scrollAndFocusTarget, index);
  } else {
    focusElement(defaultFocusSelector);
  }
}

function getContentBeforeAndAfterButtons(
  route,
  contentBeforeButtons,
  contentAfterButtons,
) {
  const content = {
    contentBeforeNavButtons: contentBeforeButtons,
    contentAfterNavButtons: contentAfterButtons,
  };

  if (route.pageConfig?.hideSaveLinkAndStatus) {
    content.contentBeforeNavButtons = null;
    content.contentAfterNavButtons = null;
  } else if (route.formConfig?.showSaveLinkAfterButtons) {
    content.contentBeforeNavButtons = null;
    content.contentAfterNavButtons = (
      <>
        {contentBeforeButtons}
        {contentAfterButtons && (
          <div className="vads-u-margin-top--2">{contentAfterButtons}</div>
        )}
      </>
    );
  }

  return content;
}

const FormPage = props => {
  const {
    route,
    router,
    params = {},
    form = {},
    location = {},
    setData,
    contentBeforeButtons,
    contentAfterButtons,
    formContext,
    appStateData,
  } = props;

  const pageRef = useRef(null);
  const getArrayIndexedData = () =>
    get([route.pageConfig.arrayPath, params.index], form.data);

  // returns a duplicate of formData with newData at the indexed array
  const setArrayIndexedData = newData => {
    let formData = form.data;
    const { arrayPath } = route.pageConfig;
    if (!get(arrayPath, form.data)) {
      // if array doesn't exist create it
      formData = set([arrayPath], [], form.data);
    }
    return set([arrayPath, params.index], newData, formData);
  };

  const prePopulateArrayData = () => {
    const { pageConfig } = route;
    // only applicable to array routes with these settings
    if (pageConfig.showPagePerItem && pageConfig.allowPathWithNoItems) {
      const arrayFormData = getArrayIndexedData();
      if (!arrayFormData) {
        // we are trying to visit a route where there is no formData
        // for this index in the array, so we need to create and
        // pre-populate it with empty values for SchemaForm to work properly
        const defaultData = getDefaultFormState(
          pageConfig.schema.properties[pageConfig.arrayPath].items ||
            pageConfig.schema.properties[pageConfig.arrayPath].additionalItems,
        );
        const newData = setArrayIndexedData(defaultData);
        setData(newData);
      }
    }
  };

  useEffect(() => {
    prePopulateArrayData();
    if (!props.blockScrollOnMount) {
      focusForm(route, params.index);
    }
  });

  useEffect(
    () => {
      if (pageRef.current) {
        prePopulateArrayData();
        focusForm(route, params.index);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [route.pageConfig.pageKey, params.index, pageRef.current],
  );

  /**
   * @param {Object} [options]
   * @param {boolean} [options.all] If true, return the entire form data regardless of context
   */
  const getFormData = ({ all } = {}) => {
    if (all) {
      return form.data;
    }

    const { pageConfig } = route;
    // If it's a CustomPage, return the entire form data
    if (pageConfig.CustomPage && !pageConfig.customPageUsesPagePerItemData) {
      return form.data;
    }

    // If it's an array page, return only the data for that array item
    // Otherwise, return the data for the entire form
    return route.pageConfig.showPagePerItem ? getArrayIndexedData() : form.data;
  };

  const onChange = data => {
    const { pageConfig } = route;
    let newData = data;
    if (pageConfig.showPagePerItem) {
      // If this is a per item page, the formData object will have data for a
      // particular row in an array, so we need to update the full form data
      // object and then call setData
      newData = setArrayIndexedData(data);
    }
    if (typeof pageConfig.updateFormData === 'function') {
      newData = pageConfig.updateFormData(getFormData(), newData, params.index);
    }
    setData(newData);
  };

  // Navigate to the next page
  const onSubmit = ({ formData }) => {
    // This makes sure defaulted data on a page with no changes is saved
    // Probably safe to do this for regular pages, too, but it hasn’t been
    // necessary. Additionally, it should NOT setData for a CustomPage. The
    // CustomPage should take care of that itself.
    if (
      route.pageConfig.showPagePerItem &&
      (!route.pageConfig.CustomPage ||
        route.pageConfig.customPageUsesPagePerItemData)
    ) {
      const newData = setArrayIndexedData(formData);
      setData(newData);
    }

    const path = getNextPagePath(route.pageList, form.data, location.pathname);

    if (typeof route.pageConfig.onNavForward === 'function') {
      route.pageConfig.onNavForward({
        formData,
        goPath: customPath => router.push(customPath),
        goNextPath: urlParams => {
          const urlParamsString = stringifyUrlParams(urlParams);
          router.push(path + (urlParamsString || ''));
        },
        pageList: route.pageList,
        pathname: location.pathname,
        setFormData: setData,
        urlParams: location.query,
      });
      return;
    }

    router.push(path);
  };

  const goBack = () => {
    const path = getPreviousPagePath(
      route.pageList,
      form.data,
      location.pathname,
    );

    if (typeof route.pageConfig.onNavBack === 'function') {
      route.pageConfig.onNavBack({
        formData: form.data,
        goPath: customPath => router.push(customPath),
        goPreviousPath: urlParams => {
          const urlParamsString = stringifyUrlParams(urlParams);
          router.push(path + (urlParamsString || ''));
        },
        pageList: route.pageList,
        pathname: location.pathname,
        setFormData: setData,
        urlParams: location.query,
      });
      return;
    }

    router.push(path);
  };

  const goToPath = (customPath, options = {}) => {
    const { pageList } = route;
    const { force } = options;

    const path =
      customPath &&
      (force || checkValidPagePath(pageList, form.data, customPath))
        ? customPath
        : getPreviousPagePath(pageList, form.data, location.pathname);

    router.push(path);
  };

  const onContinue = () => {
    if (typeof route.pageConfig.onContinue === 'function') {
      // pass in data & set form data function to allow modifying data or
      // flags upon leaving a page
      route.pageConfig.onContinue(getFormData(), setData);
    }
  };

  const pageProps = form.pages[route.pageConfig.pageKey];
  let { schema, uiSchema } = pageProps;

  const pageClasses = classNames('form-panel', route.pageConfig.pageClass);
  const data = getFormData();

  if (
    route.pageConfig.showPagePerItem &&
    (!route.pageConfig.CustomPage ||
      route.pageConfig.customPageUsesPagePerItemData)
  ) {
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
  const isFirstRoutePage = route.pageList[0].path === location.pathname;

  const showNavLinks =
    environment.isLocalhost() && route.formConfig?.dev?.showNavLinks;
  const hideNavButtons =
    !environment.isProduction() &&
    (route.formConfig?.formOptions?.noBottomNav ||
      route.pageConfig?.hideNavButtons);

  let pageContentBeforeButtons = route.pageConfig?.ContentBeforeButtons;
  if (
    route.pageConfig?.ContentBeforeButtons &&
    isReactComponent(route.pageConfig.ContentBeforeButtons)
  ) {
    pageContentBeforeButtons = (
      <route.pageConfig.ContentBeforeButtons
        formData={data}
        formContext={formContext}
        router={router}
        setFormData={setData}
      />
    );
  }
  const NavButtons = route.formConfig?.useTopBackLink
    ? FormNavButtonContinue
    : FormNavButtons;

  const {
    contentBeforeNavButtons,
    contentAfterNavButtons,
  } = getContentBeforeAndAfterButtons(
    route,
    contentBeforeButtons,
    contentAfterButtons,
  );

  // Bypass the SchemaForm and render the custom component
  // NOTE: I don't think FormPage is rendered on the review page, so I believe
  // onReviewPage will always be false here
  if (isReactComponent(route.pageConfig.CustomPage)) {
    return (
      <div className={pageClasses}>
        {showNavLinks && (
          <DevModeNavLinks
            pageList={route.pageList}
            collapsible={route.formConfig?.dev?.collapsibleNavLinks}
          />
        )}
        <route.pageConfig.CustomPage
          ref={pageRef}
          name={route.pageConfig.pageKey}
          title={route.pageConfig.title}
          data={data}
          pagePerItemIndex={params ? params.index : undefined}
          onReviewPage={formContext?.onReviewPage}
          trackingPrefix={form.trackingPrefix}
          uploadFile={props.uploadFile}
          schema={schema}
          uiSchema={uiSchema}
          getFormData={getFormData}
          goBack={goBack}
          goForward={onSubmit}
          goToPath={goToPath}
          onContinue={onContinue}
          onChange={onChange}
          onSubmit={onSubmit}
          setFormData={setData}
          contentBeforeButtons={contentBeforeNavButtons}
          contentAfterButtons={contentAfterNavButtons}
          appStateData={appStateData}
          formContext={formContext}
          NavButtons={NavButtons}
        />
      </div>
    );
  }

  return (
    <div className={pageClasses}>
      {showNavLinks && (
        <DevModeNavLinks
          pageList={route.pageList}
          collapsible={route.formConfig?.dev?.collapsibleNavLinks}
        />
      )}
      <SchemaForm
        ref={pageRef}
        name={route.pageConfig.pageKey}
        title={route.pageConfig.title}
        data={data}
        appStateData={appStateData}
        schema={schema}
        uiSchema={uiSchema}
        pagePerItemIndex={params ? params.index : undefined}
        formContext={formContext}
        getFormData={getFormData}
        trackingPrefix={form.trackingPrefix}
        uploadFile={props.uploadFile}
        onChange={onChange}
        onSubmit={onSubmit}
        formOptions={route.formConfig?.formOptions || {}}
      >
        {pageContentBeforeButtons}
        {hideNavButtons ? (
          <div />
        ) : (
          <>
            {contentBeforeNavButtons}
            <NavButtons
              goBack={!isFirstRoutePage && goBack}
              goForward={onContinue}
              submitToContinue
            />
            {contentAfterNavButtons}
          </>
        )}
      </SchemaForm>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  const { appStateSelector } = ownProps.route.pageConfig;
  return {
    form: state.form,
    user: state.user,
    appStateData: appStateSelector && appStateSelector(state),
  };
}

const mapDispatchToProps = {
  setData: setFormData,
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
    query: PropTypes.object,
  }),
  params: PropTypes.shape({
    // for testing only?
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  route: PropTypes.shape({
    pageConfig: PropTypes.shape({
      allowPathWithNoItems: PropTypes.bool,
      arrayPath: PropTypes.string,
      ContentBeforeButtons: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.elementType,
        PropTypes.func,
      ]),
      CustomPage: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.elementType,
        PropTypes.func,
      ]),
      customPageUsesPagePerItemData: PropTypes.bool,
      hideNavButtons: PropTypes.bool,
      hideSaveLinkAndStatus: PropTypes.bool,
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
        collapsibleNavLinks: PropTypes.bool,
      }),
      formOptions: PropTypes.shape({
        noBottomNav: PropTypes.bool,
      }),
      showSaveLinkAfterButtons: PropTypes.bool,
      useTopBackLink: PropTypes.bool,
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
