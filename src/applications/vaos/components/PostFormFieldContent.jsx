import React from 'react';

/*
 * The purpose of this component is to provide a tab stop for content that exists after or in between
 * form fields that we don't want a screen reader user to miss if they're tabbing through a form
 */
export default function PostFormFieldContent({ children }) {
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  return <div tabIndex="0">{children}</div>;
}
