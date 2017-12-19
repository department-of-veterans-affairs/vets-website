import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentWillMount() {
    this.props.container.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.props.container.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleDocumentClick(event) {
    // If this dropdown is open, and it's not an element within this dropdown being clicked,
    // then the user clicked elsewhere and we should invoke the click handler to toggle this
    // dropdown to closed.
    if (this.props.isOpen && !this.dropdownDiv.contains(event.target)) {
      this.toggleDropDown();
    }
  }

  toggleDropDown() {
    this.props.clickHandler();
  }

  render() {
    const buttonClasses = classNames(
      this.props.cssClass,
      { 'va-btn-withicon': this.props.icon },
      'va-dropdown-trigger'
    );

    return (
      <div className="va-dropdown" ref={div => { this.dropdownDiv = div; }}>
        <button className={buttonClasses}
          aria-controls={this.props.id}
          aria-expanded={this.props.isOpen}
          disabled={this.props.disabled}
          onClick={this.toggleDropDown}>
          <span>
            {this.props.icon}
            {this.props.buttonText}
          </span>
        </button>
        <div className="va-dropdown-panel" id={this.props.id} hidden={!this.props.isOpen}>
          {this.props.contents}
        </div>
      </div>
    );
  }
}

DropDown.propTypes = {
  buttonText: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  cssClass: PropTypes.string,

  // 'container' is the parent DOM element that will close the dropdown when clicked,
  // assuming the child element is not contained by the dropdown's element.
  // This is a DOM element, not a React element, because the dropdown may need to respond
  // to events occurring outside of the React context.
  container: PropTypes.oneOfType([
    PropTypes.instanceOf(window.HTMLDocument),
    PropTypes.instanceOf(window.HTMLElement)
  ]),
  contents: PropTypes.node.isRequired,
  icon: PropTypes.node, /* Should be SVG markup */
  id: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  disabled: PropTypes.bool
};

DropDown.defaultProps = {
  container: window.document,
  disabled: false
};

export default DropDown;
