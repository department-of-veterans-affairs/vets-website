import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as uiUtils from 'platform/utilities/ui';
import { IntroductionPage } from '@bio-aquia/21-4192-employment-information/containers';

const defaultProps = {
  router: {
    push: sinon.spy(),
  },
  location: {
    pathname: '/introduction',
  },
};

describe('IntroductionPage', () => {
  let scrollToTopStub;
  let focusElementStub;

  beforeEach(() => {
    scrollToTopStub = sinon.stub(uiUtils, 'scrollToTop');
    focusElementStub = sinon.stub(uiUtils, 'focusElement');
  });

  afterEach(() => {
    scrollToTopStub.restore();
    focusElementStub.restore();
  });

  it('should render the form title and subtitle', () => {
    const { getByTestId } = render(<IntroductionPage {...defaultProps} />);

    const title = getByTestId('form-title');
    expect(title).to.exist;
    expect(title.textContent).to.include('Provide Employment Information');

    const subtitle = getByTestId('form-subtitle');
    expect(subtitle).to.exist;
    expect(subtitle.textContent).to.include('VA Form 21-4192');
  });

  it('should render process list with steps', () => {
    const { container } = render(<IntroductionPage {...defaultProps} />);

    const processItems = container.querySelectorAll('va-process-list-item');
    expect(processItems).to.have.lengthOf(3);
    expect(processItems[0].getAttribute('header')).to.equal(
      'Gather your information',
    );
    expect(processItems[1].getAttribute('header')).to.equal(
      'Fill out and sign the form',
    );
    expect(processItems[2].getAttribute('header')).to.equal('Submit the form');
  });

  it('should render the required information lists', () => {
    const { container } = render(<IntroductionPage {...defaultProps} />);

    expect(container.textContent).to.include('social security number');
    expect(container.textContent).to.include('date of birth');
    expect(container.textContent).to.include(
      'The business name of the employer',
    );
    expect(container.textContent).to.include('The type of work they did');
    expect(container.textContent).to.include(
      'National Guard or Reserve status',
    );
  });

  it('should render the start link action', () => {
    const { container } = render(<IntroductionPage {...defaultProps} />);

    const startLink = container.querySelector(
      'va-link-action[data-testid="start-employment-info-link"]',
    );
    expect(startLink).to.exist;
    expect(startLink.getAttribute('text')).to.equal(
      'Submit employment information in connection with claim for Individual Unemployability',
    );
  });

  it('should navigate to first page when start link is clicked', () => {
    const mockRouter = {
      push: sinon.spy(),
    };
    const { container } = render(
      <IntroductionPage {...defaultProps} router={mockRouter} />,
    );

    const startLink = container.querySelector(
      'va-link-action[data-testid="start-employment-info-link"]',
    );
    startLink.click();

    expect(mockRouter.push.calledWith('/veteran-information')).to.be.true;
  });

  it('should scroll to top and focus h1 on mount', () => {
    render(<IntroductionPage {...defaultProps} />);

    expect(scrollToTopStub).to.exist;
    expect(focusElementStub).to.exist;
  });

  it('should display OMB information', () => {
    const { container } = render(<IntroductionPage {...defaultProps} />);

    const ombInfo = container.querySelector('va-omb-info');
    expect(ombInfo).to.exist;
    expect(ombInfo.getAttribute('res-burden')).to.equal('15');
    expect(ombInfo.getAttribute('omb-number')).to.equal('2900-0065');
    expect(ombInfo.getAttribute('exp-date')).to.equal('08/31/2027');
  });
});
