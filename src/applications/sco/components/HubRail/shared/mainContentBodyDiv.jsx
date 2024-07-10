import React from 'react';
import PropTypes from 'prop-types';

const MainContentBodyDiv = ({ id, header, children }) => {
  return (
    <div>
      <section>
        <div className="va-h-ruled--stars" />
      </section>
      <h2 id={id} tabIndex="-1">
        {header}
      </h2>
      {children}
    </div>
  );
};

MainContentBodyDiv.propTypes = {
  id: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default MainContentBodyDiv;
