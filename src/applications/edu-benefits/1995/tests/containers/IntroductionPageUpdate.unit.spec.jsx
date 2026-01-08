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

  it('should render when in Rudisill flow even if showWizard is undefined', () => {
    sessionStorage.setItem('isRudisillFlow', 'true');

    const { container } = render(
      <IntroductionPageUpdate showWizard={undefined} route={{}} />,
    );

    expect(container.querySelector('.subway-map')).to.exist;
    expect(container.textContent).to.include('Change your education benefits');
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
});
