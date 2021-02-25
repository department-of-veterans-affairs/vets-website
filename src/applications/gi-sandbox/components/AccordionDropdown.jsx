import React, { useState } from 'react';

const AccordionDropdown = ({
  children,
  buttonLabel,
  buttonOnClick,
  displayCancel,
  label,
  name,
  onOpen,
  openName,
}) => {
  const [expanded, setExpanded] = useState(false);
  const wrongOpenName = openName !== name && onOpen && name;
  const displayButton = buttonLabel && buttonOnClick;
  const isOpen = expanded && !wrongOpenName;

  if (wrongOpenName && expanded) {
    setExpanded(false);
  }

  const toggleExpanded = () => {
    setExpanded(!expanded);

    if (!expanded && onOpen) {
      onOpen(name);
    }
  };

  return (
    <div className="accordion-dropdown">
      <div
        className="vads-u-padding-x--1p5 vads-u-padding-y--1"
        onClick={toggleExpanded}
      >
        <div className="opener">
          <label>{label}</label>
        </div>
      </div>

      {isOpen && (
        <div className="accordion-dropdown-out">
          <form>
            {children}

            <div className="footer-controls">
              {displayCancel && (
                <span className="cancel" onClick={toggleExpanded}>
                  Cancel
                </span>
              )}

              {displayButton && (
                <button
                  type="button"
                  id="update-benefits-button"
                  className="calculate-button"
                  onClick={buttonOnClick}
                >
                  {buttonLabel}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccordionDropdown;
