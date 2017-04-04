import React from 'react';

class AccordionItem extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      expanded: props.expanded,
    };
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const expanded = this.state.expanded;
    return (
      <li>
        <button onClick={this.toggle} className="usa-accordion-button" aria-expanded={expanded} aria-controls="amendment-1">
          <h2>{this.props.button}</h2>
        </button>
        <div id="amendment-1" className="usa-accordion-content" aria-hidden={!expanded}>
          {this.props.children}
        </div>
      </li>
    );
  }

}

AccordionItem.propTypes = {
  expanded: React.PropTypes.bool.isRequired,
  children: React.PropTypes.node.isRequired,
  button: React.PropTypes.string.isRequired,
};

AccordionItem.defaultProps = {
  expanded: false
};

export default AccordionItem;
