import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  VaButton,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { createId, isProductionOrTestProdEnv } from '../utils/helpers';
import ClearFiltersBtn from './ClearFiltersBtn';

export default function SearchAccordion({
  expanded,
  children,
  buttonLabel,
  button,
  buttonOnClick,
  onClick,
  ariaDescribedBy,
  dispatchFocusSearch,
  bordered,
}) {
  const [id] = useState(`${createId(button)}-accordion`);
  const [buttonId] = useState(`update-${createId(button)}-button`);
  const accordionRef = useRef(null);
  const [open, setOpen] = useState(expanded);

  const updateResultsButtonsWarper = classNames(
    'vads-u-height--auto',
    'vads-u-display--flex',
    'vads-u-flex-direction--column',
    'vads-u-align-items--center',
    'vads-u-justify-content--center',
    'vads-u-padding-bottom--1p5',
    'vads-u-background-color--gray-lightest',
  );
  const updateResultsButton = classNames(
    'vads-u-margin-bottom--1',
    'vads-u-background-color--primary',
    'vads-u-color--white',
    'vads-u-border--0',
    'vads-u-text-align--center',
    'vads-u-margin-top--1p5',
    'vads-u-margin-bottom--1',
    'search-accordion-button',
  );
  const clearFiltersButton = classNames(
    'search-accordion-button',
    'vads-u-text-align--center',
  );

  function handleToggle() {
    setOpen(!open);
    if (onClick) {
      onClick(!open);
    }
  }

  return (
    <VaAccordionItem
      onClick={handleToggle}
      ref={accordionRef}
      header={button}
      id={`${id}-button`}
      open={open}
      bordered={bordered}
    >
      <div id={`${id}-content`} className="vads-u-padding-y--1">
        {children}
      </div>

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
    </VaAccordionItem>
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
  bordered: PropTypes.bool,
};
