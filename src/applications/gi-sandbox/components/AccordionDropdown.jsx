import React, { useState } from 'react';

const AccordionDropdown = ({
  children,
  buttonLabel,
  buttonOnClick,
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
    <div className="accordion-dropdown-test">
      <div
        className="vads-u-padding-x--1p5 vads-u-padding-y--1"
        onClick={toggleExpanded}
      >
        <div className="opener">
          <label>{label}</label>
        </div>
      </div>
      <div>
        {isOpen && (
          <div className="accordion-dropdown-out vads-u-padding-x--0p25 vads-u-padding-top--0 vads-u-padding-bottom--2 vads-u-background-color--gray-lightest">
            <div className="vads-u-padding-x--5  vads-u-background-color--white vads-u-padding-top--1">
              <form>
                {children}

                <div className="footer-controls">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionDropdown;
