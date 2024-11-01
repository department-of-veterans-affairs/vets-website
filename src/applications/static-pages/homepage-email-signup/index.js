import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import EmailSignup from './EmailSignup';
import './email-signup.scss';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  ReactDOM.render(
    <Provider store={store}>
      <EmailSignup />
    </Provider>,
    root,
  );
};

{/* <div class="homepage-email-update-wrapper vads-u-background-color--primary-alt-lightest vads-u-padding-x--2p5 vads-u-padding-top--2p5">
  <div class="vads-u-display--flex vads-u-justify-content--center">
  <form accept-charset="UTF-8" action="https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify" id="email-signup-form" method="POST">
  <input type="hidden" name="utf8" value="✓">
  <input type="hidden" name="category_id" id="category_id_top" value="USVACHOOSE_C1">
  <input type="hidden" name="email" id="homepage-hidden-email" value="">
  <va-text-input autocomplete="email" charcount="true" class="vads-u-width--full medium-screen:vads-u-width-auto homepage-email-input" form-heading="Sign up to get the latest VA updates" form-heading-level="2" inputmode="email" label="Email address" maxlength="130" required="true" type="email" use-forms-pattern="single">
  </va-text-input>
<va-button class="vads-u-width--auto vads-u-margin-bottom--2 vads-u-margin-top--1p5" text="Sign up">
  </va-button>
</form>
</div>
<div class="vads-u-display--none medium-screen:vads-u-display--block">
  <div class="veteran-banner-container vads-u-margin-y--0 vads-u-margin-x--auto">
  <picture>
  <source srcset="/img/homepage/veterans-banner-mobile-1.png 640w, /img/homepage/veterans-banner-mobile-2.png 920w, /img/homepage/veterans-banner-mobile-3.png 1316w" media="(max-width: 767px)">
  <source srcset="/img/homepage/veterans-banner-tablet-1.png 1008w, /img/homepage/veterans-banner-tablet-2.png 1887w" media="(max-width: 1008px)">
  <img class="vads-u-width--full" src="/img/homepage/veterans-banner-desktop-1.png" srcset="/img/homepage/veterans-banner-desktop-1.png 1280w, /img/homepage/veterans-banner-desktop-2.png 2494w" loading="lazy" alt="Veteran portraits">
  </picture>
</div>
</div>
</div> */}
