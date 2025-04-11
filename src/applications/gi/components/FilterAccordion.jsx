import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  VaButton,
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// TODO: Assess reusability of SearchAccordion component to avoid repetition.
export default function FilterAccordion({
  children,
  buttonLabel,
  updateResults,
  button,
  resetSearch,
  smallScreen,
}) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (smallScreen) {
      setIsOpen(false);
    }
  }, []);

  // Stop #content div click propagation to prevent accordion closing
  useEffect(() => {
    const accordionItem = document.querySelector('va-accordion-item');
    if (!accordionItem) return;

    const addClickHandler = contentDiv => {
      if (contentDiv) {
        const stopPropagation = e => {
          const isUpdateButtonClick = e.target.closest(
            '.update-results-button-after',
          );
          const isResetButtonClick = e.target.closest(
            '.clear-filters-button-after',
          );

          if (!isUpdateButtonClick && !isResetButtonClick) {
            e.stopPropagation();
          }
        };
        contentDiv.addEventListener('click', stopPropagation);
        return stopPropagation;
      }
      return null;
    };

    const observer = new MutationObserver(mutations => {
      mutations.forEach(() => {
        if (accordionItem.shadowRoot) {
          const contentDiv = accordionItem.shadowRoot.querySelector('#content');
          if (contentDiv) {
            addClickHandler(contentDiv);
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(accordionItem, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    let clickHandler = null;
    if (accordionItem.shadowRoot) {
      const contentDiv = accordionItem.shadowRoot.querySelector('#content');
      clickHandler = addClickHandler(contentDiv);
    }

    /* eslint-disable consistent-return */
    return () => {
      observer.disconnect();
      if (clickHandler && accordionItem.shadowRoot) {
        const contentDiv = accordionItem.shadowRoot.querySelector('#content');
        if (contentDiv) {
          contentDiv.removeEventListener('click', clickHandler);
        }
      }
    };
    /* eslint-enable consistent-return */
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

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
        <VaAccordionItem
          header={buttonLabel}
          bordered
          open={isOpen}
          onClick={handleToggle}
        >
          <div role="region" data-testid="filter-accordion-content">
            {children}
          </div>
          <div className={buttonWrapper}>
            <VaButton
              className={`update-results-button-after ${updateResultsButton}`}
              onClick={e => {
                e.stopPropagation();
                updateResults();
              }}
              text={button}
            />
            <VaButton
              secondary
              text="Reset search"
              className={`clear-filters-button-after ${clearFiltersButton}`}
              onClick={e => {
                e.stopPropagation();
                resetSearch();
              }}
              data-testid="clear-button"
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
  resetSearch: PropTypes.func.isRequired,
  open: PropTypes.bool,
  updateResults: PropTypes.func,
};

FilterAccordion.defaultProps = {
  open: false,
  onClick: () => {},
  headerClass: '',
  ariaDescribedBy: '',
  updateResults: () => {},
};
