import React from 'react';

// title/description for inline fieldsets
export const inlineTitleUI = (title, description) => {
  return {
    'ui:title': (
      <>
        <span className="vads-u-color--gray-dark vads-u-display--block vads-u-margin-bottom--2">
          {title}
        </span>
        {description && (
          <span className="vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4 vads-u-display--block">
            {description}
          </span>
        )}
      </>
    ),
  };
};
