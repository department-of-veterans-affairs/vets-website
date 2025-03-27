import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  VaButton,
  VaAccordion,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ClearFiltersBtn from './ClearFiltersBtn';

// TODO: Assess reusability of SearchAccordion component to avoid repetition.
export default function LicenseCertificationFilterAccordion({
  children,
  buttonLabel,
  button,
  buttonOnClick, // update results
  onClick,
  expanded,
  resetSearch,
}) {
  const accordionRef = useRef(null);

  useEffect(
    () => {
      if (expanded) {
        accordionRef.current.setAttribute('open', 'true');
      }
    },
    [expanded],
  );

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

  function handleToggle() {
    if (onClick) {
      onClick(!expanded);
    }
  }

  return (
    <VaAccordion ref={accordionRef} onAccordionItemToggled={handleToggle}>
      <va-accordion-item header={buttonLabel} data-testid="update-lc-search">
        <div
          className="update-results-form vads-u-padding-top--5 vads-u-padding-bottom--3"
          role="region"
        >
          {children}
        </div>
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
      </va-accordion-item>
    </VaAccordion>
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
