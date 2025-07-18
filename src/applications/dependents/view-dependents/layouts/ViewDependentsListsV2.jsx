import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import ViewDependentsList from '../components/ViewDependentsList/ViewDependentsListV2';

function ViewDependentsLists(props) {
  const onAwardSubhead = (
    <>
      These dependents are on your VA benefits. If you’ve recently made changes,
      they might not be reflected here yet.
    </>
  );

  const notOnAwardSubhead = (
    <>
      These dependents may not be eligible to be on your VA benefits. If you’ve
      recently made changes, they might not be reflected here yet.
    </>
  );

  return (
    <div>
      <ViewDependentsList
        loading={props.loading}
        header="Dependents on your VA benefits"
        subHeader={onAwardSubhead}
        dependents={props.onAwardDependents}
        isAward
        manageDependentsToggle={props.manageDependentsToggle}
      />
      <div className="vads-u-margin-bottom--4" data-testid="default-note">
        <p>
          <strong>Note:</strong> To protect your personal information, we don’t
          allow online changes to your dependents’ names, dates of birth, or
          Social Security numbers. If you need to change this information, call
          us at <va-telephone contact={CONTACTS.VA_BENEFITS} />(
          <va-telephone contact="711" tty />
          ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m.
          ET.
        </p>
        <va-link
          external
          href="/resources/how-to-change-your-legal-name-on-file-with-va/"
          text="Find more detailed instructions for how to change your dependents’ names"
        />
      </div>
      <ViewDependentsList
        loading={props.loading}
        header="Dependents not on your VA benefits"
        subHeader={notOnAwardSubhead}
        dependents={props.notOnAwardDependents}
      />
      <h2>Managing your dependents</h2>

      <p>
        It’s important to make sure your dependents are up to date for these
        reasons:
      </p>

      <ul>
        <li>
          <strong>receive the full amount</strong> you’re eligible for,{' '}
          <strong>and</strong>
        </li>
        <li>
          <strong>avoid overpayments</strong>, which you’d{' '}
          <strong>have to repay</strong>
        </li>
      </ul>

      <va-additional-info trigger="When to update your dependents on your VA benefits">
        <div>
          <p>Update your dependents if any of these are true for you:</p>
          <ul>
            <li>
              You got married, divorced, or became widowed,
              <strong> or</strong>
            </li>
            <li>
              You gave birth or adopted a child,
              <strong> or</strong>
            </li>
            <li>
              Your child passed away,
              <strong> or</strong>
            </li>
            <li>
              Your child under age 18 became seriously disabled,
              <strong> or</strong>
            </li>
            <li>
              Your child over age 18 enrolled in or left full-time school,
              <strong> or</strong>
            </li>
            <li>
              Your child (either minor or a student) got married,
              <strong> or</strong>
            </li>
            <li>You became the caregiver for a parent</li>
          </ul>

          <p>
            <va-link-action
              href={getAppUrl('686C-674-v2')}
              text="Add or remove dependents on VA benefits"
              type="secondary"
            />
          </p>

          <div>
            Prefer paper form to add or remove a dependent?{' '}
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-686c/"
              text="Download VA Form 21-686c (PDF)"
            />
          </div>

          <div>
            Prefer paper form to add a student?{' '}
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-674/"
              text="Download VA Form 21-674 (PDF)"
            />
          </div>
        </div>
      </va-additional-info>

      <p>
        <va-link-action
          href={getAppUrl('0538-dependents-verification')}
          text="Start your disability benefits dependents verification"
          type="primary"
        />
      </p>

      <p>
        Prefer paper?{' '}
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-0538/"
          text="Download VA Form 21-0538 (PDF)"
        />
      </p>
    </div>
  );
}

export default ViewDependentsLists;
