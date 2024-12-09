import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { createId, isProductionOrTestProdEnv } from '../utils/helpers';
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
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
        <button
          id={`${id}-button`}
          onClick={toggle}
          className="usa-accordion-button vads-u-font-size--md"
          aria-expanded={isExpanded}
          aria-controls={id}
          data-testid="update-tuition-housing"
        >
          <span className="vads-u-font-family--serif accordion-button-text">
            {button}
          </span>
        </button>
      </h2>
    );
  };
  const updateResultsButtonsWarper = classNames(
    'vads-u-height--auto',
    'vads-u-display--flex',
    'vads-u-flex-direction--column',
    'vads-u-align-items--center',
    'vads-u-justify-content--center',
    'vads-u-width--full',
    'vads-u-padding-x--2p5',
    'vads-u-padding-bottom--1p5',
    'vads-u-background-color--gray-lightest',
  );
  const updateResultsButton = classNames(
    'vads-u-width--full',
    'vads-u-margin-bottom--1',
    'vads-u-background-color--primary',
    'vads-u-color--white',
    'vads-u-border--0',
    'vads-u-text-align--center',
    'vads-u-margin-top--1p5',
    'vads-u-margin-x--2p5',
    'vads-u-margin-bottom--1',
  );
  const clearFiltersButton = classNames(
    'vads-u-width--full',
    'vads-u-margin-x--2p5',
    'vads-u-text-align--center',
  );

  return (
    <div className="usa-accordion-item" id={id}>
      {renderHeader()}
      <div
        id={`${id}-content`}
        className="usa-accordion-content update-results-form vads-u-padding-y--1"
        aria-hidden={!expanded}
        hidden={!expanded}
      >
        {expanded ? children : null}
      </div>
      {expanded && (
        <div
          className={
            isProductionOrTestProdEnv()
              ? updateResultsButtonsWarper
              : 'update-results'
          }
        >
          <VaButton
            id={buttonId}
            className={`update-results-button-after ${updateResultsButton}`}
            onClick={buttonOnClick}
            aria-describedby={ariaDescribedBy}
            text={buttonLabel}
            data-testid="update-estimates"
          />
          {isProductionOrTestProdEnv() && (
            <ClearFiltersBtn
              onClick={dispatchFocusSearch}
              className={`clear-filters-button-after ${clearFiltersButton}`}
            />
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
