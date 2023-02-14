import React from 'react';
import PropTypes from 'prop-types';

const fakeLinks = [
  { href: '#link01', text: 'Link One' },
  { href: '#link02', text: 'Link Two' },
  { href: '#link03', text: 'Link Three' },
  { href: '#link04', text: 'Link Four' },
];

const HubSection = ({ title, links }) => {
  const listItems = links.map((l, index) => (
    <li key={`${l.href}--${index}`}>
      <a href={l.href}>{l.text}</a>
    </li>
  ));
  return (
    <>
      <h2>{title}</h2>
      <ul className="hub-page-link-list">{listItems}</ul>
    </>
  );
};

const HubLinks = () => {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-bottom--3">
        <div className="vads-l-col--12 medium-screen:vads-l-col">
          <HubSection title="Heading 01" links={fakeLinks} />
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col">
          <HubSection title="Heading 02" links={fakeLinks} />
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col">
          <HubSection title="Heading 03" links={fakeLinks} />
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
