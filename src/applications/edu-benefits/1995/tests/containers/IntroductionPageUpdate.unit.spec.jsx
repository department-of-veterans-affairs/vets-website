import React from 'react';
import { expect } from 'chai';
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
});
