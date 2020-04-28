import React from 'react';
import { links } from 'applications/caregivers/definitions/content';

const NeedHelpFooter = () => (
  <footer className="need-help-footer row vads-u-padding-x--1p5">
    <div style={{ maxWidth: '600px' }}>
      <h5>Need Help?</h5>
      <hr />
      <p>
        You can call the VA Caregiver Support Line at{' '}
        <a href={links.caregiverHelp.phoneLink}>
          {links.caregiverHelp.phoneLabel}
        </a>
        . We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>

      <p>
        You can also call our main VA information line at{' '}
        <a href={links.VAHelpLine.label}>{links.VAHelpLine.link}</a>, or contact
        your local Caregiver Support Coordinator.
      </p>

      <span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={links.caregiverSupportCoordinators.link}
        >
          Use our online Caregiver Support Coordinator search tool
        </a>
      </span>

      <p>
        If this form isn't working right for you, please call us at at{' '}
        <a href={links.reportLine.link}>{links.reportLine.label}</a>{' '}
        <span>If you have hearing loss, call TTY: 711</span>
      </p>
    </div>
  </footer>
);

export default NeedHelpFooter;
