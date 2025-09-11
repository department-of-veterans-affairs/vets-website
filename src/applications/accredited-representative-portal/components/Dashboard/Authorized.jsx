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
            <div>
              <va-link
                class="dashboard__card-link vads-u-font-family--serif"
                href="/representative/claimant-search"
                text="Find claimants you represent"
              />
            </div>
          </va-card>
        </li>
        <li>
          <va-card icon-name="how_to_reg">
            <div>
              <va-link
                class="dashboard__card-link vads-u-font-family--serif"
                href="/representative/poa-requests"
                text="Review representation requests"
              />
            </div>
          </va-card>
        </li>
        <li>
          <va-card icon-name="assignment_turned_in">
            <div>
              <va-link
                class="dashboard__card-link vads-u-font-family--serif"
                href="/representative/submissions"
                text="Submit forms"
              />
            </div>
          </va-card>
        </li>
      </ul>

      <h2 className="dashboard__header">Are you new to the portal?</h2>
      <p>
        Visit our help resources to learn more about the portal and contact us
        with questions.
      </p>
      <va-link
        href="/representative/get-help"
        text="Review our help resources"
      />
    </>
  );
};

export default Authorized;
