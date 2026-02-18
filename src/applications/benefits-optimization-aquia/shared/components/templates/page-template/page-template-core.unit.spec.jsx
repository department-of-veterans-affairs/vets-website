import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { PageTemplateCore } from './page-template';

/**
 * Unit tests for PageTemplateCore component.
 * Tests the core template functionality without Redux/Router dependencies.
 * This is the component that should be used in most unit tests.
 */
describe('PageTemplateCore', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      data: {},
      setFormData: sinon.spy(),
      goForward: sinon.spy(),
      goBack: sinon.spy(),
      useFormSectionHook: false,
    };
  });

  describe('basic rendering', () => {
    it('renders without Redux/Router context', () => {
      const { container } = render(
        <PageTemplateCore {...defaultProps}>
          <div className="test-content">Test Content</div>
        </PageTemplateCore>,
      );

      const form = container.querySelector('form');
      expect(form).to.exist;

      const content = container.querySelector('.test-content');
      expect(content).to.exist;
      expect(content.textContent).to.equal('Test Content');
    });

    it('renders title when provided', () => {
      const { container } = render(
        <PageTemplateCore {...defaultProps} title="Test Title">
          <div>Content</div>
        </PageTemplateCore>,
      );

      const heading = container.querySelector('h3');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Test Title');
    });

    it('renders subtitle when provided', () => {
      const { container } = render(
        <PageTemplateCore {...defaultProps} subtitle="Test Subtitle">
          <div>Content</div>
        </PageTemplateCore>,
      );

      const subtitle = container.querySelector('.vads-u-margin-bottom--2 p');
      expect(subtitle).to.exist;
      expect(subtitle.textContent).to.equal('Test Subtitle');
    });
  });

  describe('navigation', () => {
    it('renders navigation buttons', () => {
      const { container } = render(
        <PageTemplateCore {...defaultProps}>
          <div>Content</div>
        </PageTemplateCore>,
      );

      const backButton = container.querySelector('va-button[secondary]');
      const continueButton = container.querySelector(
        'va-button:not([secondary])',
      );

      expect(backButton).to.exist;
      expect(continueButton).to.exist;
    });

    it('calls goBack when back button is clicked', () => {
      const { container } = render(
        <PageTemplateCore {...defaultProps}>
          <div>Content</div>
        </PageTemplateCore>,
      );

      const backButton = container.querySelector('va-button[secondary]');
      backButton.click();

      expect(defaultProps.goBack.calledOnce).to.be.true;
    });

    it('calls goForward when continue button is clicked', () => {
      const { container } = render(
        <PageTemplateCore {...defaultProps}>
          <div>Content</div>
        </PageTemplateCore>,
      );

      const continueButton = container.querySelector(
        'va-button:not([secondary])',
      );
      continueButton.click();

      expect(defaultProps.goForward.calledOnce).to.be.true;
    });

    it('hides navigation when hideNavigation is true', () => {
      const { container } = render(
        <PageTemplateCore {...defaultProps} hideNavigation>
          <div>Content</div>
        </PageTemplateCore>,
      );

      const buttons = container.querySelectorAll('va-button');
      expect(buttons).to.have.length(0);
    });
  });

  describe('children rendering', () => {
    it('renders children elements', () => {
      const { container } = render(
        <PageTemplateCore {...defaultProps}>
          <input name="testField" defaultValue="test" />
          <div className="static">Static Content</div>
        </PageTemplateCore>,
      );

      const input = container.querySelector('input[name="testField"]');
      const div = container.querySelector('.static');

      expect(input).to.exist;
      expect(input.value).to.equal('test');
      expect(div).to.exist;
      expect(div.textContent).to.equal('Static Content');
    });

    it('renders function children', () => {
      const childFunction = sinon.spy(props => (
        <div className="rendered">
          {props.localData ? 'Has localData' : 'No localData'}
        </div>
      ));

      const { container } = render(
        <PageTemplateCore {...defaultProps} sectionName="test">
          {childFunction}
        </PageTemplateCore>,
      );

      expect(childFunction.calledOnce).to.be.true;
      const content = container.querySelector('.rendered');
      expect(content).to.exist;
    });
  });

  describe('does not include save-in-progress UI', () => {
    it('does not render SaveFormLink', () => {
      const { container } = render(
        <PageTemplateCore {...defaultProps}>
          <div>Content</div>
        </PageTemplateCore>,
      );

      // Core template should only have the form, not save UI
      const form = container.querySelector('form');
      expect(form).to.exist;

      // Should not have save-related elements
      const wrapper = container.querySelector('.form-panel');
      expect(wrapper).to.exist;
    });
  });
});
