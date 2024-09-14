import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createId, isProductionOrTestProdEnv } from '../utils/helpers';
import ClearFiltersBtn from './ClearFiltersBtn';
import Button from './Button';

export default function SearchAccordion({
  expanded,
  children,
  buttonLabel,
  button,
  buttonOnClick,
  onClick,
  headerClass,
  ariaDescribedBy,
  dispatchFocusSearch,
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
        <Button
          id={`${id}-button`}
          onClick={toggle}
          className="usa-accordion-button vads-u-font-size--md"
          ariaExpanded={isExpanded}
          ariaControls={id}
          dataTestId="update-tuition-housing"
        >
          <span className="vads-u-font-family--serif accordion-button-text">
            {button}
          </span>
        </Button>
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
            isProductionOrTestProdEnv() ? 'update-results-2' : 'update-results'
          }
        >
          {' '}
          <Button
            type="button"
            id={buttonId}
            className="update-results-button"
            onClick={buttonOnClick}
            ariaDescribedBy={ariaDescribedBy}
          >
            {buttonLabel}
          </Button>
          {isProductionOrTestProdEnv() && (
            <ClearFiltersBtn
              onClick={dispatchFocusSearch}
              testId="clear-button"
            >
              Reset search
            </ClearFiltersBtn>
          )}
        </div>
      )}
    </div>
  );
}

SearchAccordion.propTypes = {
  button: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  buttonOnClick: PropTypes.func.isRequired,
  ariaDescribedBy: PropTypes.string,
  children: PropTypes.node,
  dispatchFocusSearch: PropTypes.func,
  expanded: PropTypes.bool,
  headerClass: PropTypes.string,
  onClick: PropTypes.func,
};
