import React, { useState } from 'react';

const AccordionDropdown = ({
  children,
  buttonLabel,
  buttonOnClick,
  displayCancel,
  label,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="vads-u-background-color--white">
      <div onClick={toggleExpanded} className="vads-u-background-color--white">
        {label} V
      </div>
      {expanded && (
        <div
          style={{ position: 'absolute', zIndex: 100 }}
          className="vads-u-border--1px vads-u-background-color--white"
        >
          <form>
            {children}

            {displayCancel && <span onClick={toggleExpanded}>Cancel</span>}

            {buttonLabel &&
              buttonOnClick && (
                <button
                  type="button"
                  id="update-benefits-button"
                  className="calculate-button"
                  onClick={buttonOnClick}
                >
                  {buttonLabel}
                </button>
              )}
          </form>
        </div>
      )}
    </div>
  );
};

export default AccordionDropdown;
