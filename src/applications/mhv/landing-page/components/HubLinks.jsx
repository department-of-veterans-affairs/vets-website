import React from 'react';
import PropTypes from 'prop-types';
import data from '../utilities/data';

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

const HubLinks = () => {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-bottom--3">
        <div className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap">
          <HubSection title={data.hub[0].title} links={data.hub[0].links} />
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap">
          <HubSection title={data.hub[1].title} links={data.hub[1].links} />
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col mhv-u-grid-gap">
          <HubSection title={data.hub[2].title} links={data.hub[2].links} />
        </div>
      </div>
    </div>
  );
};

HubSection.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string, href: PropTypes.string }),
  ),
  title: PropTypes.string,
};

export default HubLinks;
