import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  VaButton,
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ClearFiltersBtn from './ClearFiltersBtn';

// TODO: Assess reusability of SearchAccordion component to avoid repetition.
export default function FilterAccordion({
  children,
  buttonLabel,
  updateResults,
  button,
  resetSearch,
}) {
  const buttonWrapper = classNames(
    'vads-u-height--auto',
    'vads-u-display--flex',
    'vads-u-flex-direction--column',
    'vads-u-align-items--center',
    'vads-u-justify-content--center',
    'vads-u-background-color--gray-lightest',
  );
  const updateResultsButton = classNames(
    'vads-u-width--full',
    'vads-u-margin-bottom--1',
    'vads-u-background-color--primary',
    'vads-u-color--white',
    'vads-u-border--0',
    'vads-u-text-align--center',
    'vads-u-margin-x--2p5',
    'vads-u-margin-bottom--1',
  );
  const clearFiltersButton = classNames(
    'vads-u-width--full',
    'vads-u-margin-x--2p5',
    'vads-u-text-align--center',
  );

  return (
    <div className="filter-accordion-wrapper">
      <VaAccordion openSingle>
        <VaAccordionItem header={buttonLabel} bordered>
          <div role="region">{children}</div>
          <div className={buttonWrapper}>
            <VaButton
              className={`update-results-button-after ${updateResultsButton}`}
              onClick={updateResults}
              text={button}
            />
            <ClearFiltersBtn
              onClick={resetSearch}
              className={`clear-filters-button-after ${clearFiltersButton}`}
            />
          </div>
        </VaAccordionItem>
      </VaAccordion>
    </div>
  );
}

FilterAccordion.propTypes = {
  button: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  expanded: PropTypes.bool,
  resetSearch: PropTypes.func.isRequired,
};

FilterAccordion.defaultProps = {
  expanded: false,
  onClick: () => {},
  headerClass: '',
  ariaDescribedBy: '',
};
