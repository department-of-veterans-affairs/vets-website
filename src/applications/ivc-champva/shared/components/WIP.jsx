import React from 'react';
import PropTypes from 'prop-types';

const WIP = ({ content }) => {
  const { description, redirectLink, redirectText, headline } = content;

  return (
    <div className="row vads-u-margin-bottom--5">
      <meta name="robots" content="noindex" />
      <div className="usa-width-two-thirds medium-8 columns">
        <va-alert status="warning">
          <h1 slot="headline" className="vads-u-font-size--h3">
            {headline ?? 'We’re still working on this feature'}
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

WIP.propTypes = {
  content: PropTypes.object,
};

export default WIP;
