import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';

import { focusElement, getActivePages } from '../../utils/helpers';
import FormPage from '../FormPage';
import { getArrayFields, hasFieldsOtherThanArray } from '../helpers';
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

  focusOnPage(key) {
    const pageDiv = document.querySelector(`#${key}`);
    focusElement(pageDiv);
  }

  handleEdit(key, editing) {
    this.props.onEdit(key, editing);
    this.scrollToPage(key);
    this.focusOnPage(key);
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
      const { data, pages } = this.props;
      const activePages = getActivePages(pages, data);

      pageContent = (
        <div id={`collapsible-${this.id}`} className="usa-accordion-content">
          {activePages.map(page => {
            const editing = data[page.pageKey].editMode;
            // Our pattern is to separate out array fields (growable tables) from
            // the normal page and display them separately. The review version of
            // ObjectField will hide them in the main section.
            const arrayFields = getArrayFields(page);
            // If a page is just an array, then we should skip rendering it, since
            // we'll show the array separately
            const hasNonArrayFields = hasFieldsOtherThanArray(page.schema);

            return (
              <div key={page.pageKey} className="form-review-panel-page">
                <Element name={`${page.pageKey}ScrollElement`}/>
                {hasNonArrayFields &&
                  <FormPage
                      reviewPage
                      hideTitle={activePages.length === 1}
                      onEdit={() => this.handleEdit(page.pageKey, !editing)}
                      onSubmit={() => this.handleEdit(page.pageKey, false)}
                      reviewMode={!editing}
                      route={{ pageConfig: page }}>
                    {!editing ? <div/> : <ProgressButton
                        submitButton
                        buttonText="Update page"
                        buttonClass="usa-button-primary"/>}
                  </FormPage>}
                {arrayFields.map(arrayField =>
                  <ArrayField
                      pageKey={page.pageKey}
                      pageTitle={page.title}
                      arrayData={_.get(data[page.pageKey].data, arrayField.path)}
                      formData={data[page.pageKey].data}
                      key={arrayField.path}
                      pageConfig={page}
                      schema={arrayField.schema}
                      uiSchema={arrayField.uiSchema}
                      setData={this.props.setData}
                      path={arrayField.path}/>
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
  chapter: React.PropTypes.object.isRequired,
  pages: React.PropTypes.array.isRequired,
  data: React.PropTypes.object.isRequired,
  onEdit: React.PropTypes.func.isRequired
};

