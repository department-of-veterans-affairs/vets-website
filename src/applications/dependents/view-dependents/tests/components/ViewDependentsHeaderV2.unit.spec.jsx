import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ViewDependentsHeaderV2 from '../../components/ViewDependentsHeader/ViewDependentsHeaderV2';
import { PAGE_TITLE } from '../../util';
import {
  VIEW_DEPENDENTS_WARNING_KEY,
  hideDependentsWarning,
} from '../../../shared/utils';

// **************************************************************************
// NOT adding tests for the "updateDiariesStatus" prop because the endpoint
// doesn't exist and the action hasn't been implemented
// **************************************************************************

describe('<ViewDependentsHeader />', () => {
  const renderWithStore = (props = {}, toggle = true) => {
    const store = configureStore([])({
      featureToggles: {
        vaDependentsViewBrowserMonitoringEnabled: toggle,
      },
    });
    return render(
      <Provider store={store}>
        <ViewDependentsHeaderV2 {...props} />
      </Provider>,
    );
  };

  it('Should render', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = { logger: { log: logSpy } };
    const { container } = renderWithStore({
      showAlert: true,
      hasAwardDependents: true,
      hasMinimumRating: true,
    });
    expect($('h1', container).textContent).to.equal(PAGE_TITLE);
    expect($('#update-warning-alert', container)).to.exist;
    expect(
      $(
        'va-link-action[text="Verify your VA disability benefits dependents"]',
        container,
      ),
    ).to.exist;

    expect(logSpy.args[0][0]).to.eq(
      'View dependents 0538 warning alert visible',
    );
    expect(logSpy.args[0][1]).to.deep.equal({ state: 'visible', reason: '' });
  });

  it('Should not render alert when showAlert is false & no dependents', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = { logger: { log: logSpy } };
    const { container } = renderWithStore({
      showAlert: false,
      hasAwardDependents: false,
      hasMinimumRating: true,
    });
    expect($('h1', container).textContent).to.equal(PAGE_TITLE);
    expect($('#update-warning-alert', container)).to.not.exist;
    expect(logSpy.args[0][0]).to.eq(
      'View dependents 0538 warning alert hidden because no active dependents',
    );
    expect(logSpy.args[0][1]).to.deep.equal({
      state: 'hidden because no active dependents',
      reason: 'no active dependents',
    });
  });

  it('Should not render alert when showAlert is false & below minimum rating', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = { logger: { log: logSpy } };
    const { container } = renderWithStore({
      showAlert: false,
      hasAwardDependents: true,
      hasMinimumRating: false,
    });
    expect($('h1', container).textContent).to.equal(PAGE_TITLE);
    expect($('#update-warning-alert', container)).to.not.exist;
    expect(logSpy.args[0][0]).to.eq(
      'View dependents 0538 warning alert hidden because disability rating below 30%',
    );
    expect(logSpy.args[0][1]).to.deep.equal({
      state: 'hidden because disability rating below 30%',
      reason: 'disability rating below 30%',
    });
  });

  it('Should not render alert when localStorage indicates that it is hidden', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = { logger: { log: logSpy } };
    hideDependentsWarning();

    const { container } = renderWithStore({
      showAlert: true,
      hasAwardDependents: true,
      hasMinimumRating: true,
    });
    expect($('h1', container).textContent).to.equal(PAGE_TITLE);
    expect($('#update-warning-alert', container)).to.not.exist;
    expect(logSpy.args[0][0]).to.eq(
      'View dependents 0538 warning alert already hidden',
    );
    expect(logSpy.args[0][1]).to.deep.equal({
      state: 'already hidden',
      reason: 'user previously closed alert',
    });
  });

  it('Should show alert, then close and update localStorage', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = { logger: { log: logSpy } };
    localStorage.removeItem(VIEW_DEPENDENTS_WARNING_KEY);

    const { container } = renderWithStore({
      showAlert: true,
      hasAwardDependents: true,
      hasMinimumRating: true,
    });
    expect($('h1', container).textContent).to.equal(PAGE_TITLE);

    const alert = $('#update-warning-alert', container);
    expect(alert).to.exist;

    alert.__events.closeEvent();
    expect($('#update-warning-alert', container)).to.not.exist;

    expect(logSpy.args[0][0]).to.eq(
      'View dependents 0538 warning alert visible',
    );
    expect(logSpy.args[1][0]).to.eq(
      'View dependents 0538 warning alert hidden by user',
    );
    expect(logSpy.args[1][1]).to.deep.equal({
      state: 'hidden by user',
      reason: 'hidden by user',
    });
  });

  it('should log click on verification link', () => {
    const logSpy = sinon.spy();
    window.DD_LOGS = { logger: { log: logSpy } };
    const { container } = renderWithStore({
      showAlert: true,
      hasAwardDependents: true,
      hasMinimumRating: true,
    });

    const link = $('va-link-action', container);
    expect(link).to.exist;

    link.click();
    expect(logSpy.args[1][0]).to.eq(
      'View dependents 0538 verification link clicked',
    );
  });
});
