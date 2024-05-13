import React from 'react';

const LatestAnnouncementFromVA = () => {
  return (
    <div data-widget-type="sco-announcements">
      <div className="field_related_links vads-u-background-color--primary-alt-lightest vads-u-padding--1p5 vads-u-margin-top--6">
        <h3 className="va-nav-linkslist-heading vads-u-padding-top--0">
          Latest announcements from VA
        </h3>
        <ul className="va-nav-linkslist-list">
          <li>
            <p>No new announcements are available at this time.</p>
          </li>
        </ul>
        <p className="vads-u-margin-bottom--0">
          <a
            href="https://www.benefits.va.gov/GIBILL/index.asp#Announcements"
            className="vads-u-text-decoration--none"
          >
            See all announcements...
          </a>
        </p>
      </div>
    </div>
  );
};

export default LatestAnnouncementFromVA;
