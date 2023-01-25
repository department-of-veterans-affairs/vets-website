import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';

// A derivative of the va-process-list compnenent, but with a few changes to
// support the Account Security section of the Profile.
// Conditional rendering is used to show different content based on the
// state of the user's account.
// Each list item is a process that a user may need to complete in order to
// access all of the features of VA.gov, and will diplay whether or not the
// process has been completed

const HeadingWrapper = ({ children }) => {
  return (
    <h3 className="vads-u-margin-y--0 vads-u-padding-top--0p5 item-heading">
      {children}
    </h3>
  );
};

HeadingWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

const ContentWrapper = ({ children }) => {
  return <p className="vads-u-margin-y--0">{children}</p>;
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

const CompleteContext = createContext();

// The ListItem component is a wrapper for the list item content, and
// conditionally renders the content based on the `complete` prop

/**
 * A list item with context for whether or not the process has been completed
 *
 * @param {boolean} complete - Whether or not the process has been completed
 * @param {node} children - The content of the list item
 * @return {node} - The list item
 */
const ListItem = ({ complete, children }) => {
  return (
    <li className={`item ${complete && 'item-complete'}`}>
      <CompleteContext.Provider value={complete}>
        {children}
      </CompleteContext.Provider>
    </li>
  );
};

ListItem.propTypes = {
  children: PropTypes.node.isRequired,
  complete: PropTypes.bool.isRequired,
};

// The ListItem.HeadingComplete and ListItem.HeadingIncomplete components
// are wrappers for the heading content, and conditionally render the content
// based on the `complete` prop

const HeadingComplete = ({ children }) => {
  const complete = useContext(CompleteContext);
  return complete ? <HeadingWrapper>{children}</HeadingWrapper> : null;
};

HeadingComplete.propTypes = {
  children: PropTypes.node.isRequired,
};

const HeadingIncomplete = ({ children }) => {
  const complete = useContext(CompleteContext);
  return !complete ? <HeadingWrapper>{children}</HeadingWrapper> : null;
};

HeadingIncomplete.propTypes = {
  children: PropTypes.node.isRequired,
};

// The ListItem.ContentComplete and ListItem.ContentIncomplete components
// are wrappers for the body content, and conditionally render the content
// based on the `complete` prop

const ContentComplete = ({ children }) => {
  const complete = useContext(CompleteContext);
  return complete ? <ContentWrapper>{children}</ContentWrapper> : null;
};

ContentComplete.propTypes = { children: PropTypes.node.isRequired };

const ContentIncomplete = ({ children }) => {
  const complete = useContext(CompleteContext);
  return !complete ? <ContentWrapper>{children}</ContentWrapper> : null;
};

ContentIncomplete.propTypes = { children: PropTypes.node.isRequired };

export const ConditionalProcessList = ({ children }) => {
  return (
    <ol className="va-account-security-process-list vads-u-margin-top--4">
      {children}
    </ol>
  );
};

ConditionalProcessList.propTypes = {
  children: PropTypes.node.isRequired,
};

ConditionalProcessList.HeadingComplete = HeadingComplete;
ConditionalProcessList.HeadingIncomplete = HeadingIncomplete;
ConditionalProcessList.ContentComplete = ContentComplete;
ConditionalProcessList.ContentIncomplete = ContentIncomplete;
ConditionalProcessList.ListItem = ListItem;
