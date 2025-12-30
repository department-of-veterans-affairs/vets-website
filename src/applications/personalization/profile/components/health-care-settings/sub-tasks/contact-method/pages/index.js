import React from 'react';
import Start, { validate } from './start';

const End = () => (
  <>
    <h1 className="vads-u-margin-bottom--0">End Page</h1>
    <div className="schemaform-subtitle vads-u-font-size--lg">
      VA Form XX-1234
    </div>
    <div id="done">Done</div>
  </>
);

export default [
  {
    name: 'contact-method',
    component: Start,
    validate,
    back: null,
    next: 'contact-method-confirm',
  },
  {
    name: 'contact-method-confirm',
    component: End,
    next: null,
    back: 'contact-method',
  },
];
