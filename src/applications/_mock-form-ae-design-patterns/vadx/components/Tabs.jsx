import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * @component Tabs
 * @description A horizontal set of tabs that includes custom tab names and content
 *
 * @param {Object[]} tabs - Array of tab objects containing label and content
 * @param {number} activeTab - Index of the currently active tab
 * @param {Function} onTabClick - Callback function when a tab is clicked
 */
export const Tabs = ({ tabs, activeTab: controlledActiveTab, onTabClick }) => {
  const [activeTab, setActiveTab] = useState(controlledActiveTab || 0);
  const [focusIndex, setFocusIndex] = useState(activeTab);
  const tabRefs = useRef([]);

  useEffect(
    () => {
      if (controlledActiveTab !== undefined) {
        setActiveTab(controlledActiveTab);
      }
    },
    [controlledActiveTab],
  );

  const handleTabClick = index => {
    setActiveTab(index);
    setFocusIndex(index);
    if (onTabClick) {
      onTabClick(index);
    }
  };

  const handleKeyDown = event => {
    let newFocusIndex;

    switch (event.key) {
      case 'ArrowLeft':
        newFocusIndex = (focusIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'ArrowRight':
        newFocusIndex = (focusIndex + 1) % tabs.length;
        break;
      case 'Home':
        newFocusIndex = 0;
        break;
      case 'End':
        newFocusIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setFocusIndex(newFocusIndex);
    tabRefs.current[newFocusIndex]?.focus();
  };

  return (
    <div className="vads-l-grid-container">
      <div
        role="tablist"
        className="vads-u-border-bottom--2px vads-u-border-color--gray-light"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            ref={el => {
              tabRefs.current[index] = el;
              return el;
            }}
            className={`
              vads-u-font-family--sans
              vads-u-padding-y--1
              vads-u-padding-x--2
              vads-u-margin-bottom--neg2px
              vads-u-border--2px
              vads-u-border-bottom--0
              vads-u-background-color--white
              ${
                index === activeTab
                  ? 'vads-u-color--primary vads-u-border-color--primary'
                  : 'vads-u-color--gray vads-u-border-color--transparent'
              }
              ${index === focusIndex ? 'vads-u-outline--none' : ''}
            `}
            id={`tab-${index}`}
            aria-selected={index === activeTab}
            aria-controls={`tabpanel-${index}`}
            tabIndex={index === focusIndex ? 0 : -1}
            onClick={() => handleTabClick(index)}
            onKeyDown={e => handleKeyDown(e)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          hidden={index !== activeTab}
          className="vads-u-padding-top--2"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
  activeTab: PropTypes.number,
  onTabClick: PropTypes.func,
};
