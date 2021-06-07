import React from 'react';
import withFeatureFlip from '../containers/withFeatureFlip.jsx';

const Landing = () => {
  return (
    <div>
      <p>
        This is a place holder page. Most likely will just a page to valid the
        token before redirect and not show the user anything
      </p>
      <p>
        To try to the flow here are use cases and links
        <ol>
          <li>
            <a href="/check-in/some-token/insurance"> Valid Token</a>
          </li>
        </ol>
      </p>
    </div>
  );
};

export default withFeatureFlip(Landing);
