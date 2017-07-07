import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

export default class CollapsiblePanel extends React.Component {
  constructor() {
    super();
    this.toggleChapter = this.toggleChapter.bind(this);
    this.state = { open: false };
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  scrollToTop() {
    scroller.scrollTo(`collapsible-panel-${this.id}-scroll-element`, {
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
        <div className="usa-accordion-content">
          {this.props.children}
        </div>
      );
    }

    return (
      <div className="usa-accordion-bordered form-review-panel">
        <Element name={`collapsible-panel-${this.id}-scroll-element`}/>
        <div className="accordion-header clearfix">
          <button
              className="usa-button-unstyled"
              aria-expanded={this.state.open ? 'true' : 'false'}
              aria-controls={`collapsible-${this.id}`}
              onClick={this.toggleChapter}>
            {this.props.panelName}
          </button>
        </div>
        <div id={`collapsible-${this.id}`}>
          {pageContent}
        </div>
      </div>
    );
  }
}

CollapsiblePanel.propTypes = {
  panelName: PropTypes.string.isRequired
};
