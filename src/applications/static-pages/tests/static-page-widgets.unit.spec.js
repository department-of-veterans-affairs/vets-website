import { expect } from 'chai';

import mountWidgets from '../../../site/assets/js/static-page-widgets';

const widgetContent = `
<div data-widget-type="pension-app-status" data-widget-timeout="20">
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

describe.only('static page widget', () => {
  it('should display a spinner', () => {
    const widget = {
      root: 'testRoot',
      spinner: true,
      loadingMessage: 'Loading',
      timeout: 0,
    };

    document.body.insertAdjacentHTML('beforeend', '<div id="testRoot"></div>');
    mountWidgets([widget], false);

    expect(document.querySelector('#testRoot .loading-indicator')).to.not.be
      .null;
    expect(
      document.querySelector('#testRoot .loading-indicator-message')
        .textContent,
    ).to.equal(widget.loadingMessage);
  });

  it('should replace loading message with slow loading message', done => {
    const widget = {
      root: 'testRoot',
      spinner: true,
      loadingMessage: 'Loading',
      slowMessage: 'Slowly loading',
      slowLoadingThreshold: 0.5,
      timeout: 4,
    };

    document.body.insertAdjacentHTML('beforeend', '<div id="testRoot"></div>');
    mountWidgets([widget], false);

    setTimeout(() => {
      expect(
        document.querySelector('#testRoot .loading-indicator-message')
          .textContent,
      ).to.equal(widget.slowMessage);
      done();
    }, 600);
  });

  it('should show error message after timing out', done => {
    const widget = {
      root: 'testRoot',
      spinner: true,
      loadingMessage: 'Loading',
      errorMessage: 'Error',
      timeout: 0.5,
    };

    document.body.insertAdjacentHTML('beforeend', '<div id="testRoot"></div>');
    mountWidgets([widget], false);

    setTimeout(() => {
      expect(
        document.querySelector('#testRoot .usa-alert-error').textContent,
      ).to.equal(widget.errorMessage);
      done();
    }, 600);
  });

  it('should not show error message if content replaced by React', done => {
    const widget = {
      root: 'testRoot',
      spinner: true,
      loadingMessage: 'Loading',
      errorMessage: 'Error',
      timeout: 0.5,
    };

    document.body.insertAdjacentHTML('beforeend', '<div id="testRoot"></div>');
    mountWidgets([widget], false);

    document.querySelector('#testRoot').innerHTML = '';

    setTimeout(() => {
      expect(document.querySelector('#testRoot .usa-alert-error')).to.be.null;
      done();
    }, 600);
  });

  it('should skip mounting if hidden in prod', () => {
    const widget = {
      root: 'testRoot',
      spinner: true,
      production: false,
      loadingMessage: 'Loading',
      timeout: 0,
    };

    document.body.insertAdjacentHTML('beforeend', '<div id="testRoot"></div>');
    mountWidgets([widget], true);

    expect(document.querySelector('#testRoot .loading-indicator')).to.be.null;
    expect(document.querySelector('#testRoot .loading-indicator-message')).to.be
      .null;
  });
});
