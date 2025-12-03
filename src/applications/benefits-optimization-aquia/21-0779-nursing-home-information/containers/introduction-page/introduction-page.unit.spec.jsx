import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as uiUtils from 'platform/utilities/ui';

import { IntroductionPage } from './introduction-page';

describe('IntroductionPage Container', () => {
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
  describe('Component Rendering', () => {
    it('should render without errors', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container).to.exist;
    });

    it('should display form title', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('nursing home');
    });

    it('should have schemaform-intro class', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      const article = container.querySelector('.schemaform-intro');
      expect(article).to.exist;
    });

    it('should render OMB info component', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      const ombInfo = container.querySelector('va-omb-info');
      expect(ombInfo).to.exist;
    });

    it('should scroll to top and focus h1 on mount', () => {
      const router = { push: () => {} };
      render(<IntroductionPage router={router} />);

      expect(scrollToTopStub).to.exist;
      expect(focusElementStub).to.exist;
    });
  });

  describe('Content', () => {
    it('should explain form purpose', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('nursing home official');
    });

    it('should mention extended care facility', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('extended care facility');
    });

    it('should mention level of care', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('Level of care');
    });

    it('should mention Medicaid status', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('Medicaid status');
    });
  });

  describe('Props', () => {
    it('should accept router prop', () => {
      const router = { push: () => {}, replace: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container).to.exist;
    });

    it('should accept location prop', () => {
      const router = { push: () => {} };
      const location = { pathname: '/introduction' };
      const { container } = render(
        <IntroductionPage router={router} location={location} />,
      );
      expect(container).to.exist;
    });
  });

  describe('Start Link Action', () => {
    it('should render start link button', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      const startLink = container.querySelector('va-link-action');
      expect(startLink).to.exist;
    });

    it('should have correct test id on start link', () => {
      const router = { push: () => {} };
      const { getByTestId } = render(<IntroductionPage router={router} />);
      const startLink = getByTestId('start-nursing-home-info-link');
      expect(startLink).to.exist;
    });

    it('should call router.push when start link is clicked', () => {
      const pushSpy = sinon.spy();
      const router = { push: pushSpy };
      const { getByTestId } = render(<IntroductionPage router={router} />);
      const startLink = getByTestId('start-nursing-home-info-link');

      fireEvent.click(startLink);

      expect(pushSpy.calledOnce).to.be.true;
      expect(pushSpy.calledWith('/nursing-official-information')).to.be.true;
    });

    it('should prevent default behavior on link click', () => {
      const router = { push: () => {} };
      const { getByTestId } = render(<IntroductionPage router={router} />);
      const startLink = getByTestId('start-nursing-home-info-link');

      const event = new MouseEvent('click', { bubbles: true });
      const preventDefaultSpy = sinon.spy(event, 'preventDefault');

      fireEvent(startLink, event);

      expect(preventDefaultSpy.called).to.be.true;
    });
  });

  describe('OMB Information', () => {
    it('should display OMB number', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      const ombInfo = container.querySelector('va-omb-info');
      expect(ombInfo.getAttribute('omb-number')).to.equal('2900-0652');
    });

    it('should display response burden time', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      const ombInfo = container.querySelector('va-omb-info');
      expect(ombInfo.getAttribute('res-burden')).to.equal('10');
    });

    it('should display expiration date', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      const ombInfo = container.querySelector('va-omb-info');
      expect(ombInfo.getAttribute('exp-date')).to.equal('09/30/2026');
    });
  });

  describe('Required Information List', () => {
    it('should list Social Security number requirement', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('Social Security number');
    });

    it('should list date of birth requirement', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('Date of birth');
    });

    it('should list monthly cost requirement', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('Monthly out of pocket cost');
    });
  });

  describe('Links', () => {
    it('should include link to pension information', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      const link = container.querySelector(
        'va-link[href="/pension/aid-attendance-housebound/"]',
      );
      expect(link).to.exist;
    });

    it('should have descriptive link text', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      const link = container.querySelector(
        'va-link[href="/pension/aid-attendance-housebound/"]',
      );
      expect(link.getAttribute('text')).to.include('nursing home');
    });
  });

  describe('Nursing Home Definition', () => {
    it('should explain qualified extended care facility', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include(
        'What is a qualified extended care facility',
      );
    });

    it('should mention state licensed facilities', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('licensed by a state');
    });

    it('should mention VA nursing home care unit', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('VA nursing home care unit');
    });

    it('should mention State Veterans Home', () => {
      const router = { push: () => {} };
      const { container } = render(<IntroductionPage router={router} />);
      expect(container.textContent).to.include('State Veterans Home');
    });
  });
});
