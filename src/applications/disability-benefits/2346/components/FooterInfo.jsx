import React from 'react';

export const FooterInfo = () => {
  const sectionClassNames =
    'vads-u-margin-y--2p5 vads-u-display--flex vads-u-flex-direction--column';
  return (
    <>
      <section className="need-help-footer row vads-u-padding-x--1p5">
        <span>
          For help filling out this form, you can contact your local
          coordinator, or call our main VA information line at{' '}
          <a href="tel:855-260-3274">855-260-3274</a>.
        </span>

        <section className={sectionClassNames}>
          <span>
            To report a problem with this form, please call the Technical Help
            Desk at <a href="tel:855-574-7286">855-574-7286</a>.
          </span>
          <span className="vads-u-margin-top--1p5">
            <a href="tel:800-877-8339">TTY: 800-877-8339</a>
          </span>
          <span className="vads-u-margin-top--1p5">
            Monday — Friday, 8:00am — 7:00pm (ET)
          </span>
        </section>
      </section>
    </>
  );
};
