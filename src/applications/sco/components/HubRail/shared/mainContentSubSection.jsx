import React from 'react';
import PropTypes from 'prop-types';

const MainContentSubSection = ({ id, header, children }) => {
  return (
    <section className="merger-majorlinks va-nav-linkslist va-nav-linkslist--related">
      <section className="field_related_links">
        <h2 className="va-nav-linkslist-heading" id={id}>
          {header}
        </h2>
        <ul className="va-nav-linkslist-list">{children}</ul>
      </section>
    </section>
  );
};

MainContentSubSection.propTypes = {
  id: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default MainContentSubSection;
