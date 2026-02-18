import PropTypes from 'prop-types';
import React from 'react';
import { Element } from 'platform/utilities/scroll';
import classNames from 'classnames';
import get from '../../../../utilities/data/get';
import set from '../../../../utilities/data/set';
import {
  ERROR_ELEMENTS,
  SCROLL_ELEMENT_SUFFIX,
} from '../../../../utilities/constants';
import { focusReview } from '../utilities/ui/focus-review';
import ProgressButton from '../components/ProgressButton';
import { focusOnChange, fixSelector } from '../utilities/ui';
import SchemaForm from '../components/SchemaForm';
import { getArrayFields, getNonArraySchema } from '../helpers';
import ArrayField from './ArrayField';
import { getPreviousPagePath, checkValidPagePath } from '../routing';
import { isValidForm } from '../validation';
import { reduceErrors } from '../utilities/data/reduceErrors';
import { getPageKey } from '../utilities/review';
import { getChapterTitle, getPageTitle, hasVisibleReviewFields } from './utils';

const ReviewChapterContent = props => {
  const hasValidationError = (key, index) => {
    const { form, pageList, reviewErrors = {} } = props;
    const scrollElementKey = `${key}${index ?? ''}`;

    const { errors } = isValidForm(form, pageList);
    const cleanedErrors = reduceErrors(errors, pageList, reviewErrors);
    props.setFormErrors({
      rawErrors: errors,
      errors: cleanedErrors,
    });

    const pageKey =
      reviewErrors?._override?.(key, { pageKey: key, index })?.pageKey ||
      scrollElementKey;
    const hasErrors = cleanedErrors.some(error => {
      const errorPageKey =
        reviewErrors?._override?.(error.pageKey, error)?.pageKey ||
        getPageKey(error);
      return errorPageKey === pageKey;
    });

    if (hasErrors) {
      focusOnChange(scrollElementKey, ERROR_ELEMENTS.join(','));
    } else {
      focusOnChange(scrollElementKey, 'va-button', 'button');
    }
    return hasErrors;
  };

  const handleEdit = (key, editing, index = null) => {
    if (editing || !hasValidationError(key, index)) {
      props.onEdit(key, editing, index);
      focusReview(
        fixSelector(`${key}${index ?? ''}`),
        editing,
        props.reviewEditFocusOnHeaders || false,
      );
    }
  };

  const onChange = (formData, path = null, index = null) => {
    let newData = formData;
    if (path) {
      newData = set([path, index], formData, props.form.data);
    }
    props.setData(newData);
  };

  const handleSubmit = (formData, key, path = null, index = null) => {
    const hasError = hasValidationError(key, index);

    if (path) {
      const newData = set([path, index], formData, props.form.data);
      props.setData(newData);
    }

    if (!hasError) {
      handleEdit(key, false, index);
    }
  };

  const goToPath = (customPath, options = {}) => {
    const { form, pageList, location, router } = props;
    const { force } = options;

    const path =
      customPath &&
      (force || checkValidPagePath(pageList, props.form.data, customPath))
        ? customPath
        : getPreviousPagePath(pageList, form.data, location.pathname);

    router.push(path);
  };

  const shouldHideExpandedPageTitle = (
    expandedPages,
    chapterTitle,
    pageTitle,
  ) =>
    expandedPages.length === 1 &&
    typeof pageTitle === 'string' &&
    (chapterTitle || '').toLowerCase() === pageTitle.toLowerCase();

  const getSchemaformPageContent = (page, editing) => {
    const {
      chapterFormConfig,
      expandedPages,
      form,
      formContext,
      viewedPages,
    } = props;

    const pageState = form.pages[page.pageKey];
    const fullPageKey = `${page.pageKey}${page.index ?? ''}`;
    let pageSchema;
    let pageUiSchema;
    let pageData;
    let arrayFields;

    if (page.showPagePerItem) {
      pageSchema =
        pageState.schema.properties[page.arrayPath].items[page.index];
      pageUiSchema = pageState.uiSchema[page.arrayPath].items;
      pageData = get([page.arrayPath, page.index], form.data);
      arrayFields = [];
    } else {
      arrayFields = getArrayFields(pageState, page);
      const pageSchemaObjects = getNonArraySchema(
        pageState.schema,
        pageState.uiSchema,
      );
      pageSchema = pageSchemaObjects.schema;
      pageUiSchema = pageSchemaObjects.uiSchema;
      pageData = form.data;
    }

    const hasError = props.form.formErrors?.errors?.some(
      err => fullPageKey === getPageKey(err),
    );

    const classes = classNames('form-review-panel-page', {
      'schemaform-review-page-error': hasError || !viewedPages.has(fullPageKey),
      'vads-u-margin-bottom--0': !pageSchema && arrayFields.length === 0,
    });

    const title = page.reviewTitle || page.title || '';
    const labelTitle = pageUiSchema['ui:options']?.itemAriaLabel || title;
    const ariaText =
      typeof labelTitle === 'function' ? labelTitle(pageData) : labelTitle;
    const ariaLabel = `Update ${ariaText || 'page'}`;
    const formOptions = props.formOptions || {};
    const mergedFormContext = {
      ...formContext,
      formOptions,
      ...(typeof props.filterEmptyFields === 'boolean' && {
        filterEmptyFields: props.filterEmptyFields,
      }),
    };

    const visibleFields =
      pageSchema &&
      hasVisibleReviewFields(pageSchema, pageUiSchema, form.data, formContext);

    if (!visibleFields) {
      return null;
    }

    return (
      <div key={`${fullPageKey}`} className={classes}>
        <Element name={`${fullPageKey}${SCROLL_ELEMENT_SUFFIX}`} />
        <SchemaForm
          name={page.pageKey}
          title={title}
          data={pageData}
          appStateData={page.appStateData}
          schema={pageSchema}
          uiSchema={pageUiSchema}
          trackingPrefix={props.form.trackingPrefix}
          hideHeaderRow={page.hideHeaderRow}
          hideTitle={shouldHideExpandedPageTitle(
            expandedPages,
            getChapterTitle(chapterFormConfig, form.data, form, true),
            getPageTitle(page, form.data),
          )}
          pagePerItemIndex={page.index}
          onBlur={props.onBlur}
          onEdit={() => handleEdit(page.pageKey, !editing, page.index)}
          onSubmit={({ formData }) =>
            handleSubmit(formData, page.pageKey, page.arrayPath, page.index)
          }
          onChange={formData =>
            onChange(
              typeof page.updateFormData === 'function'
                ? page.updateFormData(form.data, formData, page.index)
                : formData,
              page.arrayPath,
              page.index,
            )
          }
          uploadFile={props.uploadFile}
          reviewMode={!editing}
          formContext={mergedFormContext}
          editModeOnReviewPage={page.editModeOnReviewPage}
        >
          {!editing ? (
            <div />
          ) : (
            <ProgressButton
              submitButton
              onButtonClick={() => {
                if (!hasValidationError(page.pageKey, page.index)) {
                  focusOnChange(getPageKey(page), 'va-button', 'button');
                }
              }}
              buttonText="Update page"
              buttonClass="usa-button-primary"
              ariaLabel={ariaLabel}
              useWebComponents={props.formOptions?.useWebComponentForNavigation}
            />
          )}
        </SchemaForm>
        {arrayFields.map(arrayField => (
          <div key={arrayField.path} className="form-review-array">
            <ArrayField
              pageKey={page.pageKey}
              pageTitle={page.title}
              arrayData={get(arrayField.path, form.data)}
              formData={form.data}
              appStateData={page.appStateData}
              formContext={mergedFormContext}
              pageConfig={page}
              onBlur={props.onBlur}
              schema={arrayField.schema}
              uiSchema={arrayField.uiSchema}
              trackingPrefix={props.form.trackingPrefix}
              setData={formData =>
                props.setData(
                  typeof page.updateFormData === 'function'
                    ? page.updateFormData(form.data, formData, page.index)
                    : formData,
                )
              }
              path={arrayField.path}
            />
          </div>
        ))}
      </div>
    );
  };

  const getCustomPageContent = (page, editing) => {
    const pageState = props.form.pages[page.pageKey];
    let pageSchema;
    let pageUiSchema;

    if (page.showPagePerItem) {
      pageSchema =
        pageState.schema.properties[page.arrayPath].items[page.index];
      pageUiSchema = pageState.uiSchema[page.arrayPath].items;
    } else {
      const pageSchemaObjects = getNonArraySchema(
        pageState.schema,
        pageState.uiSchema,
      );
      pageSchema = pageSchemaObjects.schema;
      pageUiSchema = pageSchemaObjects.uiSchema;
    }

    const fullPageKey = getPageKey(page);

    if (editing) {
      const noop = function noop() {};
      return (
        <React.Fragment key={fullPageKey}>
          <Element name={`${fullPageKey}${SCROLL_ELEMENT_SUFFIX}`} />
          <div>
            <page.CustomPage
              name={page.pageKey}
              title={page.title}
              trackingPrefix={props.form.trackingPrefix}
              uploadFile={props.uploadFile}
              onReviewPage
              setFormData={props.setData}
              data={props.form.data}
              updatePage={() => handleEdit(page.pageKey, false, page.index)}
              recalculateErrors={hasValidationError}
              pagePerItemIndex={page.index}
              schema={pageSchema}
              uiSchema={pageUiSchema}
              goBack={noop}
              goForward={noop}
              goToPath={goToPath}
            />
          </div>
        </React.Fragment>
      );
    }

    const hasError = props.form.formErrors?.errors?.some(
      err => fullPageKey === getPageKey(err),
    );

    const classes = classNames('form-review-panel-page', {
      'schemaform-review-page-error':
        hasError || !props.viewedPages.has(fullPageKey),
    });

    return (
      <div key={`${fullPageKey}`} className={classes}>
        <Element name={`${fullPageKey}${SCROLL_ELEMENT_SUFFIX}`} />
        <div>
          <page.CustomPageReview
            key={`${page.pageKey}Review${page.index ?? ''}`}
            editPage={() => handleEdit(page.pageKey, !editing, page.index)}
            name={page.pageKey}
            title={page.title}
            data={props.form.data}
            fullData={props.form.data}
            pagePerItemIndex={page.index}
            goToPath={goToPath}
            recalculateErrors={hasValidationError}
          />
        </div>
      </div>
    );
  };

  const getChapterContent = () => {
    const {
      chapterFormConfig,
      expandedPages,
      form,
      pageKeys,
      viewedPages,
    } = props;
    const ChapterDescription = chapterFormConfig.reviewDescription;
    return (
      <div data-testid={props.contentTestId || 'accordion-item-content'}>
        {ChapterDescription && (
          <ChapterDescription
            viewedPages={viewedPages}
            pageKeys={pageKeys}
            formData={form.data}
          />
        )}
        {expandedPages?.map(page => {
          const pageConfig = form.pages[page.pageKey];
          const editing = pageConfig.showPagePerItem
            ? pageConfig.editMode[page.index]
            : pageConfig.editMode;

          const showCustomPage = editing
            ? !!pageConfig.CustomPage
            : !!pageConfig.CustomPageReview;

          return showCustomPage
            ? getCustomPageContent(page, editing)
            : getSchemaformPageContent(page, editing);
        }) ?? null}
      </div>
    );
  };

  return getChapterContent();
};

ReviewChapterContent.propTypes = {
  chapterFormConfig: PropTypes.object.isRequired,
  contentTestId: PropTypes.string,
  expandedPages: PropTypes.array.isRequired,
  filterEmptyFields: PropTypes.bool,
  form: PropTypes.object.isRequired,
  formContext: PropTypes.object,
  formOptions: PropTypes.shape({
    useWebComponentForNavigation: PropTypes.bool,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onBlur: PropTypes.func,
  onEdit: PropTypes.func.isRequired,
  pageKeys: PropTypes.array.isRequired,
  pageList: PropTypes.array.isRequired,
  reviewEditFocusOnHeaders: PropTypes.bool,
  reviewErrors: PropTypes.shape({}),
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setData: PropTypes.func.isRequired,
  setFormErrors: PropTypes.func.isRequired,
  uploadFile: PropTypes.func,
  viewedPages: PropTypes.object.isRequired,
};

export default ReviewChapterContent;
export { ReviewChapterContent };
