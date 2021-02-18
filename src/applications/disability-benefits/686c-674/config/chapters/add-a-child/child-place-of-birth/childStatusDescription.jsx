import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import React from 'react';

export const childStatusDescription = (
  <div>
    <p>
      If you select an option other than{' '}
      <span className="vads-u-color--gray-dark vads-u-font-weight--bold">
        Biological
      </span>{' '}
      or if you don’t live in the U.S. or a territory of the U.S., we require
      additional evidence to establish a dependent.
    </p>
    <AdditionalInfo triggerText="What are some examples of additional evidence?">
      <p>
        To add a stepchild, you’ll need to provide a copy of their birth
        certificate, showing the names of both parents if:
      </p>
      <ul>
        <li>
          Your stepchild is not the biological child of your spouse (adopted,
          for example) or
        </li>
        <li>You don’t live in the U.S. or a territory of the U.S.</li>
      </ul>
      <p>
        A claim for additional benefits for an <strong>adopted child</strong>{' '}
        must include a copy of one of the following:
      </p>
      <ul>
        <li>The final decree of adoption</li>
        <li>The adoptive placement agreement</li>
        <li>The interlocutory decree of adoptions, or</li>
        <li>The revised birth certificate</li>
      </ul>
      <p>
        To claim a <strong>child not capable of self-support</strong>, you’ll
        need to provide:
      </p>
      <ul>
        <li>
          Medical evidence showing a permanent mental or physical disability
          existed before his/her 18th birthday, and
        </li>
        <li>
          A statement from an attending physician showing the{' '}
          <strong>nature and extent</strong> of the child’s physical or mental
          impairment
        </li>
      </ul>
    </AdditionalInfo>
  </div>
);
