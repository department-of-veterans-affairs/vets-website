import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { optionalNumberBetween } from '~/applications/personalization/common/proptypeValidators';

// A derivative of the va-process-list compnenent, but with a few changes to
// support the Account Security section of the Profile.
// Conditional rendering is used to show different content based on the
// state of the user's account.
// Each list item is a process that a user may need to complete in order to
// access all of the features of VA.gov, and will diplay whether or not the
// process has been completed

export const ConditionalProcessList = ({ children }) => {
  return (
    <ol className="va-conditional-process-list vads-u-margin-y--0 vads-u-padding-x--3 medium-screen:vads-u-padding-x--5">
      {children}
    </ol>
  );
};

ConditionalProcessList.propTypes = {
  children: PropTypes.node.isRequired,
};

// The CompleteContext is used to share the `complete` state to the
// ListItem.HeadingComplete and ListItem.ContentComplete components
const CompleteContext = createContext();
CompleteContext.displayName = 'CompleteContext';

// The ListItem component is a wrapper for the list item content, and
// conditionally renders the content based on the `complete` prop

/**
 * A list item with context for whether or not the process has been completed
 *
 * @param {boolean} complete - Whether or not the process has been completed
 * @param {boolean} show - Whether or not to show the list item at all
 * @param {node} children - The content of the list item
 * @return {node} - The list item
 */
const Item = ({ complete = false, shouldShow = true, children }) => {
  return shouldShow ? (
    <li className={`item${complete ? ' item-complete' : ' item-incomplete'}`}>
      <CompleteContext.Provider value={complete}>
        {children}
      </CompleteContext.Provider>
    </li>
  ) : null;
};

Item.propTypes = {
  children: PropTypes.node.isRequired,
  complete: PropTypes.bool.isRequired,
  shouldShow: PropTypes.bool,
};

const headingClasses =
  'vads-u-margin-y--0 vads-u-padding-top--0p5 item-heading vads-u-font-size--h4';

const HeadingComplete = ({ children, headingLevel = 3 }) => {
  const complete = useContext(CompleteContext);
  const Heading = `h${headingLevel}`;
  return complete ? (
    <Heading className={headingClasses}>{children}</Heading>
  ) : null;
};

HeadingComplete.propTypes = {
  children: PropTypes.node.isRequired,
  headingLevel: optionalNumberBetween(1, 6),
};

const HeadingIncomplete = ({ children, headingLevel = 3 }) => {
  const complete = useContext(CompleteContext);
  const Heading = `h${headingLevel}`;
  return !complete ? (
    <Heading className={headingClasses}>{children}</Heading>
  ) : null;
};

HeadingIncomplete.propTypes = {
  children: PropTypes.node.isRequired,
  headingLevel: optionalNumberBetween(1, 6),
};

const ContentComplete = ({ children }) => {
  const complete = useContext(CompleteContext);
  return complete ? (
    <div className="vads-u-margin-y--0 vads-u-padding-top--1">{children}</div>
  ) : null;
};

ContentComplete.propTypes = { children: PropTypes.node.isRequired };

const ContentIncomplete = ({ children }) => {
  const complete = useContext(CompleteContext);
  return !complete ? (
    <div className="vads-u-margin-y--0 vads-u-padding-top--1">{children}</div>
  ) : null;
};

ContentIncomplete.propTypes = { children: PropTypes.node.isRequired };

ConditionalProcessList.HeadingComplete = HeadingComplete;
ConditionalProcessList.HeadingIncomplete = HeadingIncomplete;
ConditionalProcessList.ContentComplete = ContentComplete;
ConditionalProcessList.ContentIncomplete = ContentIncomplete;
ConditionalProcessList.Item = Item;
