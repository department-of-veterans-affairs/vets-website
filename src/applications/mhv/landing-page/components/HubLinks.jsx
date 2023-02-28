import React from 'react';
import PropTypes from 'prop-types';

const HubSection = ({ title, links }) => {
  const listItems = links.map((l, index) => (
    <li key={`${l.href}--${index}`}>
      <a className="mhv-c-link" href={l.href}>
        {l.text}
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
  const hubLayout = hubs.map(h => (
    <div
      key={h.title}
      className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap"
    >
      <HubSection title={h.title} links={h.links} />
    </div>
  ));
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-bottom--3">{hubLayout}</div>
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
