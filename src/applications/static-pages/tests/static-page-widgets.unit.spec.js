import { expect } from 'chai';

import mountWidgets from 'site/assets/js/static-page-widgets';

const widgetContent = `
<div id="testRoot" data-widget-type="pension-app-status" data-widget-timeout="1">
  <div class="loading-indicator-container">
    <div class="loading-indicator" role="progressbar" aria-valuetext="Checking your application status."></div>
      <span class="loading-indicator-message loading-indicator-message--normal">
        Checking your application status.
      </span>
      <span class="loading-indicator-message loading-indicator-message--slow vads-u-display--none" aria-hidden="true">
        Sorry, this is taking longer than expected.
      </span>
    </div>
    <span class="static-widget-content vads-u-display--none" aria-hidden="true">
     <a class="usa-button-primary va-button-primary" href="/pension/application/527EZ">Apply for Veterans Pension Benefits</a>
    </span>
    <div class="usa-alert usa-alert-error sip-application-error vads-u-display--none" aria-hidden="true">
     <div class="usa-alert-body">
     <strong>We’re sorry. Something went wrong when we tried to load your saved application.</strong><br>Please try refreshing your browser in a few minutes.
   </div>
  </div>
</div>
`;

describe('static page widget', () => {
  it('should replace loading message with slow loading message', done => {
    document.body.insertAdjacentHTML('beforeend', widgetContent);
    mountWidgets(document.querySelectorAll('[data-widget-type]'), 600);

    setTimeout(() => {
      expect(
        document
          .querySelector('#testRoot .loading-indicator-message--normal')
          .classList.contains('vads-u-display--none'),
      ).to.be.true;
      expect(
        document
          .querySelector('#testRoot .loading-indicator-message--slow')
          .classList.contains('vads-u-display--none'),
      ).to.be.false;
      done();
    }, 700);
  });

  it('should show error message after timing out', done => {
    document.body.insertAdjacentHTML('beforeend', widgetContent);
    mountWidgets(document.querySelectorAll('[data-widget-type]'), 600);

    setTimeout(() => {
      expect(
        document
          .querySelector('#testRoot .usa-alert-error')
          .classList.contains('vads-u-display--none'),
      ).to.be.false;
      done();
    }, 1100);
  });

  it('should not show error message if content replaced by React', done => {
    document.body.insertAdjacentHTML('beforeend', widgetContent);
    mountWidgets(document.querySelectorAll('[data-widget-type]'), 600);
    document.querySelector('#testRoot').innerHTML = '';

    setTimeout(() => {
      expect(document.querySelector('#testRoot .usa-alert-error')).to.be.null;
      done();
    }, 700);
  });
});
