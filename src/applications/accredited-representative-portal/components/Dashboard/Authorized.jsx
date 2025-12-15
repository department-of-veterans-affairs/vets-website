import React from 'react';

const Authorized = () => {
  return (
    <>
      <h1 className="dashboard__header">Dashboard</h1>
      <p className="dashboard__intro va-introtext">
        Welcome to the Accredited Representative Portal! Explore our current
        features to find claimants, establish representation and submit forms.{' '}
      </p>

      <ul className="dashboard__list">
        <li>
          <va-card icon-name="search">
            <h2>
              <va-link
                class="dashboard__card-link vads-u-font-family--serif"
                href="/representative/find-claimant"
                text="Find claimants you represent"
              />
            </h2>
          </va-card>
        </li>
        <li>
          <va-card icon-name="how_to_reg">
            <h2>
              <va-link
                class="dashboard__card-link vads-u-font-family--serif"
                href="/representative/representation-requests"
                text="Review representation requests"
              />
            </h2>
          </va-card>
        </li>
        <li>
          <va-card icon-name="assignment_turned_in">
            <h2>
              <va-link
                class="dashboard__card-link vads-u-font-family--serif"
                href="/representative/submissions"
                text="Submit forms"
              />
            </h2>
          </va-card>
        </li>
      </ul>

      <h2 className="dashboard__header">Are you new to the portal?</h2>
      <p>
        Learn more about using the portal features, resolving common issues, and
        contacting us if you need additional support.
      </p>
      <va-link href="/representative/help" text="Learn more about the portal" />
    </>
  );
};

export default Authorized;
