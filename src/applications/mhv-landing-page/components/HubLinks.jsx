import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

const HubSection = ({ title, links }) => {
  const listItems = links.map(({ href, text }, index) => (
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
    <>
      <h2>{title}</h2>
      <nav>
        <ul className="mhv-c-link-list">{listItems}</ul>
      </nav>
    </>
  );
};

const HubLinks = ({ hubs }) => {
  const hubLayout = hubs.map((h, index) => (
    <div
      key={h.title}
      className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap"
      data-testid={`mhv-link-group-hub-${index}`}
    >
      <HubSection title={h.title} links={h.links} />
    </div>
  ));
  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <div className="vads-l-row">{hubLayout}</div>
    </div>
  );
};

HubSection.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string, href: PropTypes.string }),
  ),
  title: PropTypes.string,
};

HubLinks.propTypes = {
  hubs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      links: PropTypes.arrayOf(
        PropTypes.shape({ text: PropTypes.string, href: PropTypes.string }),
      ),
    }),
  ),
};
export default HubLinks;
