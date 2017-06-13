import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';

import { focusElement, getActivePages } from '../../utils/helpers';
import SchemaForm from '../SchemaForm';
import { getArrayFields, getNonArraySchema, expandArrayPages } from '../helpers';
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

  onChange(formData, path = null, index = null) {
    let newData = formData;
    if (path) {
      newData = _.set([path, index], formData, this.props.form.data);
    }
    this.props.setData(newData);
  }

  focusOnPage(key, index) {
    const pageDiv = document.querySelector(`#${key}${index}`);
    focusElement(pageDiv);
  }

  handleEdit(key, editing, index) {
    this.props.onEdit(key, editing, index);
    this.scrollToPage(key, index);
    this.focusOnPage(key, index);
  }

  scrollToTop() {
    scroller.scrollTo(`chapter${this.props.chapterKey}ScrollElement`, {
      duration: 500,
      delay: 2,
      smooth: true,
    });
  }

  scrollToPage(key, index) {
    scroller.scrollTo(`${key}${index}ScrollElement`, {
      duration: 500,
      delay: 2,
      smooth: true,
    });
  }

  toggleChapter() {
    const isOpening = !this.state.open;
    this.setState({ open: !this.state.open }, () => {
      if (isOpening) {
        this.scrollToTop();
      }
    });
  }

  render() {
    let pageContent = null;

    if (this.state.open) {
      const { form, pages } = this.props;
      const activePages = getActivePages(pages, form.data);
      const expandedPages = expandArrayPages(activePages, form.data);

      pageContent = (
        <div id={`collapsible-${this.id}`} className="usa-accordion-content">
          {expandedPages.map(page => {
            const pageState = form.pages[page.pageKey];
            let pageSchema;
            let pageUiSchema;
            let pageData;
            let arrayFields;
            let editing;

            if (page.showPagePerItem) {
              editing = pageState.editMode[page.index];
              pageSchema = pageState.schema.properties[page.arrayPath].items[page.index];
              pageUiSchema = pageState.uiSchema[page.arrayPath].items;
              pageData = _.get([page.arrayPath, page.index], form.data);
              arrayFields = [];
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
            }

            return (
              <div key={`${page.pageKey}${page.index}`} className="form-review-panel-page">
                <Element name={`${page.pageKey}${page.index}ScrollElement`}/>
                {pageSchema &&
                  <SchemaForm
                      name={page.pageKey}
                      title={page.title}
                      data={pageData}
                      schema={pageSchema}
                      uiSchema={pageUiSchema}
                      hideTitle={expandedPages.length === 1}
                      pagePerItemIndex={page.index}
                      onEdit={() => this.handleEdit(page.pageKey, !editing, page.index)}
                      onSubmit={() => this.handleEdit(page.pageKey, false, page.index)}
                      onChange={(formData) => this.onChange(formData, page.arrayPath, page.index)}
                      reviewMode={!editing}>
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

    return (
      <div id={`${this.id}-collapsiblePanel`} className="usa-accordion-bordered form-review-panel">
        <Element name={`chapter${this.props.chapterKey}ScrollElement`}/>
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix">
              <button
                  className="usa-button-unstyled"
                  aria-expanded={this.state.open ? 'true' : 'false'}
                  aria-controls={`collapsible-${this.id}`}
                  onClick={this.toggleChapter}>
                {this.props.chapter.title}
              </button>
            </div>
            {pageContent}
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
