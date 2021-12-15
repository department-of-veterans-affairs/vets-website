import React from 'react';

export const notSelfSufficientDescription = (
  <div>
    <va-additional-info trigger="What does VA mean by &quot;not capable of self-support?&quot;">
      <p className="vads-u-margin-bottom--4">
        To be considered a <strong>child not capable of self-support,</strong>{' '}
        the child must be:
      </p>
      <ul className="vads-u-margin-bottom--4">
        <li>
          Diagnosed with a mental/physical disability that leaves them
          permanently unable to support themselves
        </li>
        <li>Currently permanently disabled</li>
      </ul>
      <p>To add a child not capable of self-support, you’ll need to provide:</p>
      <ul>
        <li className="vads-u-margin-bottom--2">
          Medical evidence showing a permanent mental or physical disability,{' '}
          <strong>and</strong>
        </li>
        <li>
          A statement from an attending physician showing the nature{' '}
          <strong>and</strong> extent of the child’s physical or mental
          impairment
        </li>
      </ul>
    </va-additional-info>
  </div>
);
