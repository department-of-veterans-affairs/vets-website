import React from 'react';

const ViewDependentsListItem = () => (
  <div className="vads-l-col--12 vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
    <div className="vads-l-row">
      <div className="vads-l-col--9">
        <p className="vads-u-font-weight--bold vads-u-margin-top--0p25 vads-u-margin-bottom--0 vads-u-margin-x--0 vads-u-font-size--lg">
          Jesse Cohn
        </p>
      </div>
      {true
        ? <div className="vads-l-col--3">
            <p className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-text-align--right vads-u-margin--0">
              Spouse
            </p>
          </div>
        : null}
    </div>
    <div className="vads-l-row vads-u-margin-y--0p5">
      <div className="vads-l-col--12 vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <p className="vads-u-margin--0">
          {true
            ? <i className="fas fa-medal vads-u-margin-right--0p5" />
            : null}
          <span className="vads-u-font-weight--bold">On Award</span>{' '}
        </p>

        <p className="vads-u-margin-left--2 vads-u-margin-top--0 vads-u-margin-bottom--0">
          SSN: <strong>123-456-7890</strong>
        </p>

        <p className="vads-u-margin-left--2 vads-u-margin-top--0 vads-u-margin-bottom--0">
          Date of birth: <strong>0/0/1900</strong>
        </p>

        <p className="vads-u-margin-left--2 vads-u-margin-top--0 vads-u-margin-bottom--0">
          Age: <strong>32</strong>
        </p>
      </div>
    </div>
    {true
      ? <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--12">
            <button href="#" className="usa-button-secondary">
              Change Status
            </button>
          </div>
        </div>
      : null}
  </div>
);

export default ViewDependentsListItem;
