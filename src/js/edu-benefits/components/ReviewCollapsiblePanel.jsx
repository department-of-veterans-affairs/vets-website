import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';

import * as validations from '../utils/validations';

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

  render() {
    let panelAction;
    let buttonGroup;
    let hiddenpage;
    let scrollHelper;
    const currentPath = this.props.updatePath;
    const pagesComplete = this.props.uiData.pages[currentPath].complete;
    const pagesVerified = this.props.uiData.pages[currentPath].verified;
    const allpages = Object.keys(this.props.uiData.pages);
    const pageIndexes = allpages.indexOf(currentPath);
    const prevPath = allpages[pageIndexes - 1];

    const buttonEdit = (
      <button
          className="edit-btn primary-outline"
          onClick={this.handleEdit}><i className="fa before-text fa-pencil"></i>Edit</button>
    );

    const buttonNext = (
      <button
          className="edit-btn"
          onClick={this.handleNext}>Next<i className="fa after-text fa-angle-double-right"></i></button>
    );

    if (pagesComplete) {
      buttonGroup = (<div>
        <div className="small-6 columns">
          {buttonEdit}
        </div>
        <div className="small-6 columns">
          {buttonNext}
        </div>
      </div>
      );
    } else {
      panelAction = (<button
          className="usa-button-outline"
          onClick={this.handleSave}>Update page</button>
        );
    }

    if (pagesVerified) {
      hiddenpage = (<div></div>);
      buttonGroup = (<div>
        <div className="medium-6 medium-offset-6 columns">
          {buttonEdit}
        </div>
      </div>
      );
    } else {
      if (this.props.uiData.pages[prevPath].verified || currentPath === '/veteran-information/personal-information') {
        scrollHelper = (<Element name="topScrollReviewPanel"/>);
        hiddenpage = (
          <div id={`collapsible-${this.id}`} className="usa-accordion-content">
              {pagesComplete ? this.props.reviewComponent : this.props.component}
              {panelAction}
          </div>
        );
      } else {
        hiddenpage = (<div></div>);

        buttonGroup = (<div></div>);
      }
    }


    return (
      <div id={`${this.id}-collapsiblePanel`} className="usa-accordion-bordered form-review-panel">
        {scrollHelper}
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix" aria-expanded="true" aria-controls={`collapsible-${this.id}`}>
              <div className="medium-5 columns page-label">
                {this.props.pageLabel}
              </div>
              <div className="medium-7 columns">
                {buttonGroup}
              </div>
            </div>
            {hiddenpage}
          </li>
        </ul>
      </div>
    );
  }
}

ReviewCollapsiblePanel.propTypes = {
  pageLabel: React.PropTypes.string.isRequired,
  updatePath: React.PropTypes.string.isRequired,
  component: React.PropTypes.object.isRequired
};
