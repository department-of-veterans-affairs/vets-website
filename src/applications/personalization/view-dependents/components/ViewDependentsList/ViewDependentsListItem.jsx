import React from 'react';

const ViewDependentsListItem = props => (
  <div className="vads-l-col--12 vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
    <div className="vads-l-row">
      <div className="vads-l-col--9">
        <p className="vads-u-font-weight--bold vads-u-margin-top--0p25 vads-u-margin-bottom--0 vads-u-margin-x--0 vads-u-font-size--lg">
          Jesse Cohn
        </p>
      </div>
      {props.spouse ? (
        <div className="vads-l-col--3">
          <p className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-text-align--right vads-u-margin--0">
            Spouse
          </p>
        </div>
      ) : (
        <div className="vads-l-col--3">
          <p className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-text-align--right vads-u-margin--0">
            Child
          </p>
        </div>
      )}
    </div>
    <div className="vads-l-row vads-u-margin-y--0p5">
      <div className="vads-l-col--12 vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        {props.onAward ? (
          <p className="vads-u-margin-right--2 vads-u-margin-top--0">
            <i className="fas fa-medal vads-u-margin-right--0p5" />
            <span className="vads-u-font-weight--bold">On Award</span>{' '}
          </p>
        ) : null}

        {props.social ? (
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            SSN: <strong>{props.social}</strong>
          </p>
        ) : null}

        {props.birthdate ? (
          <p className="vads-u-margin-left--2 vads-u-margin-top--0 vads-u-margin-bottom--0">
            Date of birth: <strong>{props.birthdate}</strong>
          </p>
        ) : null}

        {props.age ? (
          <p className="vads-u-margin-left--2 vads-u-margin-top--0 vads-u-margin-bottom--0">
            Age: <strong>{props.age}</strong>
          </p>
        ) : null}
      </div>
    </div>
    {props.changeStatus ? (
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--12">
          <button href="#" className="usa-button-secondary">
            Change Status
          </button>
        </div>
      </div>
    ) : null}
  </div>
);

export default ViewDependentsListItem;
