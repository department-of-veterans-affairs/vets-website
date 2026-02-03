import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  sameBenefitResultPage,
  foreignSchoolResultPage,
  mgibAdResultPage,
  pgibResultPage,
} from '../../pages/mebQuestionnaire';

const mockStore = configureStore([]);

describe('mebQuestionnaire result pages', () => {
  afterEach(() => {
    cleanup();
    delete window.__suppressBeforeunload;
  });

  const createMockStore = () =>
    mockStore({
      user: {
        profile: {
          loa: {
            current: 1,
          },
        },
      },
    });

  describe('beforeunload alert suppression', () => {
    it('should set suppression flag on sameBenefitResultPage', () => {
      const store = createMockStore();
      const formData = { mebSameBenefitSelection: 'chapter33' };
      const { uiSchema } = sameBenefitResultPage();
      const DescriptionComponent = uiSchema['ui:description'];

      expect(window.__suppressBeforeunload).to.be.undefined;

      render(
        <Provider store={store}>
          <DescriptionComponent formData={formData} />
        </Provider>,
      );

      expect(window.__suppressBeforeunload).to.be.true;
    });

    it('should set suppression flag on foreignSchoolResultPage', () => {
      const store = createMockStore();
      const formData = {};
      const { uiSchema } = foreignSchoolResultPage();
      const DescriptionComponent = uiSchema['ui:description'];

      expect(window.__suppressBeforeunload).to.be.undefined;

      render(
        <Provider store={store}>
          <DescriptionComponent formData={formData} />
        </Provider>,
      );

      expect(window.__suppressBeforeunload).to.be.true;
    });

    it('should set suppression flag on mgibAdResultPage', () => {
      const store = createMockStore();
      const formData = {};
      const { uiSchema } = mgibAdResultPage();
      const DescriptionComponent = uiSchema['ui:description'];

      expect(window.__suppressBeforeunload).to.be.undefined;

      render(
        <Provider store={store}>
          <DescriptionComponent formData={formData} />
        </Provider>,
      );

      expect(window.__suppressBeforeunload).to.be.true;
    });

    it('should set suppression flag on pgibResultPage', () => {
      const store = createMockStore();
      const formData = {};
      const { uiSchema } = pgibResultPage();
      const DescriptionComponent = uiSchema['ui:description'];

      expect(window.__suppressBeforeunload).to.be.undefined;

      render(
        <Provider store={store}>
          <DescriptionComponent formData={formData} />
        </Provider>,
      );

      expect(window.__suppressBeforeunload).to.be.true;
    });

    it('should cleanup suppression flag on unmount', () => {
      const store = createMockStore();
      const formData = { mebSameBenefitSelection: 'chapter33' };
      const { uiSchema } = sameBenefitResultPage();
      const DescriptionComponent = uiSchema['ui:description'];

      const { unmount } = render(
        <Provider store={store}>
          <DescriptionComponent formData={formData} />
        </Provider>,
      );

      expect(window.__suppressBeforeunload).to.be.true;

      unmount();

      expect(window.__suppressBeforeunload).to.be.undefined;
    });
  });

  describe('result page content', () => {
    it('should render restart questionnaire link', () => {
      const store = createMockStore();
      const formData = { mebSameBenefitSelection: 'chapter33' };
      const { uiSchema } = sameBenefitResultPage();
      const DescriptionComponent = uiSchema['ui:description'];

      const { container } = render(
        <Provider store={store}>
          <DescriptionComponent formData={formData} />
        </Provider>,
      );

      const restartLink = container.querySelector(
        'va-link[text="Restart questionnaire"]',
      );
      expect(restartLink).to.exist;
      expect(restartLink.getAttribute('href')).to.include('/introduction');
    });
  });
});
