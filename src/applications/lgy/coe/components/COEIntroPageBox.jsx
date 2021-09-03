import React from 'react';

const COEIntroPageBox = props => {
  let content;
  if (props.coe) {
    content = (
      <div className="vads-u-padding-bottom--2">
        <h2 className="vads-u-margin-top--1">Review and download your COE</h2>
        <a href="/housing-assistance/home-loans/apply-for-coe-form-26-1880/eligibility">
          Your VA home loan Certificate of Eligibility
        </a>
        <p>
          Follow the steps on this page to reapply for a VA home loan COE if you
          need to:
        </p>
        <ul>
          <li>
            Make changes to your COE (correct an error or update your
            information), or
          </li>
          <li>Apply for a restoration of entitlement</li>
        </ul>
      </div>
    );
  } else {
    content = <></>;
  }
  return <>{content}</>;
};

export default COEIntroPageBox;
