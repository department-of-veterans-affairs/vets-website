import React from 'react';

export const WIP = ({ content }) => {
  const { description, redirectLink, redirectText } = content;

  return (
    <div className="row vads-u-margin-bottom--5">
      <div className="usa-width-two-thirds medium-8 columns">
        <va-alert status="warning">
          <h1 slot="headline" className="vads-u-font-size--h3">
            We’re still working on this feature
          </h1>
          <p>{description}</p>
          <p>
            <a href={redirectLink}>{redirectText}</a>
          </p>
        </va-alert>
      </div>
    </div>
  );
};
