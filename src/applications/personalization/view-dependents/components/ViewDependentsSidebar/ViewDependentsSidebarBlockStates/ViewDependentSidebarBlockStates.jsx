import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const firstSidebarBlock = {
  heading: 'When should I notify VA about dependents on my benefits?',
  content: (
    <>
      <p>
        You need to let VA know when there is a{' '}
        <strong>change in a dependent’s status.</strong> Changes in status could
        include:
      </p>
      <ul>
        <li>The birth or adoption of a child</li>
        <li>If you get married or divorced</li>
        <li>If a child becomes seriously disabled</li>
        <li>If your child is over 18 and is not attending school</li>
      </ul>
      <a href="/disability/add-remove-dependent/">
        Find out more about dependents and your benefits
      </a>
    </>
  ),
};

export const secondSidebarBlock = {
  heading: 'What if I need help with my claim?',
  content: (
    <>
      <p>
        You can work with an accredited Veterans Service Officer (VSO). We trust
        these professionals because they are trained and certified in the VA
        claims and appeals process. A VSO can answer your questions or even file
        a claim for you.
      </p>
      <a href="/disability/get-help-filing-claim/">
        Get help filing your claim or appeal
      </a>
    </>
  ),
};

export const thirdSidebarBlock = {
  heading: 'What if I have questions?',
  content: (
    <>
      <p>
        You can call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />.
        We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. E.T.
      </p>
    </>
  ),
};
