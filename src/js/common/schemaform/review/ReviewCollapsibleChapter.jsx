import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import classNames from 'classnames';

import { focusElement, getActivePages } from '../../utils/helpers';
import SchemaForm from '../SchemaForm';
import { getArrayFields, getNonArraySchema, expandArrayPages, getPageKeys } from '../helpers';
import ArrayField from './ArrayField';
import ProgressButton from '../../components/form-elements/ProgressButton';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

/*
 * Displays all the pages in a chapter on the review page
 */
export default class ReviewCollapsibleChapter extends React.Component {
  constructor() {
    super();
    this.handleEdit = this.handleEdit.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.toggleChapter = this.toggleChapter.bind(this);
    this.state = { open: false };
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  componentDidUpdate(oldProps, oldState) {
    if (!oldState.open && this.state.open) {
      this.scrollToTop();
    }
  }

  onChange(formData, path = null, index = null) {
    let newData = formData;
    if (path) {
      newData = _.set([path, index], formData, this.props.form.data);
    }
    this.props.setData(newData);
  }

  focusOnPage(key) {
    const pageDiv = document.querySelector(`#${key}`);
    focusElement(pageDiv);
  }

  handleEdit(key, editing, index = null) {
    this.props.onEdit(key, editing, index);
    this.scrollToPage(`${key}${index === null ? '' : index}`);
    this.focusOnPage(`${key}${index === null ? '' : index}`);
  }

  scrollToTop() {
    scroller.scrollTo(`chapter${this.props.chapterKey}ScrollElement`, {
      duration: 500,
      delay: 2,
      smooth: true,
    });
  }

  scrollToPage(key) {
    scroller.scrollTo(`${key}ScrollElement`, {
      duration: 500,
      delay: 2,
      smooth: true,
    });
  }

  toggleChapter() {
    const opening = !this.state.open;
    this.setState({ open: opening });

    if (!opening) {
      this.props.setPagesViewed(this.pageKeys);
    }
  }

  render() {
    let pageContent = null;

    const { form, pages, viewedPages, chapter } = this.props;
    const activePages = getActivePages(pages, form.data);
    const expandedPages = expandArrayPages(activePages, form.data);

    this.pageKeys = getPageKeys(pages, form.data);
    const hasUnViewedPages = this.pageKeys.some(key => !viewedPages.has(key));

    const ChapterDescription = chapter.reviewDescription;

    if (this.state.open) {
      pageContent = (
        <div className="usa-accordion-content schemaform-chapter-accordion-content">
          {ChapterDescription &&
            <ChapterDescription
                viewedPages={viewedPages}
                pageKeys={this.pageKeys}
                formData={form.data}/>}
          {expandedPages.map(page => {
            const pageState = form.pages[page.pageKey];
            let pageSchema;
            let pageUiSchema;
            let pageData;
            let arrayFields;
            let editing;
            let fullPageKey;

            if (page.showPagePerItem) {
              editing = pageState.editMode[page.index];
              pageSchema = pageState.schema.properties[page.arrayPath].items[page.index];
              pageUiSchema = pageState.uiSchema[page.arrayPath].items;
              pageData = _.get([page.arrayPath, page.index], form.data);
              arrayFields = [];
              fullPageKey = `${page.pageKey}${page.index}`;
            } else {
              editing = pageState.editMode;
              // TODO: support array fields inside of an array page?
              // Our pattern is to separate out array fields (growable tables) from
              // the normal page and display them separately. The review version of
              // ObjectField will hide them in the main section.
              arrayFields = getArrayFields(pageState, page);
              // This will be undefined if there are no fields other than an array
              // in a page, in which case we won't render the form, just the array
              pageSchema = getNonArraySchema(pageState.schema, pageState.uiSchema);
              pageUiSchema = pageState.uiSchema;
              pageData = form.data;
              fullPageKey = page.pageKey;
            }

            const classes = classNames('form-review-panel-page', {
              'schemaform-review-page-warning': !viewedPages.has(fullPageKey)
            });

            return (
              <div key={`${fullPageKey}`} className={classes}>
                <Element name={`${fullPageKey}ScrollElement`}/>
                {pageSchema &&
                  <SchemaForm
                      name={page.pageKey}
                      title={page.title}
                      data={pageData}
                      schema={pageSchema}
                      uiSchema={pageUiSchema}
                      hideHeaderRow={page.hideHeaderRow}
                      hideTitle={expandedPages.length === 1}
                      pagePerItemIndex={page.index}
                      onEdit={() => this.handleEdit(page.pageKey, !editing, page.index)}
                      onSubmit={() => this.handleEdit(page.pageKey, false, page.index)}
                      onChange={(formData) => this.onChange(formData, page.arrayPath, page.index)}
                      uploadFile={this.props.uploadFile}
                      reviewMode={!editing}
                      editModeOnReviewPage={page.editModeOnReviewPage}>
                    {!editing ? <div/> : <ProgressButton
                        submitButton
                        buttonText="Update page"
                        buttonClass="usa-button-primary"/>}
                  </SchemaForm>}
                {arrayFields.map(arrayField =>
                  <div key={arrayField.path} className="form-review-array">
                    <ArrayField
                        pageKey={page.pageKey}
                        pageTitle={page.title}
                        arrayData={_.get(arrayField.path, form.data)}
                        formData={form.data}
                        pageConfig={page}
                        schema={arrayField.schema}
                        uiSchema={arrayField.uiSchema}
                        setData={this.props.setData}
                        path={arrayField.path}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    const classes = classNames('usa-accordion-bordered', 'form-review-panel', {
      'schemaform-review-chapter-warning': hasUnViewedPages
    });

    return (
      <div id={`${this.id}-collapsiblePanel`} className={classes}>
        <Element name={`chapter${this.props.chapterKey}ScrollElement`}/>
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix schemaform-chapter-accordion-header">
              <button
                  className="usa-button-unstyled"
                  aria-expanded={this.state.open ? 'true' : 'false'}
                  aria-controls={`collapsible-${this.id}`}
                  onClick={this.toggleChapter}>
                {this.props.chapter.title}
              </button>
              {hasUnViewedPages && <span className="schemaform-review-chapter-warning-icon"/>}
            </div>
            <div id={`collapsible-${this.id}`}>
              {pageContent}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

ReviewCollapsibleChapter.propTypes = {
  chapter: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired
};
