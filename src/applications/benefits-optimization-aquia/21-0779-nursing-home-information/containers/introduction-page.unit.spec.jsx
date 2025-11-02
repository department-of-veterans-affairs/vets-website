/**
 * Unit tests for IntroductionPage container component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { IntroductionPage } from './introduction-page';

describe('IntroductionPage Container', () => {
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
});
