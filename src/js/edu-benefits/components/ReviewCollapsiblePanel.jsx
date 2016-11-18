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
    this.handleEdit = this.handleEdit.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.toggleChapter = this.toggleChapter.bind(this);
    this.state = { open: false };
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

  handleSave(path) {
    const formData = this.props.data;
    const pageFields = this.props.uiData.pages[path].fields;

    this.props.onFieldsInitialized(pageFields);
    if (validations.isValidPage(path, formData)) {
      this.props.onUpdateEditStatus(path, false);
    }
    // this.scrollToTop();
  }

  handleEdit(path) {
    this.props.onUpdateEditStatus(path, true);
    // this.scrollToTop();
  }

  toggleChapter() {
    this.setState({ open: !this.state.open });
  }

  render() {
    let pageContent = null;
    if (this.state.open) {
      pageContent = (
        <div id={`collapsible-${this.id}`} className="usa-accordion-content">
          {this.props.pages.map(page => {
            const ReviewComponent = page.reviewComponent;
            const Component = page.fieldsComponent;
            const editing = this.props.uiData.pages[page.path].reviewEdit;

            return (
              <div key={page.path} className="form-review-panel-page">
                <Element name={`page${page.path}ScrollElement`}/>
                {!editing &&
                  <div className="form-review-panel-edit">
                    <button
                        className="edit-btn primary-outline"
                        onClick={() => this.handleEdit(page.path)}><i className="fa before-text fa-pencil"></i>Edit</button>
                  </div>}
                {!editing
                    ? <ReviewComponent data={this.props.data}/>
                    : <Component
                        data={this.props.data}
                        onStateChange={this.props.onStateChange}
                        initializeFields={this.props.onFieldsInitialized}/>}
                {editing && <button
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
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix" aria-expanded={this.state.open ? 'true' : 'false'} aria-controls={`collapsible-${this.id}`} onClick={this.toggleChapter}>
              {this.props.chapter}
            </div>
            {this.state.open && pageContent}
          </li>
        </ul>
      </div>
    );
  }
}

ReviewCollapsiblePanel.propTypes = {
  data: React.PropTypes.object.isRequired,
  uiData: React.PropTypes.object.isRequired,
  onFieldsInitialized: React.PropTypes.func.isRequired,
  onUpdateEditStatus: React.PropTypes.func.isRequired
};
