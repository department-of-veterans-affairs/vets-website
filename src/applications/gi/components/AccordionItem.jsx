import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import { createId } from '../utils/helpers';

class AccordionItem extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    button: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  };

  static defaultProps = {
    expanded: true,
    section: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded,
      button: props.button,
      section: props.section,
    };
    this.id = _.uniqueId('accordion-item-');
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });

    recordEvent({
      event: this.state.expanded
        ? 'nav-accordion-collapse'
        : 'nav-accordion-expand',
    });
  };

  renderHeader = () => {
    const expanded = this.state.expanded;

    if (this.state.section) {
      return (
        <button
          aria-expanded={expanded}
          aria-controls={this.id}
          onClick={this.toggle}
          className="usa-button-secondary"
        >
          {this.props.button}
        </button>
      );
    }

    const headerClasses = classNames('accordion-button-wrapper', {
      [this.props.headerClass]: this.props.headerClass,
    });

    return (
      <h2 aria-live="off" className={headerClasses}>
        <button
          onClick={this.toggle}
          className="usa-accordion-button"
          aria-expanded={expanded}
          aria-controls={this.id}
        >
          <span className="vads-u-font-family--serif accordion-button-text">
            {this.props.button}
          </span>
        </button>
      </h2>
    );
  };

  render() {
    const expanded = this.state.expanded;
    const label = this.state.button;
    const childrenClassName = this.state.section
      ? null
      : 'usa-accordion-content';
    return (
      <li aria-label={label} id={`${createId(this.props.button)}-accordion`}>
        {this.renderHeader()}
        <div id={this.id} className={childrenClassName} aria-hidden={!expanded}>
          {expanded ? this.props.children : null}
        </div>
      </li>
    );
  }
}

export default AccordionItem;
