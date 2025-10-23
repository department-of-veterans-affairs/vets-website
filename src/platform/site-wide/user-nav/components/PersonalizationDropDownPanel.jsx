import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export default class PersonalizationDropDownPanel extends React.Component {
  componentDidMount() {
    document.body.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleDocumentClick = event => {
    // If this dropdown is open, and it's not an element within this dropdown being clicked,
    // then the user clicked elsewhere and we should invoke the click handler to toggle this
    // dropdown to closed.
    if (this.props.isOpen && !this.dropdownDiv.contains(event.target)) {
      this.toggleDropDown(event);
    }
  };

  toggleDropDown = event => {
    event.stopPropagation();
    this.props.clickHandler();
  };

  render() {
    const buttonClasses = classNames(
      this.props.cssClass,
      { 'va-btn-withicon': this.props.icon },
      'va-dropdown-trigger',
    );

    return (
      <div
        className="va-dropdown"
        ref={div => {
          this.dropdownDiv = div;
        }}
      >
        <button
          className={buttonClasses}
          aria-controls={this.props.id}
          aria-expanded={this.props.isOpen}
          disabled={this.props.disabled}
          onClick={this.toggleDropDown}
          type="button"
        >
          <span>
            {this.props.icon}
            {this.props.buttonText}
          </span>
        </button>
        <div
          className={`va-dropdown-panel ${this.props.dropdownPanelClassNames}`}
          id={this.props.id}
          hidden={!this.props.isOpen}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

PersonalizationDropDownPanel.propTypes = {
  /**
   * The text of the drop down button.
   */
  buttonText: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
    .isRequired,

  /**
   * A function called when the drop down button is clicked. This is often used
   * to set the open state in the parent component, which passes down the new
   * isOpen prop.
   */
  clickHandler: PropTypes.func.isRequired,

  /**
   * Whether the drop down panel is open.
   */
  isOpen: PropTypes.bool.isRequired,

  /**
   * The children of the drop down panel.
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),

  /**
   * Any CSS classes to apply to the button itself.
   */
  cssClass: PropTypes.string,

  /**
   * The disabled state of the drop down button.
   */
  disabled: PropTypes.bool,

  /**
   * The string of classnames for the dropdown panel container.
   */
  dropdownPanelClassNames: PropTypes.string,

  /**
   * An SVG icon to render before the button text.
   */
  icon: PropTypes.node,

  /**
   * The ID of the <div> surrounding the children.
   */
  id: PropTypes.string,
};

PersonalizationDropDownPanel.defaultProps = {
  dropdownPanelClassNames: '',
  disabled: false,
};
