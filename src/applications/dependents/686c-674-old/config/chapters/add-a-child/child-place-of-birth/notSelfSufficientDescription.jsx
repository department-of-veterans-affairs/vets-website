import React from 'react';

export const notSelfSufficientDescription = (
  <div>
    <va-additional-info trigger="What does &quot;unable to support themself&quot; mean?">
      <p className="vads-u-margin-bottom--4">
        We consider a child to be <strong>unable to support themself</strong> if
        both of these are true:
        <ul className="vads-u-margin-bottom--4">
          <li>
            The child has a diagnosed physical or mental disability that makes
            them unable to support themself, <strong>and</strong>
          </li>
          <li>The child is permanently disabled</li>
        </ul>
      </p>
      <p>
        To add this child as a dependent, you’ll need to provide this evidence:
        <ul>
          <li className="vads-u-margin-bottom--2">
            Medical evidence that shows a permanent physical or mental
            disability, <strong>and</strong>
          </li>
          <li>
            A statement from your child’s doctor that shows the type{' '}
            <strong>and</strong> severity of the child’s physical or mental
            condition
          </li>
        </ul>
      </p>
    </va-additional-info>
  </div>
);
