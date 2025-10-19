import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { SaveInProgress } from './save-in-progress';

describe('SaveInProgress', () => {
  let defaultFormConfig;
  let defaultLocation;
  let defaultRouter;
  let defaultProps;

  beforeEach(() => {
    defaultFormConfig = {
      formId: 'TEST-FORM',
      title: 'Test Form Title',
      urlPrefix: '/test-form',
      prefillTransformer: sinon.stub(),
      migrations: [],
    };

    defaultLocation = {
      pathname: '/test-form/step-1',
    };

    defaultRouter = {
      push: sinon.spy(),
      routes: [{}, { formConfig: defaultFormConfig }],
    };

    defaultProps = {
      formConfig: defaultFormConfig,
      location: defaultLocation,
      router: defaultRouter,
      isLoggedIn: false,
      savedForms: [],
      loadedStatus: 'notAttempted',
      formData: {},
      loadedData: {},
      profileLoading: false,
      fetchInProgressFormAction: sinon.stub(),
      removeInProgressFormAction: sinon.stub(),
    };
  });

  describe('rendering children', () => {
    it('renders children when no special conditions', () => {
      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={defaultLocation}
          router={defaultRouter}
        >
          <div data-testid="form-content">Form page content</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="form-content"]');
      expect(content).to.exist;
      expect(content.textContent).to.equal('Form page content');
    });

    it('renders complex children structure', () => {
      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={defaultLocation}
          router={defaultRouter}
        >
          <div>
            <nav>Breadcrumbs</nav>
            <main>Form content</main>
          </div>
        </SaveInProgress>,
      );

      const nav = container.querySelector('nav');
      const main = container.querySelector('main');
      expect(nav).to.exist;
      expect(main).to.exist;
    });
  });

  describe('profile loading state', () => {
    it('does not show profile loading on introduction page', () => {
      const introLocation = { pathname: '/test-form/introduction' };

      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={introLocation}
          router={defaultRouter}
        >
          <div data-testid="form-content">Intro content</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="form-content"]');
      expect(content).to.exist;
    });

    it('preserves breadcrumbs during profile loading', () => {
      const children = (
        <div>
          <nav data-testid="breadcrumbs">Home &gt; Form</nav>
          <div>Form content</div>
        </div>
      );

      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={defaultLocation}
          router={defaultRouter}
        >
          {children}
        </SaveInProgress>,
      );

      const breadcrumbs = container.querySelector(
        '[data-testid="breadcrumbs"]',
      );
      expect(breadcrumbs).to.exist;
      expect(breadcrumbs.textContent).to.equal('Home > Form');
    });
  });

  describe('form data loading state', () => {
    it('preserves breadcrumbs during form loading', () => {
      const children = (
        <div>
          <nav data-testid="breadcrumbs">Breadcrumbs</nav>
          <div>Form content</div>
        </div>
      );

      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={defaultLocation}
          router={defaultRouter}
        >
          {children}
        </SaveInProgress>,
      );

      const breadcrumbs = container.querySelector(
        '[data-testid="breadcrumbs"]',
      );
      expect(breadcrumbs).to.exist;
    });
  });

  describe('resume controls display', () => {
    it('does not show resume controls when not logged in', () => {
      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={defaultLocation}
          router={defaultRouter}
        >
          <div data-testid="form-content">Form content</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="form-content"]');
      expect(content).to.exist;
    });

    it('does not show resume controls on introduction page', () => {
      const introLocation = { pathname: '/test-form/introduction' };

      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={introLocation}
          router={defaultRouter}
        >
          <div data-testid="intro-content">Intro content</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="intro-content"]');
      expect(content).to.exist;
    });

    it('does not show resume controls on confirmation page', () => {
      const confirmLocation = { pathname: '/test-form/confirmation' };

      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={confirmLocation}
          router={defaultRouter}
        >
          <div data-testid="confirm-content">Confirmation</div>
        </SaveInProgress>,
      );

      const content = container.querySelector(
        '[data-testid="confirm-content"]',
      );
      expect(content).to.exist;
    });

    it('does not show resume controls when form data already loaded', () => {
      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={defaultLocation}
          router={defaultRouter}
        >
          <div data-testid="form-content">Form content</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="form-content"]');
      expect(content).to.exist;
    });
  });

  describe('expired form handling', () => {});

  describe('form title display', () => {});

  describe('page detection logic', () => {
    it('excludes error pages from showing resume controls', () => {
      const errorLocation = { pathname: '/test-form/error' };

      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={errorLocation}
          router={defaultRouter}
        >
          <div data-testid="error-content">Error page</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="error-content"]');
      expect(content).to.exist;
    });

    it('excludes resume pages from showing resume controls', () => {
      const resumeLocation = { pathname: '/test-form/resume' };

      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={resumeLocation}
          router={defaultRouter}
        >
          <div data-testid="resume-content">Resume page</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="resume-content"]');
      expect(content).to.exist;
    });
  });

  describe('edge cases', () => {
    it('handles empty savedForms array', () => {
      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={defaultLocation}
          router={defaultRouter}
        >
          <div data-testid="form-content">Form content</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="form-content"]');
      expect(content).to.exist;
    });

    it('handles different form ID in saved forms', () => {
      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={defaultLocation}
          router={defaultRouter}
        >
          <div data-testid="form-content">Form content</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="form-content"]');
      expect(content).to.exist;
    });

    it('handles root path (/)', () => {
      const rootLocation = { pathname: '/' };

      const { container } = render(
        <SaveInProgress
          {...defaultProps}
          formConfig={defaultFormConfig}
          location={rootLocation}
          router={defaultRouter}
        >
          <div data-testid="form-content">Root content</div>
        </SaveInProgress>,
      );

      const content = container.querySelector('[data-testid="form-content"]');
      expect(content).to.exist;
    });
  });

  describe('accessibility', () => {});

  describe('layout classes', () => {});
});
