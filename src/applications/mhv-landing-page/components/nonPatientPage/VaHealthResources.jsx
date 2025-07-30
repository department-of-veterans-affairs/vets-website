import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

const VaHealthResources = ({ healthResourcesLinks }) => {
  const title = 'VA health resources';
  const listItems = healthResourcesLinks.map(({ href, text }, index) => (
    <li key={`${href}--${index}`}>
      <a
        href={href}
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': text,
            'links-list-section-header': title,
          });
        }}
      >
        {text}
      </a>
    </li>
  ));
  return (
    <div className="vads-l-col--12 medium-screen:vads-l-col--5">
      <h3 className="vads-u-border-bottom--3px vads-u-border-color--primary vads-u-margin-top--2">
        {title}
      </h3>
      <nav>
        <ul className="mhv-c-link-list">{listItems}</ul>
      </nav>
    </div>
  );
};

VaHealthResources.propTypes = {
  healthResourcesLinks: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string, href: PropTypes.string }),
  ),
};

export default VaHealthResources;
