import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ClearFiltersBtn from './ClearFiltersBtn';

// TODO: Assess reusability of SearchAccordion component to avoid repetition.
export default function LicenseCertificationFilterAccordion({
  children,
  buttonLabel,
  button,
  buttonOnClick, // update results
  onClick,
  headerClass,
  expanded,
  resetSearch,
}) {
  const [isExpanded, setExpanded] = useState(expanded || false);

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
          onClick={toggle}
          className="usa-accordion-button vads-u-font-size--md vads-u-padding-right--3"
          aria-label={`${buttonLabel} ${isExpanded ? 'expanded' : 'collapsed'}`}
          data-testid="update-lc-search"
        >
          <div className="vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between">
            <span className="vads-u-font-family--serif accordion-button-text">
              {buttonLabel}
            </span>
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
        className={`usa-accordion-content ${isExpanded &&
          `update-results-form vads-u-padding-top--5 vads-u-padding-bottom--3`} `}
        aria-hidden={!isExpanded}
        hidden={!isExpanded}
        role="region"
      >
        {isExpanded ? children : null}
      </div>
      {isExpanded && (
        <div className={updateResultsButtonsWrapper}>
          <VaButton
            className={`update-results-button-after ${updateResultsButton}`}
            onClick={buttonOnClick}
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
  button: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  buttonOnClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  expanded: PropTypes.bool,
  headerClass: PropTypes.string,
  onClick: PropTypes.func,
  resetSearch: PropTypes.func.isRequired,
};

LicenseCertificationFilterAccordion.defaultProps = {
  expanded: false,
  onClick: () => {},
  headerClass: '',
  ariaDescribedBy: '',
};
