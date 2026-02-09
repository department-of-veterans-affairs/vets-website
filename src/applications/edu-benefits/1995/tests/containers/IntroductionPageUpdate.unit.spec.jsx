import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { IntroductionPageUpdate } from 'applications/edu-benefits/1995/containers/IntroductionPageUpdate';

describe('the Edu-Benefit 1995 Introduction Page Update', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should show the subway map if showWizard is set to false', () => {
    const { container } = render(
      <IntroductionPageUpdate showWizard={false} route={{}} />,
    );

    expect(container.querySelector('.subway-map')).to.exist;
    expect(container.textContent).to.include('Change your education benefits');
  });

  it('should show the subway map if showWizard is true', () => {
    const { container } = render(
      <IntroductionPageUpdate showWizard route={{}} />,
    );

    expect(container.querySelector('.subway-map')).to.exist;
    expect(container.textContent).to.include('Change your education benefits');
  });

  it('should return null if showWizard is undefined and not in Rudisill flow', () => {
    const { container } = render(
      <IntroductionPageUpdate showWizard={undefined} route={{}} />,
    );

    expect(container.querySelector('.schemaform-intro')).to.not.exist;
  });

  it('should render when in Rudisill flow with reroute enabled even if showWizard is undefined', () => {
    sessionStorage.setItem('isRudisillFlow', 'true');

    const { container } = render(
      <IntroductionPageUpdate
        showWizard={undefined}
        route={{}}
        rerouteEnabled
      />,
    );

    expect(container.querySelector('.subway-map')).to.exist;
    expect(container.textContent).to.include('Change your education benefits');
  });

  it('should NOT render in Rudisill flow when reroute is disabled (backwards compatibility)', () => {
    sessionStorage.setItem('isRudisillFlow', 'true');

    const { container } = render(
      <IntroductionPageUpdate
        showWizard={undefined}
        route={{}}
        rerouteEnabled={false}
      />,
    );

    // Should return null because reroute is disabled (legacy behavior)
    expect(container.querySelector('.schemaform-intro')).to.not.exist;
  });

  it('should initialize formData with isRudisillFlow when in Rudisill flow', () => {
    sessionStorage.setItem('isRudisillFlow', 'true');
    const setFormDataSpy = sinon.spy();
    const formData = {};

    render(
      <IntroductionPageUpdate
        showWizard={false}
        route={{}}
        formData={formData}
        setFormData={setFormDataSpy}
      />,
    );

    // Should call setFormData to initialize isRudisillFlow flag
    expect(setFormDataSpy.calledOnce).to.be.true;
    expect(setFormDataSpy.firstCall.args[0]).to.deep.equal({
      isRudisillFlow: true,
    });
  });

  it('should not call setFormData if isRudisillFlow already set in formData', () => {
    sessionStorage.setItem('isRudisillFlow', 'true');
    const setFormDataSpy = sinon.spy();
    const formData = { isRudisillFlow: true };

    render(
      <IntroductionPageUpdate
        showWizard={false}
        route={{}}
        formData={formData}
        setFormData={setFormDataSpy}
      />,
    );

    // Should NOT call setFormData because flag is already set
    expect(setFormDataSpy.called).to.be.false;
  });

  it('should not call setFormData when not in Rudisill flow', () => {
    // No sessionStorage flag set
    const setFormDataSpy = sinon.spy();
    const formData = {};

    render(
      <IntroductionPageUpdate
        showWizard={false}
        route={{}}
        formData={formData}
        setFormData={setFormDataSpy}
      />,
    );

    // Should NOT call setFormData because not in Rudisill flow
    expect(setFormDataSpy.called).to.be.false;
  });

  it('should show fallback button when route is missing and reroute is enabled', () => {
    sessionStorage.setItem('isRudisillFlow', 'true');

    const { container } = render(
      <IntroductionPageUpdate
        showWizard={false}
        route={undefined}
        rerouteEnabled
      />,
    );

    // Should show fallback link when route is missing
    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'Start the education application',
    );
  });

  it('should NOT show fallback button when route is missing and reroute is disabled (backwards compatibility)', () => {
    const { container } = render(
      <IntroductionPageUpdate
        showWizard={false}
        route={undefined}
        rerouteEnabled={false}
      />,
    );

    // Should not show fallback for legacy flow
    const link = container.querySelector('va-link-action');
    expect(link).to.not.exist;
  });
});
