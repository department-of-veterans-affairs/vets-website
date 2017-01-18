import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';

import { focusElement } from '../../utils/helpers';
import FormPage from '../FormPage';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

/**
 * A component for the review page to validate information is correct.
 * The panel contains one chapter and a list of pages that can be viewed and edited
 * indepepndently.
 *
 * Required props
 * chapter - The chapter title for this panel
 * pages - The array of pages for this chapter. Each pages contains the name and components to render it
 * data - The current form data
 * uiData - The current ui state for each page (i.e. whether each chapter is collapsed or not)
 * onStateChange - Called when form data is changed
 * onFieldsInitialized - Sets all fields to dirty when saving/continuing on page
 * onUpdateEditStatus - toggles editOnReview property that expands/collapses chapter panel
 * urlPrefix - The url prefix for the form pages
 *
 * Page props:
 *
 * path - Url for the page, used to check editOnReview state
 * fieldsComponent - Component that renders editable view of page (or both edit and view states if
 *   no review component is passed)
 * reviewComponent - Component used to render read view of page. Optional if fieldsComponent can handle review state
 * name - Name of the page
 *
 * The fieldsComponent is passed some state props: inReview (always true here) and editing.
 */

export default class ReviewCollapsibleChapter extends React.Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
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

  handleSave(key) {
    this.props.onEdit(key, false);
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
      pageContent = (
        <div id={`collapsible-${this.id}`} className="usa-accordion-content">
          {this.props.pages.map(page => {
            const editing = this.props.data[page.pageKey].editMode;

            return (
              <div key={page.pageKey} className="form-review-panel-page">
                <Element name={`${page.pageKey}ScrollElement`}/>
                <FormPage
                    reviewPage
                    hideTitle={this.props.pages.length === 1}
                    onEdit={() => this.handleEdit(page.pageKey, !editing)}
                    onSubmit={() => this.handleSave(page.pageKey)}
                    reviewMode={!editing}
                    route={{ pageConfig: page }}/>
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

