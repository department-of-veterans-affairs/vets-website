import React from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import ViewDependentsList from '../components/ViewDependentsList/ViewDependentsListV2';

/**
 * @typedef ViewDependentsListsProps
 * @property {Boolean} loading loading state
 * @property {Boolean} manageDependentsToggle feature toggle
 * @property {Array} notOnAwardDependents list of inactive dependents
 * @property {Array} onAwardDependents list of active dependents
 */
/**
 * Renders view dependents list components
 * List of view dependent lists
 * @param {ViewDependentsListsProps} props - Component props
 * @returns {JSX.Element} Dependents lists
 */
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
        showPersonalInformationNote
      />
      <ViewDependentsList
        loading={props.loading}
        header="Dependents not on your VA benefits"
        subHeader={notOnAwardSubhead}
        dependents={props.notOnAwardDependents}
        showPersonalInformationNote={false}
      />
      <h2>Managing your dependents</h2>

      <p>
        It’s important to make sure your dependents are up to date for these
        reasons:
      </p>

      <ul>
        <li>
          <strong>You receive the full amount</strong> you’re eligible for,{' '}
          <strong>and</strong>
        </li>
        <li>
          <strong>You avoid overpayments</strong>, which you’d{' '}
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

      {props.hasDependents && (
        <>
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
        </>
      )}
    </div>
  );
}

ViewDependentsLists.propTypes = {
  loading: PropTypes.bool,
  manageDependentsToggle: PropTypes.bool,
  notOnAwardDependents: PropTypes.array,
  onAwardDependents: PropTypes.array,
};

export default ViewDependentsLists;
