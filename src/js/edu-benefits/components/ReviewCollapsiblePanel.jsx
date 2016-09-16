import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';

import * as validations from '../utils/validations';
import { getActivePages } from '../../common/utils/helpers';
import { pages } from '../routes';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

/**
 * A component for the review page to validate information is correct.
 *
 * Required props
 */

export default class ReviewCollapsiblePanel extends React.Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  scrollToTop() {
    scroller.scrollTo('topScrollReviewPanel', {
      duration: 500,
      delay: 2,
      smooth: true,
    });
  }

  handleSave() {
    const currentPath = this.props.updatePath;
    const formData = this.props.data;
    const pageFields = this.props.uiData.pages[currentPath].fields;

    this.props.onFieldsInitialized(pageFields);
    if (validations.isValidPage(currentPath, formData)) {
      this.props.onUpdateSaveStatus(currentPath);
    }
    this.scrollToTop();
  }

  handleNext() {
    const currentPath = this.props.updatePath;
    this.props.onUpdateVerifiedStatus(currentPath, true);
    // TODO: find a better solution for this or a different implementation.
    setTimeout(() => this.scrollToTop(), 100);  // eslint-disable-line scanjs-rules/call_setTimeout
  }

  handleEdit() {
    const currentPath = this.props.updatePath;
    this.props.onUpdateEditStatus(currentPath);
    this.props.onUpdateVerifiedStatus(currentPath, false);
    this.scrollToTop();
  }

  allPreviousPagesVerified(pageState, data, currentPath) {
    const filteredPages = getActivePages(pages, data);
    const pageIndex = filteredPages.map(page => page.name).indexOf(currentPath);
    const prevPath = filteredPages[pageIndex - 1].name;
    return pageIndex === 1 || pageState[prevPath].verified;
  }

  render() {
    const currentPath = this.props.updatePath;
    const pageComplete = this.props.uiData.pages[currentPath].complete;
    const pageVerified = this.props.uiData.pages[currentPath].verified;

    const prevPagesVerified = this.allPreviousPagesVerified(this.props.uiData.pages, this.props.data, currentPath);
    const panelActive = !pageVerified && prevPagesVerified;

    const editButtonVisible = (pageVerified || pageComplete) && prevPagesVerified;
    const nextButtonVisible = !pageVerified && pageComplete && prevPagesVerified;

    const editButtonClasses = pageVerified ? 'medium-6 medium-offset-6 columns' : 'small-6 columns';
    const buttonEdit = (
      <div className={editButtonClasses}>
        <button
            className="edit-btn primary-outline"
            onClick={this.handleEdit}><i className="fa before-text fa-pencil"></i>Edit</button>
      </div>
    );
    const buttonNext = (
      <div className="small-6 columns">
        <button
            className="edit-btn"
            onClick={this.handleNext}>Next<i className="fa after-text fa-angle-double-right"></i></button>
      </div>
    );

    const panelAction = (<button
        className="usa-button-outline"
        onClick={this.handleSave}>Update page</button>
    );

    const pageContent = (
      <div id={`collapsible-${this.id}`} className="usa-accordion-content">
          {pageComplete ? this.props.reviewComponent : this.props.component}
          {!pageComplete ? panelAction : null}
      </div>
    );

    return (
      <div id={`${this.id}-collapsiblePanel`} className="usa-accordion-bordered form-review-panel">
        {panelActive ? <Element name="topScrollReviewPanel"/> : null}
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix" aria-expanded="true" aria-controls={`collapsible-${this.id}`}>
              <div className="medium-5 columns page-label">
                {this.props.pageLabel}
              </div>
              <div className="medium-7 columns">
                <div>
                  {editButtonVisible ? buttonEdit : null}
                  {nextButtonVisible ? buttonNext : null}
                </div>
              </div>
            </div>
            {panelActive ? pageContent : null}
          </li>
        </ul>
      </div>
    );
  }
}

ReviewCollapsiblePanel.propTypes = {
  data: React.PropTypes.object.isRequired,
  uiData: React.PropTypes.object.isRequired,
  pageLabel: React.PropTypes.string.isRequired,
  updatePath: React.PropTypes.string.isRequired,
  component: React.PropTypes.object.isRequired,
  reviewComponent: React.PropTypes.object.isRequired,
  onFieldsInitialized: React.PropTypes.func.isRequired,
  onUpdateSaveStatus: React.PropTypes.func.isRequired,
  onUpdateVerifiedStatus: React.PropTypes.func.isRequired,
  onUpdateEditStatus: React.PropTypes.func.isRequired
};
