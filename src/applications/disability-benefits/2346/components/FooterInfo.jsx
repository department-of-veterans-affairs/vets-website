import React from 'react';

const FooterInfo = () => {
  const sectionClassNames =
    'vads-u-margin-y--2p5 vads-u-display--flex vads-u-flex-direction--column';
  return (
    <section className="need-help-footer row vads-u-padding-x--1p5">
      <h3 className="vads-u-font-size--h5">Need Help?</h3>
      <hr />
      <span>
        For help filling out this form, you can contact your local coordinator,
        or call our main VA information line at :{' '}
      </span>

      <section className={sectionClassNames}>
        <a href="tel:18008271000">1-800-827-1000</a>
      </section>

      <section className={sectionClassNames}>
        <span>
          To report a problem with this form, please call the Technical Help
          Help Desk:
        </span>
        <a href="tel:18555747286">1-855-574-7286</a>
        <a href="tel:18008778339">TTY: 1-800-877-8339</a>
        <span>Monday through Friday, 8:00a.m. — 7:00p.m. ET.</span>
      </section>
    </section>
  );
};

export default FooterInfo;
