import React from 'react';

const ChildrenDetails = ({ children }) =>
  React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // Logging component name
      const componentOrElementName = child.type.name || child.type;

      return (
        <pre>
          {JSON.stringify(
            { componentOrElementName, props: child?.props },
            null,
            2,
          )}
        </pre>
      );
    }
    return null;
  });

export default ChildrenDetails;
