import React from 'react';
import Scroll from 'react-scroll';
import { connect } from 'react-redux';
import _ from 'lodash';

import { ensureFieldsInitialized, updateIncompleteStatus, updateVerifiedStatus, updateCompletedStatus } from '../../actions';
import * as validations from '../../utils/validations';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

/**
 * A component for the review section to validate information is correct.
 *
 * Required props
 */

class ReviewCollapsiblePanel extends React.Component {
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
    const sectionFields = this.props.uiData.sections[currentPath].fields;

    this.props.onFieldsInitialized(sectionFields);
    if (validations.isValidSection(currentPath, formData)) {
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
    let hiddenSection;
    let scrollHelper;
    const currentPath = this.props.updatePath;
    const sectionsComplete = this.props.uiData.sections[currentPath].complete;
    const sectionsVerified = this.props.uiData.sections[currentPath].verified;
    const allSections = Object.keys(this.props.uiData.sections);
    const sectionIndexes = allSections.indexOf(currentPath);
    const prevPath = allSections[sectionIndexes - 1];

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

    if (sectionsComplete) {
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
          onClick={this.handleSave}>Update Section</button>
        );
    }

    if (sectionsVerified) {
      hiddenSection = (<div></div>);
      buttonGroup = (<div>
        <div className="medium-6 medium-offset-6 columns">
          {buttonEdit}
        </div>
      </div>
      );
    } else {
      if (this.props.uiData.sections[prevPath].verified || currentPath === '/veteran-information/personal-information') {
        scrollHelper = (<Element name="topScrollReviewPanel"/>);
        hiddenSection = (
          <div id={`collapsible-${this.id}`} className="usa-accordion-content">
              {this.props.component}
              {panelAction}
          </div>
        );
      } else {
        hiddenSection = (<div></div>);

        buttonGroup = (<div></div>);
      }
    }


    return (
      <div id={`${this.id}-collapsiblePanel`} className="usa-accordion-bordered hca-review-panel">
        {scrollHelper}
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix" aria-expanded="true" aria-controls={`collapsible-${this.id}`}>
              <div className="medium-5 columns section-label">
                {this.props.sectionLabel}
              </div>
              <div className="medium-7 columns">
                {buttonGroup}
              </div>
            </div>
            {hiddenSection}
          </li>
        </ul>
      </div>
    );
  }
}

ReviewCollapsiblePanel.propTypes = {
  sectionLabel: React.PropTypes.string.isRequired,
  updatePath: React.PropTypes.string.isRequired,
  component: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    data: state.veteran,
    uiData: state.uiState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateEditStatus: (path) => {
      dispatch(updateIncompleteStatus(path));
    },
    onUpdateSaveStatus: (path) => {
      dispatch(updateCompletedStatus(path));
    },
    onUpdateVerifiedStatus: (path, update) => {
      dispatch(updateVerifiedStatus(path, update));
    },
    onFieldsInitialized: (field) => {
      dispatch(ensureFieldsInitialized(field));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ReviewCollapsiblePanel);
export { ReviewCollapsiblePanel };
