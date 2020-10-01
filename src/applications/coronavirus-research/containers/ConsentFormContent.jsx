import React from 'react';

export function ConsentLabel() {
  return <span>I understand the above information and agree to join.</span>;
}
export function ConsentError() {
  return <span>You must accept the consent policy before continuing</span>;
}
export function ConsentNotice() {
  return (
    <span>
      <strong>Your consent to join our volunteer list </strong>
      <p>
        Your safety and privacy are our biggest priorities. We want to make sure
        you understand important information about joining this list. Please
        read below and then check the box to confirm you understand and agree to
        join.
      </p>{' '}
      <ul>
        <li>
          <strong>Age requirement:</strong> You must be at least 18 years old to
          join this list.
        </li>
        <li>
          <strong>Our partners for these studies:</strong> We’re working with
          partners from government, academia, and the health care industry.
        </li>{' '}
        <li>
          <strong>Voluntary participation:</strong> It’s always your choice to
          answer any questions we may ask or to join a study. You can also leave
          a study at any time. Your decision to join or not join a study won’t
          affect your VA health care or any of your VA benefits or services in
          any way.
        </li>{' '}
        <li>
          <strong>Payment:</strong> You won’t receive any payment for joining
          this list. Some studies may offer payment. If we contact you about a
          study, we’ll tell you about any payments at that time.
        </li>{' '}
        <li>
          <strong>Privacy:</strong> We’ll include your information in our secure
          electronic database. We'll only give access to the database to people
          with permission, and we won't share your information with anyone
          outside of VA. But there’s always a small risk that someone who
          shouldn’t have your information could get access to it.
        </li>{' '}
        <li>
          <strong>Your legal rights:</strong> You’ll keep all your legal rights
          if you join this list and if you join a study.
        </li>
      </ul>
    </span>
  );
}
