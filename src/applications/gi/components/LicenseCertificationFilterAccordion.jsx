import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ClearFiltersBtn from './ClearFiltersBtn';

// Consider using redux actions, as in SearchAccordion -- ok to use local state, since state is limited to this page?
// Examine use of/need for 'id', 'buttonId', and 'isProductionOrTestProdEnv' in SearchAccordion-- for testing or anyalytics? Necessary here?
// Upon answering these questions, assess the reusability of the original SearchAccordion component to avoid repetion.

export default function LicenseCertificationFilterAccordion({
  children,
  buttonLabel,
  button,
  buttonOnClick, // update results
  onClick,
  headerClass,
  ariaDescribedBy,
  expanded,
  resetSearch,
}) {
  const [isExpanded, setExpanded] = useState(expanded);

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
          // id={`${id}-button`}
          onClick={toggle}
          className="usa-accordion-button vads-u-font-size--md vads-u-padding-right--3"
          // aria-isExpanded={isExpanded}
          // aria-controls={id}
          data-testid="update-lc-search"
        >
          <div className="vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between">
            <span className="vads-u-font-family--serif accordion-button-text">
              {buttonLabel}
            </span>

            <va-icon icon={isExpanded ? 'remove' : 'add'} size={3} />
          </div>
        </button>
      </h2>
    );
  };

  const updateResultsButtonsWrapper = classNames(
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
    <div className="usa-accordion-item">
      {renderHeader()}
      <div
        className="usa-accordion-content update-results-form vads-u-padding-top--5 vads-u-padding-bottom--3 "
        aria-hidden={!isExpanded}
        hidden={!isExpanded}
      >
        {isExpanded ? children : null}
      </div>
      {isExpanded && (
        <div className={updateResultsButtonsWrapper}>
          <VaButton
            className={`update-results-button-after ${updateResultsButton}`}
            onClick={buttonOnClick}
            aria-describedby={ariaDescribedBy}
            text={button}
          />
          <ClearFiltersBtn
            onClick={resetSearch}
            className={`clear-filters-button-after ${clearFiltersButton}`}
          />
        </div>
      )}
    </div>
  );
}

LicenseCertificationFilterAccordion.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  // buttonOnClick: PropTypes.func.isRequired,
  buttonOnClick: PropTypes.func,
  ariaDescribedBy: PropTypes.string,
  children: PropTypes.node,
  dispatchFocusSearch: PropTypes.func,
  isExpanded: PropTypes.bool,
  headerClass: PropTypes.string,
  onClick: PropTypes.func,
};
