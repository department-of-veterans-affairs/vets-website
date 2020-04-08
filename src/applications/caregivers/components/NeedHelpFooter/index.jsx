import React from 'react';

const NeedHelpFooter = () => {
  const sectionClassNames =
    'vads-u-margin-y--2p5 vads-u-display--flex vads-u-flex-direction--column';
  return (
    <footer className="need-help-footer row vads-u-padding-x--1p5">
      <h5>Need Help?</h5>
      <hr />
      <span>Need help filling out this form? Call our toll-free number: </span>

      <section className={sectionClassNames}>
        <a href="tel:18772228387">1-877-222-8387</a>
        <span>
          TTY: <a href="tel:18008778339">1-800-877-8339</a>
        </span>
        <span>Monday through Friday, 8:00a.m. — 8:00p.m. ET.</span>
      </section>

      <section className={sectionClassNames}>
        <span>A Caregiver Support Coordinator locator is available at: </span>
        <a href="https://www.caregiver.va.gov/" rel="noopener noreferrer">
          http://www.caregiver.va.gov/
        </a>
      </section>

      <section className={sectionClassNames}>
        <span>
          You can contact the National Caregiver Support Line by calling:
        </span>
        <a href="tel:18552603274">1-855-260-3274</a>
      </section>

      <section className={sectionClassNames}>
        <span>
          To report a problem with this form, please call the Vets.gov Technical
          Help Desk:
        </span>
        <a href="tel:18555747286">1-855-574-7286</a>
        <a href="tel:18008778339">TTY: 1-800-877-8339</a>
        <span>Monday through Friday, 8:00a.m. — 7:00p.m. ET.</span>
      </section>
    </footer>
  );
};

export default NeedHelpFooter;
