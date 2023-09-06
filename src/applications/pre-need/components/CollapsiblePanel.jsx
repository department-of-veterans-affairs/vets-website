import React, { useState } from 'react';
import classNames from 'classnames';

const CollapsiblePanel = ({ header, pageContent }) => {
  const [open, setOpen] = useState(false);

  const headerClasses = classNames(
    'accordion-header',
    'clearfix',
    'schemaform-chapter-accordion-header',
    'vads-u-font-size--h4',
    'vads-u-margin-top--0',
  );

  function handleClick() {
    setOpen(!open);
  }

  return (
    <>
      <h3 className={headerClasses}>
        <button
          className="usa-button-unstyled"
          aria-expanded={open}
          aria-controls="collapsible-3"
          id="collapsibleButton3"
          type="button"
          onClick={handleClick}
        >
          {header || ''}
        </button>
      </h3>
      {open && (
        <div id="collapsible-3">
          <div
            className="usa-accordion-content schemaform-chapter-accordion-content"
            aria-hidden="false"
          >
            <div className="form-review-panel-page">
              <div name="supportingDocumentsScrollElement">
                <div id={`collapsible-${header}`}>{pageContent}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CollapsiblePanel;
