import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

class AccordionItem extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      expanded: props.expanded,
    };
    this.id = _.uniqueId('accordion-item-');
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const expanded = this.state.expanded;
    return (
      <li>
        <h2 className="accordion-button-wrapper">
          <button
            onClick={this.toggle}
            className="usa-accordion-button"
            aria-expanded={expanded}
            aria-controls={this.id}
          >
            <span className="accordion-button-text">{this.props.button}</span>
          </button>
        </h2>
        <div
          id={this.id}
          className="usa-accordion-content"
          aria-hidden={!expanded}
        >
          {this.props.children}
        </div>
      </li>
    );
  }
}

AccordionItem.propTypes = {
  expanded: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  button: PropTypes.string.isRequired,
};

AccordionItem.defaultProps = {
  expanded: true,
};

export default AccordionItem;
