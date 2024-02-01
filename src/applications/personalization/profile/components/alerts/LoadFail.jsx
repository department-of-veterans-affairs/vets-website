import React from 'react';

export const defaultFailureMessage = (
  <span>
    We’re sorry. We can’t access this information right now. Please refresh the
    page or try again.
  </span>
);

// alert with headline and body text that is shown for more 'global' failures
export default function LoadFail() {
  return (
    <va-alert
      status="warning"
      visible
      data-testid="service-is-down-banner"
      uswds
    >
      <h2 slot="headline">This page isn't available right now.</h2>
      <p>
        We’re sorry. Something went wrong on our end. Refresh this page or try
        again later.
      </p>
    </va-alert>
  );
}

// Helper function to determine which message to render
// If no props are passed, return the default failure message
// If children are passed, render those
// If a sectionName is passed, render the default failure message with the sectionName
const renderSingleFieldFailMessage = (sectionName, children) => {
  if (!children && !sectionName) {
    return defaultFailureMessage;
  }

  if (children) {
    return children;
  }

  return (
    <span>
      We’re sorry. Something went wrong on our end and we can’t load your{' '}
      {sectionName}. Please try again later.
    </span>
  );
};

// alert for a single field that is shown when that field fails to load
export const SingleFieldLoadFailAlert = ({ sectionName, children }) => {
  const message = renderSingleFieldFailMessage(sectionName, children);
  return (
    <va-alert status="warning" background-only uswds>
      {message}
    </va-alert>
  );
};

// custom props validation function to ensure that either children or sectionName is passed, but not both
function validateChildrenOrSectionNameProps(props, propName, componentName) {
  if (props?.sectionName && typeof props?.sectionName !== 'string') {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected \`sectionName\` to be of type string, received type of \`${typeof props.sectionName}\`.`,
    );
  }
  if (props.children && props.sectionName) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Either pass \`children\` or \`sectionName\` but not both. To render default failure message, pass neither prop.`,
    );
  }
  return null;
}

SingleFieldLoadFailAlert.propTypes = {
  children: validateChildrenOrSectionNameProps,
  sectionName: validateChildrenOrSectionNameProps,
};
