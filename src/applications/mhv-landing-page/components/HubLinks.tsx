import React from 'react';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

interface HubSectionProps {
  links?: {
    text?: string;
    href?: string;
  }[];
  title?: string;
}

const HubSection = ({
  title,
  links = []
}: HubSectionProps) => {
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

interface HubLinksProps {
  hubs?: {
    title?: string;
    links?: {
      text?: string;
      href?: string;
    }[];
  }[];
}

const HubLinks = ({
  hubs
}: HubLinksProps) => {
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

export default HubLinks;
