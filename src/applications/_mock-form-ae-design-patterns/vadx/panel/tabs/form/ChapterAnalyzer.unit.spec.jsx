import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import ChapterAnalyzer from './ChapterAnalyzer';

const initialState = {
  form: {
    data: {
      someField: 'value',
    },
  },
};

const path = '/form/name-birth';

const reducers = {
  form: (state = initialState) => state,
};

describe('ChapterAnalyzer', () => {
  describe('when no chapters exist on formConfig', () => {
    it('should display no chapters found message', () => {
      const { getByText } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={{}} />,
        { initialState, path, history: null, reducers },
      );

      expect(getByText('No chapters or form config found')).to.exist;
    });
  });

  describe('with valid form config', () => {
    let formConfig;

    beforeEach(() => {
      formConfig = {
        chapters: {
          personalInfo: {
            title: 'Personal Information',
            pages: {
              nameAndBirth: {
                title: 'Name and Birth Date',
                path: 'name-birth',
                depends: () => true,
              },
              contactInfo: {
                title: 'Contact Information',
                path: 'contact',
                CustomPage: () => null,
                uiSchema: { 'ui:title': 'Contact' },
              },
            },
          },
        },
      };
    });

    it('should render chapter titles', () => {
      const { getByText } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={formConfig} urlPrefix="/form/" />,
        { initialState, path, history: null, reducers },
      );

      expect(getByText('Personal Information')).to.exist;
    });

    it('should render page links', () => {
      const { getByText } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={formConfig} urlPrefix="/form/" />,
        { initialState, path, history: null, reducers },
      );

      const pageTitleLink = getByText('Name and Birth Date').closest('a');

      expect(pageTitleLink, 'Link element exists').to.not.be.null;
      expect(pageTitleLink, 'Link is an anchor tag').to.have.property(
        'tagName',
        'A',
      );
    });

    it('should show warning badge when CustomPage and uiSchema exist together', () => {
      const { getByText } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={formConfig} urlPrefix="/form" />,
        { initialState, path, history: null, reducers },
      );

      expect(getByText('Warning: uiSchema may be ignored')).to.exist;
    });

    it('should show visibility indicator for pages with depends function', () => {
      const { container } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={formConfig} urlPrefix="/form" />,
        { initialState, path, history: null, reducers },
      );

      // Check for visibility icon
      // have to use container.querySelector because
      // visibility icon is web component
      const visibilityIcon = container.querySelector(
        'va-icon[icon="visibility"]',
      );
      expect(visibilityIcon).to.exist;
    });

    it('should show visibility_off indicator for pages with depends function that return false', () => {
      formConfig.chapters.personalInfo.pages.nameAndBirth.depends = () => false;

      const { container } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={formConfig} urlPrefix="/form" />,
        { initialState, path, history: null, reducers },
      );

      const visibilityOffIcon = container.querySelector(
        'va-icon[icon="visibility_off"]',
      );
      expect(visibilityOffIcon).to.exist;
    });

    it('should handle pages without titles', () => {
      const configWithoutTitle = {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                path: '/path',
              },
            },
          },
        },
      };

      const { getByText } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={configWithoutTitle} urlPrefix="/form" />,
        { initialState, path, history: null, reducers },
      );

      expect(getByText('page1: no title')).to.exist;
    });

    it('should show warning badge when CustomPage and uiSchema exist together', () => {
      const { getByText } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={formConfig} urlPrefix="/form" />,
        { initialState, path, history: null, reducers },
      );

      expect(getByText('Warning: uiSchema may be ignored')).to.exist;
    });
  });

  describe('CustomPage indicators', () => {
    it('should show CustomPage indicator', () => {
      const config = {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                title: 'Test Page',
                CustomPage: () => null,
              },
            },
          },
        },
      };

      const { getByText } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={config} urlPrefix="/form" />,
        { initialState, path, history: null, reducers },
      );

      expect(getByText('[CustomPage]')).to.exist;
    });

    it('should show CustomPage+Review indicator when both exist', () => {
      const config = {
        chapters: {
          chapter1: {
            pages: {
              page1: {
                title: 'Test Page',
                CustomPage: () => null,
                CustomPageReview: () => null,
              },
            },
          },
        },
      };

      const { getByText } = renderWithStoreAndRouter(
        <ChapterAnalyzer formConfig={config} urlPrefix="/form" />,
        { initialState, path, history: null, reducers },
      );

      expect(getByText('[CustomPage+Review]')).to.exist;
    });
  });
});
