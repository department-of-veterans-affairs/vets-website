import React from 'react';
import PropTypes from 'prop-types';

export default function App({ children }) {
  return (
    <div className="vads-l-grid-container desktop:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <article className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
          {children}
        </article>
      </div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
};
