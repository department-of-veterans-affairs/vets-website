import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';
import { getScrollOptions } from 'platform/utilities/ui';
import get from '../../../../utilities/data/get';
import set from '../../../../utilities/data/set';

import ProgressButton from '../components/ProgressButton';
import { focusOnChange } from '../utilities/ui';
import SchemaForm from '../components/SchemaForm';
import { getArrayFields, getNonArraySchema, showReviewField } from '../helpers';
import ArrayField from './ArrayField';

import { isValidForm } from '../validation';
import { reduceErrors } from '../utilities/data/reduceErrors';
import { setFormErrors } from '../actions';

const { Element, scroller } = Scroll;

/*
 * Displays all the pages in a chapter on the review page
 */
class ReviewCollapsibleChapter extends React.Component {
  constructor() {
    super();
    this.handleEdit = this.handleEdit.bind(this);
  }

  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillMount() {
    this.id = uniqueId();
  }

  onChange(formData, path = null, index = null) {
    let newData = formData;
    if (path) {
      newData = set([path, index], formData, this.props.form.data);
    }
    this.props.setData(newData);
  }

  focusOnPage(key) {
    const name = `${key.replace(/:/g, '\\:')}`;
    // legend & label target array type form elements
    focusOnChange(name, 'p, legend, label');
  }

  handleEdit(key, editing, index = null) {
    this.props.onEdit(key, editing, index);
    this.scrollToPage(`${key}${index === null ? '' : index}`);
    if (editing) {
      // pressing "Update page" will call handleSubmit, which moves focus from
      // the edit button to the this target
      this.focusOnPage(`${key}${index === null ? '' : index}`);
    }
  }

  handleSubmit = (formData, key, path = null, index = null) => {
    // This makes sure defaulted data on a page with no changes is saved
    // Probably safe to do this for regular pages, too, but it hasn’t been necessary
    if (path) {
      const newData = set([path, index], formData, this.props.form.data);
      this.props.setData(newData);
    }

    this.handleEdit(key, false, index);
  };

  scrollToPage(key) {
    scroller.scrollTo(`${key}ScrollElement`, getScrollOptions({ offset: -40 }));
  }

  shouldHideExpandedPageTitle = (expandedPages, chapterTitle, pageTitle) =>
    expandedPages.length === 1 &&
    (chapterTitle || '').toLowerCase() === pageTitle.toLowerCase();

  checkValidation = () => {
    const { form, pageList, reviewErrors = {} } = this.props;
    const { errors } = isValidForm(form, pageList);
    this.props.setFormErrors({
      rawErrors: errors,
      errors: reduceErrors(errors, pageList, reviewErrors),
    });
  };

  getChapterTitle = chapterFormConfig => {
    let chapterTitle = chapterFormConfig.title;
    if (typeof chapterFormConfig.title === 'function') {
      chapterTitle = chapterFormConfig.title(true);
    }
    if (chapterFormConfig.reviewTitle) {
      chapterTitle = chapterFormConfig.reviewTitle;
    }
    return chapterTitle;
  };

  getSchemaformPageContent = (page, props, editing) => {
    const {
      chapterFormConfig,
      expandedPages,
      form,
      formContext,
      viewedPages,
    } = props;

    const pageState = form.pages[page.pageKey];
    let pageSchema;
    let pageUiSchema;
    let pageData;
    let arrayFields;
    let fullPageKey;

    if (page.showPagePerItem) {
      pageSchema =
        pageState.schema.properties[page.arrayPath].items[page.index];
      pageUiSchema = pageState.uiSchema[page.arrayPath].items;
      pageData = get([page.arrayPath, page.index], form.data);
      arrayFields = [];
      fullPageKey = `${page.pageKey}${page.index}`;
    } else {
      // TODO: support array fields inside of an array page?
      // Our pattern is to separate out array fields (growable tables) from
      // the normal page and display them separately. The review version of
      // ObjectField will hide them in the main section.
      arrayFields = getArrayFields(pageState, page);
      // This will be undefined if there are no fields other than an array
      // in a page, in which case we won’t render the form, just the array
      const pageSchemaObjects = getNonArraySchema(
        pageState.schema,
        pageState.uiSchema,
      );
      pageSchema = pageSchemaObjects.schema;
      pageUiSchema = pageSchemaObjects.uiSchema;
      pageData = form.data;
      fullPageKey = page.pageKey;
    }

    const classes = classNames('form-review-panel-page', {
      'schemaform-review-page-warning': !viewedPages.has(fullPageKey),
      // Remove bottom margin when the div content is empty
      'vads-u-margin-bottom--0': !pageSchema && arrayFields.length === 0,
    });
    const title = page.reviewTitle || page.title || '';
    const ariaLabel = `Update ${(typeof title === 'function'
      ? title(pageData)
      : title) || 'page'}`;

    const visibleFields =
      pageSchema &&
      Object.entries(pageSchema.properties).filter(([propName]) =>
        showReviewField(
          propName,
          pageSchema,
          pageUiSchema,
          form.data,
          formContext,
        ),
      ).length > 0;

    if (!visibleFields) {
      return null;
    }

    return (
      <div key={`${fullPageKey}`} className={classes}>
        <Element name={`${fullPageKey}ScrollElement`} />
        <SchemaForm
          name={page.pageKey}
          title={title}
          data={pageData}
          appStateData={page.appStateData}
          schema={pageSchema}
          uiSchema={pageUiSchema}
          trackingPrefix={this.props.form.trackingPrefix}
          hideHeaderRow={page.hideHeaderRow}
          hideTitle={this.shouldHideExpandedPageTitle(
            expandedPages,
            this.getChapterTitle(chapterFormConfig),
            title,
          )}
          pagePerItemIndex={page.index}
          onBlur={this.props.onBlur}
          onEdit={() => this.handleEdit(page.pageKey, !editing, page.index)}
          onSubmit={({ formData }) =>
            this.handleSubmit(
              formData,
              page.pageKey,
              page.arrayPath,
              page.index,
            )
          }
          onChange={formData =>
            this.onChange(
              typeof page.updateFormData === 'function'
                ? page.updateFormData(form.data, formData)
                : formData,
              page.arrayPath,
              page.index,
            )
          }
          uploadFile={this.props.uploadFile}
          reviewMode={!editing}
          formContext={formContext}
          editModeOnReviewPage={page.editModeOnReviewPage}
        >
          {!editing ? (
            <div />
          ) : (
            <ProgressButton
              submitButton
              onButtonClick={() => {
                // recheck _all_ validations after the user clicks the
                // update page button - needed to dynamically update
                // accordion headers
                this.checkValidation();
                focusOnChange(
                  `${page.pageKey}${
                    typeof page.index === 'number' ? page.index : ''
                  }`,
                );
              }}
              buttonText="Update page"
              buttonClass="usa-button-primary"
              ariaLabel={ariaLabel}
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
              formContext={formContext}
              pageConfig={page}
              onBlur={this.props.onBlur}
              schema={arrayField.schema}
              uiSchema={arrayField.uiSchema}
              trackingPrefix={this.props.form.trackingPrefix}
              setData={formData =>
                this.props.setData(
                  typeof page.updateFormData === 'function'
                    ? page.updateFormData(form.data, formData)
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

  getCustomPageContent = (page, props, editing) => {
    if (editing) {
      return (
        <page.CustomPage
          name={page.pageKey}
          title={page.title}
          trackingPrefix={props.form.trackingPrefix}
          uploadFile={props.uploadFile}
          onReviewPage
          data={props.form.data}
          updatePage={() => this.handleEdit(page.pageKey, false, page.index)}
          pagePerItemIndex={page.index}
        />
      );
    }
    return (
      <page.CustomPageReview
        editPage={() => this.handleEdit(page.pageKey, !editing, page.index)}
        name={page.pageKey}
        title={page.title}
        data={props.form.data}
        pagePerItemIndex={page.index}
      />
    );
  };

  getChapterContent = props => {
    const {
      chapterFormConfig,
      expandedPages,
      form,
      pageKeys,
      viewedPages,
    } = props;
    const ChapterDescription = chapterFormConfig.reviewDescription;
    return (
      <div
        className="usa-accordion-content schemaform-chapter-accordion-content"
        aria-hidden="false"
      >
        {ChapterDescription && (
          <ChapterDescription
            viewedPages={viewedPages}
            pageKeys={pageKeys}
            formData={form.data}
            t
            push
          />
        )}
        {expandedPages.map(page => {
          const pageConfig = form.pages[page.pageKey];
          const editing = pageConfig.showPagePerItem
            ? pageConfig.editMode[page.index]
            : pageConfig.editMode;

          const showCustomPage = editing
            ? !!pageConfig.CustomPage
            : !!pageConfig.CustomPageReview;

          return showCustomPage
            ? this.getCustomPageContent(page, props, editing)
            : this.getSchemaformPageContent(page, props, editing);
        })}
      </div>
    );
  };

  render() {
    let pageContent = null;

    const chapterTitle = this.getChapterTitle(this.props.chapterFormConfig);

    if (this.props.open) {
      pageContent = this.getChapterContent(this.props);
    }

    const classes = classNames('usa-accordion-bordered', 'form-review-panel', {
      'schemaform-review-chapter-warning': this.props.hasUnviewedPages,
    });

    const headerClasses = classNames(
      'accordion-header',
      'clearfix',
      'schemaform-chapter-accordion-header',
      'vads-u-font-size--h4',
      'vads-u-margin-top--0',
    );

    return (
      <div
        id={`${this.id}-collapsiblePanel`}
        className={classes}
        data-chapter={this.props.chapterKey}
      >
        <Element name={`chapter${this.props.chapterKey}ScrollElement`} />
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className="usa-unstyled-list" role="list">
          <li>
            <h3 className={headerClasses}>
              <button
                className="usa-button-unstyled"
                aria-expanded={this.props.open ? 'true' : 'false'}
                aria-controls={`collapsible-${this.id}`}
                onClick={this.props.toggleButtonClicked}
                id={`collapsibleButton${this.id}`}
              >
                {chapterTitle || ''}
              </button>
              {this.props.hasUnviewedPages && (
                <span
                  aria-describedby={`collapsibleButton${this.id}`}
                  className="schemaform-review-chapter-warning-icon"
                />
              )}
            </h3>
            <div id={`collapsible-${this.id}`}>{pageContent}</div>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
  setFormErrors,
};

// TODO: refactor to pass form.data instead of the entire form object
ReviewCollapsibleChapter.propTypes = {
  chapterFormConfig: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  pageList: PropTypes.array.isRequired,
  setFormErrors: PropTypes.func.isRequired,
  reviewErrors: PropTypes.shape({}),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewCollapsibleChapter);

// for tests
export { ReviewCollapsibleChapter };
