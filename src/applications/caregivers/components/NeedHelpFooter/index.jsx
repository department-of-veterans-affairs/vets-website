import React from 'react';

import '../../sass/needHelpFooter.scss';

const NeedHelpFooter = () => (
  <footer className="need-help-footer row">
    <h5>Need Help?</h5>
    <hr />
    <span>Need help filling out this form? Call our toll-free number: </span>

    <section>
      <a href="tel:18772228387">1-877-222-8387</a>
      <span>
        TTY: <a href="tel:18008778339">1-800-877-8339</a>
      </span>
      <span>Monday — Friday, 8:00am — 8:00pm (ET)</span>
    </section>

    <section>
      <span>A Caregiver Support Coordinator locator is available at: </span>
      <a href="http://www.caregiver.va.gov/">http://www.caregiver.va.gov/</a>
    </section>

    <section>
      <span>
        You can contact the National Caregiver Support Line by calling:
      </span>
      <a href="tel:18552603274">1-855-260-3274</a>
    </section>

    <section>
      <span>
        To report a problem with this form, please call the Vets.gov Technical
        Help Desk:
      </span>
      <a href="tel:18555747286">1-855-574-7286</a>
      <a href="tel:18008778339">TTY: 1-800-877-8339</a>
      <span>Monday — Friday, 8:00am — 7:00pm (ET)</span>
    </section>
  </footer>
);

export default NeedHelpFooter;
