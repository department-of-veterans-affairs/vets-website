import React, { useState } from 'react';
import { Element } from 'react-scroll';
import classNames from 'classnames';

const ExpandableSection = ({ header, pageContent }) => {
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
    <div id={`${header}-collapsiblePanel`}>
      <Element name={`chapter${header}ScrollElement`} />
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <div className="input-section">
        <div
          id="3-collapsiblePanel"
          className="usa-accordion-bordered form-review-panel"
          data-chapter="applicantInformation"
        >
          <div name="chapterapplicantInformationScrollElement" />
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
        </div>
      </div>
    </div>
  );
};

export default ExpandableSection;
