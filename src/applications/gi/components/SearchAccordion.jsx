import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { createId, isProductionOfTestProdEnv } from '../utils/helpers';
import ClearFiltersBtn from './ClearFiltersBtn';

export default function SearchAccordion({
  expanded,
  children,
  buttonLabel,
  button,
  buttonOnClick,
  onClick,
  headerClass,
  ariaDescribedBy,
}) {
  const [isExpanded, setExpanded] = useState(expanded || false);
  const [id] = useState(`${createId(button)}-accordion`);
  const [buttonId] = useState(`update-${createId(button)}-button`);

  useEffect(
    () => {
      setExpanded(expanded);
    },
    [expanded],
  );

  const toggle = () => {
    setExpanded(!isExpanded);
    if (onClick) {
      onClick(!isExpanded);
    }
  };

  const renderHeader = () => {
    const headerClasses = classNames(
      'accordion-button-wrapper update-results-header ',
      {
        [headerClass]: headerClass,
      },
    );

    return (
      <h2 className={headerClasses}>
        <button
          id={`${id}-button`}
          onClick={toggle}
          className="usa-accordion-button vads-u-font-size--md"
          aria-expanded={isExpanded}
          aria-controls={id}
        >
          <span className="vads-u-font-family--serif accordion-button-text">
            {button}
          </span>
        </button>
      </h2>
    );
  };

  return (
    <div className="usa-accordion-item" id={id}>
      {renderHeader()}
      <div
        id={`${id}-content`}
        className="usa-accordion-content update-results-form"
        aria-hidden={!expanded}
        hidden={!expanded}
      >
        {expanded ? children : null}
      </div>
      {expanded && (
        <div
          className={
            isProductionOfTestProdEnv() ? 'update-results' : 'update-results-2'
          }
        >
          {' '}
          <button
            type="button"
            id={buttonId}
            className="update-results-button"
            onClick={buttonOnClick}
            aria-describedby={ariaDescribedBy}
          >
            {buttonLabel}
          </button>
          {!isProductionOfTestProdEnv() && (
            <ClearFiltersBtn>Clear filters</ClearFiltersBtn>
          )}
        </div>
      )}
    </div>
  );
}
