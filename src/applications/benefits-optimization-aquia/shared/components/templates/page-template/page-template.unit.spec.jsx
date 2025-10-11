import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { PageTemplate } from './index';

/**
 * Unit tests for PageTemplate component.
 * Tests basic rendering, navigation, and form handling without hooks.
 */
describe('PageTemplate - Basic Tests', () => {
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

  describe('rendering without hooks', () => {
    it('renders basic structure', () => {
      const { container } = render(
        <PageTemplate {...defaultProps}>
          <div className="test-content">Test Content</div>
        </PageTemplate>,
      );

      const form = container.querySelector('form');
      expect(form).to.exist;
      expect(form).to.have.attribute('novalidate');

      const content = container.querySelector('.test-content');
      expect(content).to.exist;
      expect(content.textContent).to.equal('Test Content');
    });

    it('renders title when provided', () => {
      const { container } = render(
        <PageTemplate {...defaultProps} title="Test Title">
          <div>Content</div>
        </PageTemplate>,
      );

      const heading = container.querySelector('h3');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Test Title');
    });

    it('renders subtitle when provided', () => {
      const { container } = render(
        <PageTemplate {...defaultProps} subtitle="Test Subtitle">
          <div>Content</div>
        </PageTemplate>,
      );

      const subtitle = container.querySelector('.vads-u-margin-bottom--2 p');
      expect(subtitle).to.exist;
      expect(subtitle.textContent).to.equal('Test Subtitle');
    });

    it('applies custom className', () => {
      const { container } = render(
        <PageTemplate {...defaultProps} className="custom-class">
          <div>Content</div>
        </PageTemplate>,
      );

      const wrapper = container.querySelector('.form-panel');
      expect(wrapper).to.exist;
      expect(wrapper).to.have.class('custom-class');
    });

    it('renders navigation buttons', () => {
      const { container } = render(
        <PageTemplate {...defaultProps}>
          <div>Content</div>
        </PageTemplate>,
      );

      const backButton = container.querySelector('va-button[secondary]');
      const continueButton = container.querySelector(
        'va-button:not([secondary])',
      );

      expect(backButton).to.exist;
      expect(continueButton).to.exist;
    });

    it('hides navigation when hideNavigation is true', () => {
      const { container } = render(
        <PageTemplate {...defaultProps} hideNavigation>
          <div>Content</div>
        </PageTemplate>,
      );

      const buttons = container.querySelectorAll('va-button');
      expect(buttons).to.have.length(0);
    });

    it('calls goBack when back button is clicked', () => {
      const { container } = render(
        <PageTemplate {...defaultProps}>
          <div>Content</div>
        </PageTemplate>,
      );

      const backButton = container.querySelector('va-button[secondary]');
      backButton.click();

      expect(defaultProps.goBack.calledOnce).to.be.true;
    });

    it('calls goForward when continue button is clicked', () => {
      const { container } = render(
        <PageTemplate {...defaultProps}>
          <div>Content</div>
        </PageTemplate>,
      );

      const continueButton = container.querySelector(
        'va-button:not([secondary])',
      );
      continueButton.click();

      expect(defaultProps.goForward.calledOnce).to.be.true;
    });

    it('renders children elements', () => {
      const { container } = render(
        <PageTemplate {...defaultProps}>
          <input name="testField" defaultValue="test" />
          <div className="static">Static Content</div>
        </PageTemplate>,
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
        <PageTemplate {...defaultProps} sectionName="test">
          {childFunction}
        </PageTemplate>,
      );

      expect(childFunction.calledOnce).to.be.true;
      const content = container.querySelector('.rendered');
      expect(content).to.exist;
      expect(content.textContent).to.equal('Has localData');
    });

    it('handles null and undefined children', () => {
      const { container } = render(
        <PageTemplate {...defaultProps}>
          {null}
          {undefined}
          <div className="valid">Valid Child</div>
        </PageTemplate>,
      );

      const validChild = container.querySelector('.valid');
      expect(validChild).to.exist;
      expect(validChild.textContent).to.equal('Valid Child');
    });

    it('hides back button when goBack is not provided', () => {
      const props = {
        data: {},
        setFormData: sinon.spy(),
        goForward: sinon.spy(),
        useFormSectionHook: false,
      };

      const { container } = render(
        <PageTemplate {...props}>
          <div>Content</div>
        </PageTemplate>,
      );

      const backButton = container.querySelector('va-button[secondary]');
      const continueButton = container.querySelector(
        'va-button:not([secondary])',
      );

      expect(backButton).to.not.exist;
      expect(continueButton).to.exist;
    });

    it('applies fieldset classes', () => {
      const { container } = render(
        <PageTemplate {...defaultProps}>
          <div>Content</div>
        </PageTemplate>,
      );

      const fieldset = container.querySelector('fieldset');
      expect(fieldset).to.exist;
      expect(fieldset).to.have.class('vads-u-margin-y--2');
    });

    it('applies form-panel class', () => {
      const { container } = render(
        <PageTemplate {...defaultProps}>
          <div>Content</div>
        </PageTemplate>,
      );

      const wrapper = container.querySelector('.form-panel');
      expect(wrapper).to.exist;
    });

    it('handles missing data prop gracefully', () => {
      const props = {
        data: undefined,
        setFormData: sinon.spy(),
        goForward: sinon.spy(),
        useFormSectionHook: false,
      };

      const { container } = render(
        <PageTemplate {...props}>
          <div className="content">Content</div>
        </PageTemplate>,
      );

      expect(container.querySelector('.form-panel')).to.exist;
      expect(container.querySelector('.content')).to.exist;
    });

    it('handles complex nested children', () => {
      const { container } = render(
        <PageTemplate {...defaultProps}>
          <div>
            <input name="nested1" />
            <div>
              <input name="nested2" />
              <span>
                <input name="nested3" />
              </span>
            </div>
          </div>
        </PageTemplate>,
      );

      expect(container.querySelector('input[name="nested1"]')).to.exist;
      expect(container.querySelector('input[name="nested2"]')).to.exist;
      expect(container.querySelector('input[name="nested3"]')).to.exist;
    });

    it('provides fallback form props when not using hook', () => {
      const childFunction = sinon.spy(props => (
        <div className="props-test">
          {props.localData && 'Has localData'}
          {props.handleFieldChange && ' Has handleFieldChange'}
          {props.errors && ' Has errors'}
        </div>
      ));

      const { container } = render(
        <PageTemplate {...defaultProps} sectionName="test">
          {childFunction}
        </PageTemplate>,
      );

      expect(childFunction.calledOnce).to.be.true;
      const props = childFunction.firstCall.args[0];
      expect(props.localData).to.exist;
      expect(props.handleFieldChange).to.exist;
      expect(props.errors).to.exist;
      expect(props.formSubmitted).to.be.false;

      const content = container.querySelector('.props-test');
      expect(content.textContent).to.equal(
        'Has localData Has handleFieldChange Has errors',
      );
    });

    it('applies custom navigation props', () => {
      const navigationProps = {
        backButtonProps: { 'data-testid': 'custom-back' },
        continueButtonProps: { 'data-testid': 'custom-continue' },
      };

      const { container } = render(
        <PageTemplate {...defaultProps} navigationProps={navigationProps}>
          <div>Content</div>
        </PageTemplate>,
      );

      const backButton = container.querySelector('va-button[secondary]');
      const continueButton = container.querySelector(
        'va-button:not([secondary])',
      );

      expect(backButton).to.have.attribute('data-testid', 'custom-back');
      expect(continueButton).to.have.attribute(
        'data-testid',
        'custom-continue',
      );
    });

    it('handles field changes without form section hook', () => {
      const props = {
        ...defaultProps,
        data: { testSection: { field1: 'initial' } },
      };

      const { container } = render(
        <PageTemplate {...props} sectionName="testSection">
          <input name="field1" defaultValue="initial" />
        </PageTemplate>,
      );

      const input = container.querySelector('input');
      expect(input).to.exist;
      expect(input.value).to.equal('initial');
    });

    it('handles empty sectionName', () => {
      const { container } = render(
        <PageTemplate {...defaultProps} sectionName="">
          <div className="content">Content</div>
        </PageTemplate>,
      );

      expect(container.querySelector('.form-panel')).to.exist;
      expect(container.querySelector('.content')).to.exist;
    });

    it('handles very long content', () => {
      const longContent = 'A'.repeat(10000);

      const { container } = render(
        <PageTemplate {...defaultProps}>
          <div className="long-content">{longContent}</div>
        </PageTemplate>,
      );

      const content = container.querySelector('.long-content');
      expect(content).to.exist;
      expect(content.textContent).to.have.length(10000);
    });
  });
});
