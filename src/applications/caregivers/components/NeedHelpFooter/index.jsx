import React from 'react';
import { links } from 'applications/caregivers/definitions/content';

const NeedHelpFooter = () => {
  const sectionClassNames =
    'vads-u-margin-y--2p5 vads-u-display--flex vads-u-flex-direction--column';
  return (
    <footer className="need-help-footer row vads-u-padding-x--1p5">
      <h5>Need Help?</h5>
      <hr />
      <span>Need help filling out this form? Call our toll-free number: </span>

      <section className={sectionClassNames}>
        <a href={links.VAHelpLine.label}>{links.VAHelpLine.link}</a>
        <span>
          TTY:{' '}
          <a href={links.VAHelpLine.linkTTL}>{links.VAHelpLine.labelTTL}</a>
        </span>
        <span>Monday through Friday, 8:00a.m. — 8:00p.m. ET.</span>
      </section>

      <section className={sectionClassNames}>
        <span>A Caregiver Support Coordinator locator is available at: </span>
        <a
          href={links.caregiverHelpPage.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {links.caregiverHelpPage.link}
        </a>
      </section>

      <section className={sectionClassNames}>
        <span>
          You can contact the National Caregiver Support Line by calling:
        </span>
        <a href={links.caregiverHelp.phoneLink}>
          {links.caregiverHelp.phoneLabel}
        </a>
      </section>

      <section className={sectionClassNames}>
        <span>
          To report a problem with this form, please call the Vets.gov Technical
          Help Desk:
        </span>
        <a href={links.reportLine.link}>{links.reportLine.label}</a>
        <a href={links.VAHelpLine.linkTTL}>TTY: {links.VAHelpLine.labelTTL}</a>
        <span>Monday through Friday, 8:00a.m. — 7:00p.m. ET.</span>
      </section>
    </footer>
  );
};

export default NeedHelpFooter;
