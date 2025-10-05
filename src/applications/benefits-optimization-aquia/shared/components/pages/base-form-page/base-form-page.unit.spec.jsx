import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { BaseFormPage } from './base-form-page';

describe('BaseFormPage', () => {
  describe('rendering', () => {
    it('renders children content', () => {
      const { container } = render(
        <BaseFormPage>
          <div className="test-content">Test Content</div>
        </BaseFormPage>,
      );

      const content = container.querySelector('.test-content');
      expect(content).to.exist;
      expect(content.textContent).to.equal('Test Content');
    });

    it('renders title when provided', () => {
      const { container } = render(
        <BaseFormPage title="Test Page Title">
          <div>Content</div>
        </BaseFormPage>,
      );

      const heading = container.querySelector('h2');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Test Page Title');
      expect(heading).to.have.class('vads-u-font-size--h3');
      expect(heading).to.have.class('vads-u-margin-bottom--2');
    });

    it('renders subtitle when provided', () => {
      const { container } = render(
        <BaseFormPage subtitle="This is a subtitle">
          <div>Content</div>
        </BaseFormPage>,
      );

      const subtitle = container.querySelector('p');
      expect(subtitle).to.exist;
      expect(subtitle.textContent).to.equal('This is a subtitle');
      expect(subtitle).to.have.class('vads-u-font-size--lg');
      expect(subtitle).to.have.class('vads-u-margin-bottom--2');
    });

    it('renders both title and subtitle', () => {
      const { container } = render(
        <BaseFormPage title="Page Title" subtitle="Page Subtitle">
          <div>Content</div>
        </BaseFormPage>,
      );

      const heading = container.querySelector('h2');
      const subtitle = container.querySelector('p');

      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Page Title');
      expect(subtitle).to.exist;
      expect(subtitle.textContent).to.equal('Page Subtitle');
    });

    it('applies custom className', () => {
      const { container } = render(
        <BaseFormPage className="custom-class">
          <div>Content</div>
        </BaseFormPage>,
      );

      const wrapper = container.firstChild;
      expect(wrapper).to.have.class('custom-class');
      expect(wrapper).to.have.class('vads-u-margin-y--2');
    });

    it('uses different header levels', () => {
      const { container: h1Container } = render(
        <BaseFormPage title="H1 Title" headerLevel="h1">
          <div>Content</div>
        </BaseFormPage>,
      );

      const h1 = h1Container.querySelector('h1');
      expect(h1).to.exist;
      expect(h1.textContent).to.equal('H1 Title');

      const { container: h3Container } = render(
        <BaseFormPage title="H3 Title" headerLevel="h3">
          <div>Content</div>
        </BaseFormPage>,
      );

      const h3 = h3Container.querySelector('h3');
      expect(h3).to.exist;
      expect(h3.textContent).to.equal('H3 Title');

      const { container: h4Container } = render(
        <BaseFormPage title="H4 Title" headerLevel="h4">
          <div>Content</div>
        </BaseFormPage>,
      );

      const h4 = h4Container.querySelector('h4');
      expect(h4).to.exist;
      expect(h4.textContent).to.equal('H4 Title');
    });

    it('defaults to h2 header level', () => {
      const { container } = render(
        <BaseFormPage title="Default Title">
          <div>Content</div>
        </BaseFormPage>,
      );

      const h2 = container.querySelector('h2');
      const h1 = container.querySelector('h1');
      const h3 = container.querySelector('h3');

      expect(h2).to.exist;
      expect(h1).to.not.exist;
      expect(h3).to.not.exist;
    });
  });

  describe('border display', () => {
    it('shows border when showBorder is true', () => {
      const { container } = render(
        <BaseFormPage showBorder>
          <div>Content</div>
        </BaseFormPage>,
      );

      const wrapper = container.firstChild;
      expect(wrapper).to.have.class('vads-u-border--1px');
      expect(wrapper).to.have.class('vads-u-border-color--gray-light');
      expect(wrapper).to.have.class('vads-u-padding--2');
    });

    it('does not show border by default', () => {
      const { container } = render(
        <BaseFormPage>
          <div>Content</div>
        </BaseFormPage>,
      );

      const wrapper = container.firstChild;
      expect(wrapper).to.not.have.class('vads-u-border--1px');
      expect(wrapper).to.not.have.class('vads-u-border-color--gray-light');
      expect(wrapper).to.not.have.class('vads-u-padding--2');
    });
  });

  describe('progress indicator', () => {
    it('shows progress bar when showProgress is true with steps', () => {
      const { container } = render(
        <BaseFormPage showProgress currentStep={3} totalSteps={5}>
          <div>Content</div>
        </BaseFormPage>,
      );

      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.exist;
      expect(progressBar).to.have.attribute('label', 'Form progress');
      expect(progressBar).to.have.attribute('percent', '60');

      const stepText = container.querySelector('.vads-u-font-size--sm');
      expect(stepText).to.exist;
      expect(stepText.textContent).to.equal('Step 3 of 5');
    });

    it('calculates correct progress percentage', () => {
      const { container } = render(
        <BaseFormPage showProgress currentStep={1} totalSteps={4}>
          <div>Content</div>
        </BaseFormPage>,
      );

      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('percent', '25');

      const stepText = container.querySelector('.vads-u-font-size--sm');
      expect(stepText.textContent).to.equal('Step 1 of 4');
    });

    it('shows 100% progress on last step', () => {
      const { container } = render(
        <BaseFormPage showProgress currentStep={10} totalSteps={10}>
          <div>Content</div>
        </BaseFormPage>,
      );

      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.have.attribute('percent', '100');

      const stepText = container.querySelector('.vads-u-font-size--sm');
      expect(stepText.textContent).to.equal('Step 10 of 10');
    });

    it('does not show progress bar when showProgress is false', () => {
      const { container } = render(
        <BaseFormPage showProgress={false} currentStep={3} totalSteps={5}>
          <div>Content</div>
        </BaseFormPage>,
      );

      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.not.exist;
    });

    it('does not show progress bar when steps are missing', () => {
      const { container } = render(
        <BaseFormPage showProgress>
          <div>Content</div>
        </BaseFormPage>,
      );

      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.not.exist;
    });

    it('does not show progress bar when only currentStep is provided', () => {
      const { container } = render(
        <BaseFormPage showProgress currentStep={3}>
          <div>Content</div>
        </BaseFormPage>,
      );

      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.not.exist;
    });

    it('does not show progress bar when only totalSteps is provided', () => {
      const { container } = render(
        <BaseFormPage showProgress totalSteps={5}>
          <div>Content</div>
        </BaseFormPage>,
      );

      const progressBar = container.querySelector('va-progress-bar');
      expect(progressBar).to.not.exist;
    });
  });

  describe('CSS classes', () => {
    it('applies default margin class', () => {
      const { container } = render(
        <BaseFormPage>
          <div>Content</div>
        </BaseFormPage>,
      );

      const wrapper = container.firstChild;
      expect(wrapper).to.have.class('vads-u-margin-y--2');
    });

    it('combines multiple classes correctly', () => {
      const { container } = render(
        <BaseFormPage className="custom-class" showBorder>
          <div>Content</div>
        </BaseFormPage>,
      );

      const wrapper = container.firstChild;
      expect(wrapper).to.have.class('vads-u-margin-y--2');
      expect(wrapper).to.have.class('vads-u-border--1px');
      expect(wrapper).to.have.class('vads-u-border-color--gray-light');
      expect(wrapper).to.have.class('vads-u-padding--2');
      expect(wrapper).to.have.class('custom-class');
    });
  });

  describe('complex content', () => {
    it('renders multiple children', () => {
      const { container } = render(
        <BaseFormPage title="Complex Page">
          <div className="child-1">First Child</div>
          <div className="child-2">Second Child</div>
          <div className="child-3">Third Child</div>
        </BaseFormPage>,
      );

      expect(container.querySelector('.child-1')).to.exist;
      expect(container.querySelector('.child-2')).to.exist;
      expect(container.querySelector('.child-3')).to.exist;
    });

    it('renders nested components', () => {
      const NestedComponent = () => (
        <div className="nested">
          <span className="nested-child">Nested Content</span>
        </div>
      );

      const { container } = render(
        <BaseFormPage>
          <NestedComponent />
        </BaseFormPage>,
      );

      expect(container.querySelector('.nested')).to.exist;
      expect(container.querySelector('.nested-child')).to.exist;
      expect(container.querySelector('.nested-child').textContent).to.equal(
        'Nested Content',
      );
    });

    it('maintains content order with all features', () => {
      const { container } = render(
        <BaseFormPage
          title="Full Featured Page"
          subtitle="With all the features"
          showProgress
          currentStep={2}
          totalSteps={4}
          showBorder
          className="custom"
        >
          <div className="content">Main Content</div>
        </BaseFormPage>,
      );

      const elements = container.querySelectorAll('*');
      let progressFound = false;
      let titleFound = false;
      let subtitleFound = false;
      let contentFound = false;

      elements.forEach(el => {
        if (el.tagName === 'VA-PROGRESS-BAR') progressFound = true;
        if (el.tagName === 'H2' && !titleFound) {
          titleFound = true;
          expect(progressFound).to.be.true; // Progress should come before title
        }
        if (el.tagName === 'P' && !subtitleFound) {
          subtitleFound = true;
          expect(titleFound).to.be.true; // Title should come before subtitle
        }
        if (el.className === 'content' && !contentFound) {
          contentFound = true;
          expect(subtitleFound).to.be.true; // Subtitle should come before content
        }
      });

      expect(progressFound).to.be.true;
      expect(titleFound).to.be.true;
      expect(subtitleFound).to.be.true;
      expect(contentFound).to.be.true;
    });
  });

  describe('edge cases', () => {
    it('handles empty children', () => {
      const { container } = render(<BaseFormPage>{null}</BaseFormPage>);

      const wrapper = container.firstChild;
      expect(wrapper).to.exist;
      expect(wrapper).to.have.class('vads-u-margin-y--2');
    });

    it('handles undefined props gracefully', () => {
      const { container } = render(
        <BaseFormPage
          title={undefined}
          subtitle={undefined}
          className={undefined}
        >
          <div>Content</div>
        </BaseFormPage>,
      );

      const wrapper = container.firstChild;
      expect(wrapper).to.exist;
      expect(container.querySelector('h2')).to.not.exist;
      expect(container.querySelector('p')).to.not.exist;
    });

    it('handles very long title and subtitle', () => {
      const longTitle = 'A'.repeat(200);
      const longSubtitle = 'B'.repeat(300);

      const { container } = render(
        <BaseFormPage title={longTitle} subtitle={longSubtitle}>
          <div>Content</div>
        </BaseFormPage>,
      );

      const heading = container.querySelector('h2');
      const subtitle = container.querySelector('p');

      expect(heading.textContent).to.have.length(200);
      expect(subtitle.textContent).to.have.length(300);
    });

    it('handles fractional progress steps', () => {
      const { container } = render(
        <BaseFormPage showProgress currentStep={1.5} totalSteps={3.5}>
          <div>Content</div>
        </BaseFormPage>,
      );

      const progressBar = container.querySelector('va-progress-bar');
      // 1.5 / 3.5 * 100 = ~42.857
      expect(progressBar).to.have.attribute('percent', '42.857142857142854');

      const stepText = container.querySelector('.vads-u-font-size--sm');
      expect(stepText.textContent).to.equal('Step 1.5 of 3.5');
    });
  });
});
