import React from 'react';

const RatedDisabilitiesSidebar = () => (
  <div className="medium-screen:vads-u-padding-left--4 medium-screen:vads-u-padding-top--2">
    <div>
      <p className="vads-u-display--inline-block vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg vads-u-border-bottom--3px vads-u-border-color--primary">
        How did I get this rating?
      </p>
      <p className="vads-u-margin-top--0">
        Your total disability rating is based on evidence you provide, the
        results results results of your VA claim, and information from other
        sources.
      </p>
      <a href="#">Compensation 101: How did I get this rating (Youtube)</a>
    </div>

    <div className="vads-u-margin-top--2p5">
      <p className="vads-u-display--inline-block vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg vads-u-border-bottom--3px vads-u-border-color--primary">
        What if I have questions?
      </p>
      <p className="vads-u-margin-top--0">
        You can call us at <a href="tel:800-827-1000">800-827-1000</a>. We're
        here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </div>

    <div className="vads-u-margin-top--2p5">
      <p className="vads-u-display--inline-block vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--lg vads-u-border-bottom--3px vads-u-border-color--primary">
        Don't see the disability rating you expect?
      </p>
      <p className="vads-u-margin-top--0">
        If you filed a new disability claim to add a condition, or if you
        appealed a disability decision in the past 3 months, we might still be
        processing your request.
      </p>
    </div>
  </div>
);

export default RatedDisabilitiesSidebar;
