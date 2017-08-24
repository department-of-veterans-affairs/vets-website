import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';

import * as validations from '../utils/validations';
import { getScrollOptions, scrollAndFocus } from '../../../common/utils/helpers';

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

function getPageId(path) {
  return `${path.replace(/\//g, '')}Page`;
}

export default class ReviewCollapsiblePanel extends React.Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.toggleChapter = this.toggleChapter.bind(this);
    this.getPage = this.getPage.bind(this);
    this.getPagePath = this.getPagePath.bind(this);
    this.state = { open: false };
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  getPagePath(path) {
    return `${this.props.urlPrefix}${path}`;
  }

  getPage(path) {
    return this.props.uiData.pages[this.getPagePath(path)];
  }

  focusOnPage(path) {
    const pageDiv = document.querySelector(`#${getPageId(path)}`);
    if (pageDiv) {
      pageDiv.setAttribute('tabindex', '-1');
      pageDiv.focus();
    }
  }

  handleSave(path) {
    const formData = this.props.data;
    const pageFields = this.getPage(path).fields;

    this.props.onFieldsInitialized(pageFields);
    if (validations.isValidPage(this.getPagePath(path), formData)) {
      this.props.onUpdateEditStatus(this.getPagePath(path), false);
      this.scrollToPage(path);
      this.focusOnPage(path);
    } else {
      this.scrollToFirstError(path);
    }
  }

  handleEdit(path) {
    this.props.onUpdateEditStatus(this.getPagePath(path), true);
    this.scrollToPage(path);
    this.focusOnPage(path);
  }

  scrollToTop() {
    const options = getScrollOptions({ delay: 2 });
    scroller.scrollTo(`chapter${this.props.chapter}ScrollElement`, options);
  }

  scrollToFirstError(path) {
    setTimeout(() => {
      const errorEl = document.querySelector(`#${getPageId(path)} .usa-input-error, #${getPageId(path)} .input-error-date`);
      if (errorEl) {
        scrollAndFocus(errorEl);
      }
    }, 100);
  }

  scrollToPage(path) {
    const options = getScrollOptions({ delay: 2 });
    scroller.scrollTo(`${path}ScrollElement`, options);
  }

  toggleChapter() {
    const isOpening = !this.state.open;
    this.setState({ open: !this.state.open });
    if (isOpening) {
      this.scrollToTop();
    }
  }
  render() {
    let pageContent = null;
    if (this.state.open) {
      const pageCount = this.props.pages.length;
      pageContent = (
        <div id={`collapsible-${this.id}`} className="usa-accordion-content">
          {this.props.pages.map(page => {
            const ReviewComponent = page.reviewComponent;
            const Component = page.fieldsComponent;
            const editing = this.getPage(page.path).editOnReview;

            return (
              <div key={page.path} className="form-review-panel-page form-review-panel-page-edu" id={getPageId(page.path)}>
                <Element name={`${page.path}ScrollElement`}/>
                {!editing && !!ReviewComponent &&
                  <div className="form-review-panel-page-header-row">
                    <h5 className="form-review-panel-page-header">{pageCount > 1 && page.name}</h5>
                    <button
                      className="edit-btn primary-outline"
                      onClick={() => this.handleEdit(page.path)}>Edit</button>
                  </div>}
                {(editing || !ReviewComponent) &&
                  <Component
                    data={this.props.data}
                    editing={editing}
                    onEdit={() => this.handleEdit(page.path)}
                    onSave={() => this.handleSave(page.path)}
                    inReview
                    onStateChange={this.props.onStateChange}
                    initializeFields={this.props.onFieldsInitialized}/>}
                {!editing && !!ReviewComponent &&
                  <ReviewComponent data={this.props.data}/>}
                {editing && !!ReviewComponent && <button
                  className="usa-button-primary"
                  onClick={() => this.handleSave(page.path)}>Update page</button>}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div id={`${this.id}-collapsiblePanel`} className="usa-accordion-bordered form-review-panel">
        <Element name={`chapter${this.props.chapter}ScrollElement`}/>
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix" >
              <button className="usa-button-unstyled" aria-expanded={this.state.open ? 'true' : 'false'} aria-controls={`collapsible-${this.id}`} onClick={this.toggleChapter}>
                {this.props.chapter}
              </button>
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

ReviewCollapsiblePanel.propTypes = {
  chapter: PropTypes.string.isRequired,
  pages: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  uiData: PropTypes.object.isRequired,
  onFieldsInitialized: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
  onUpdateEditStatus: PropTypes.func.isRequired,
  urlPrefix: PropTypes.string.isRequired
};
