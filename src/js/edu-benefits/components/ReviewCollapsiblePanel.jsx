import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';

import * as validations from '../utils/validations';

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
 * uiState - The current ui state for each page (i.e. whether each chapter is collapsed or not)
 * onStateChange - Called when form data is changed
 * onFieldsInitialized - Sets all fields to dirty when saving/continuing on page
 * onUpdateEditStatus - toggles editOnReview property that expands/collapses chapter panel
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

export default class ReviewCollapsiblePanel extends React.Component {
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

  scrollToTop() {
    scroller.scrollTo(`chapter${this.props.chapter}ScrollElement`, {
      duration: 500,
      delay: 2,
      smooth: true,
    });
  }
  scrollToPage(path) {
    scroller.scrollTo(`${path}ScrollElement`, {
      duration: 500,
      delay: 2,
      smooth: true,
    });
  }

  handleSave(path) {
    const formData = this.props.data;
    const pageFields = this.props.uiData.pages[path].fields;

    this.props.onFieldsInitialized(pageFields);
    if (validations.isValidPage(path, formData)) {
      this.props.onUpdateEditStatus(path, false);
    }
    this.scrollToPage(path);
  }

  handleEdit(path) {
    this.props.onUpdateEditStatus(path, true);
    this.scrollToPage(path);
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
            const editing = this.props.uiData.pages[page.path].editOnReview;

            return (
              <div key={page.path} className="form-review-panel-page">
                <Element name={`${page.path}ScrollElement`}/>
                {!editing && !!ReviewComponent &&
                  <div className="form-review-panel-page-header-row">
                    <h5 className="form-review-panel-page-header">{pageCount > 1 && page.name}</h5>
                    <button
                        className="edit-btn primary-outline"
                        onClick={() => this.handleEdit(page.path)}><i className="fa before-text fa-pencil"></i>Edit</button>
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
            {this.state.open && pageContent}
          </li>
        </ul>
      </div>
    );
  }
}

ReviewCollapsiblePanel.propTypes = {
  chapter: React.PropTypes.string.isRequired,
  pages: React.PropTypes.array.isRequired,
  data: React.PropTypes.object.isRequired,
  uiData: React.PropTypes.object.isRequired,
  onFieldsInitialized: React.PropTypes.func.isRequired,
  onStateChange: React.PropTypes.func.isRequired,
  onUpdateEditStatus: React.PropTypes.func.isRequired
};
