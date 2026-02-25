import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { resolveSharedContent } from '../../../../components/claim-document-request-pages/shared/descriptionContent';

// Helper to render JSX content returned by resolveSharedContent
const renderContent = content => render(<div>{content}</div>);

describe('resolveSharedContent', () => {
  describe('longDescription priority', () => {
    const mockApiLongDescription = {
      blocks: [
        {
          type: 'paragraph',
          content:
            'This is API-provided structured content for longDescription.',
        },
      ],
    };

    it('Priority 1: uses API-provided structured content when present', () => {
      const item = {
        displayName: '21-4142/21-4142a',
        longDescription: mockApiLongDescription,
        description: 'Old simple description',
      };

      const result = resolveSharedContent(item);

      expect(result.longDescriptionTestId).to.equal('api-long-description');
      expect(result.longDescriptionContent).to.not.be.null;
      expect(result.hasDescriptionContent).to.be.ok;
    });

    it('Priority 2: uses frontend dictionary when API content absent', () => {
      const item = {
        displayName: '21-4142/21-4142a',
        description: 'Old simple description',
      };

      const result = resolveSharedContent(item);

      expect(result.longDescriptionTestId).to.equal('frontend-description');
      expect(result.longDescriptionContent).to.not.be.null;
      expect(result.hasDescriptionContent).to.be.ok;
    });

    it('Priority 3: uses simple API description when no structured or dictionary content', () => {
      const item = {
        displayName: 'Unknown Item Type',
        description: 'Simple API description text',
      };

      const result = resolveSharedContent(item);

      expect(result.longDescriptionTestId).to.equal('api-description');
      expect(result.longDescriptionContent).to.not.be.null;
      expect(result.hasDescriptionContent).to.be.ok;
    });

    it('returns null when no content is available', () => {
      const item = {
        displayName: 'Unknown Item Type',
        description: null,
      };

      const result = resolveSharedContent(item);

      expect(result.longDescriptionContent).to.be.null;
      expect(result.longDescriptionTestId).to.be.null;
      expect(result.hasDescriptionContent).to.not.be.ok;
    });
  });

  describe('nextSteps priority', () => {
    const mockApiNextSteps = {
      blocks: [
        {
          type: 'paragraph',
          content: 'These are API-provided structured next steps.',
        },
      ],
    };

    it('Priority 1: uses API-provided structured next steps', () => {
      const item = {
        displayName: '21-4142/21-4142a',
        nextSteps: mockApiNextSteps,
      };

      const result = resolveSharedContent(item);

      expect(result.nextStepsContent).to.not.be.null;
      const { getByTestId, getByText } = renderContent(result.nextStepsContent);
      expect(getByTestId('api-next-steps')).to.exist;
      getByText('These are API-provided structured next steps.');
    });

    it('Priority 2: uses frontend dictionary next steps', () => {
      const item = {
        displayName: '21-4142/21-4142a',
      };

      const result = resolveSharedContent(item);

      expect(result.nextStepsContent).to.not.be.null;
      const { getByTestId } = renderContent(result.nextStepsContent);
      expect(getByTestId('frontend-next-steps')).to.exist;
    });

    it('returns null when no next steps available', () => {
      const item = {
        displayName: 'Unknown Item Type',
      };

      const result = resolveSharedContent(item);

      expect(result.nextStepsContent).to.be.null;
    });
  });

  describe('API description formatting', () => {
    it('should render newlines as separate paragraphs', () => {
      const item = {
        id: 100,
        displayName: 'Test Request',
        status: 'NEEDED_FROM_YOU',
        requestedDate: '2025-12-01',
        description: 'Line one\nLine two\nLine three',
        canUploadFile: true,
      };

      const result = resolveSharedContent(item);

      expect(result.longDescriptionTestId).to.equal('api-description');
      const { container } = renderContent(result.longDescriptionContent);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).to.equal(3);
      expect(paragraphs[0].textContent).to.equal('Line one');
      expect(paragraphs[1].textContent).to.equal('Line two');
      expect(paragraphs[2].textContent).to.equal('Line three');
    });

    it('should render {b}...{/b} as bold text', () => {
      const item = {
        id: 101,
        displayName: 'Test Request',
        status: 'NEEDED_FROM_YOU',
        requestedDate: '2025-12-01',
        description: 'This is {b}important{/b} text',
        canUploadFile: true,
      };

      const result = resolveSharedContent(item);
      const { container } = renderContent(result.longDescriptionContent);
      const strongElement = container.querySelector('strong');
      expect(strongElement).to.exist;
      expect(strongElement.textContent).to.equal('important');
    });

    it('should render [*] markers as list items', () => {
      const item = {
        id: 102,
        displayName: 'Test Request',
        status: 'NEEDED_FROM_YOU',
        requestedDate: '2025-12-01',
        description: '[*] First item\n[*] Second item\n[*] Third item',
        canUploadFile: true,
      };

      const result = resolveSharedContent(item);
      const { container } = renderContent(result.longDescriptionContent);
      const list = container.querySelector('ul');
      expect(list).to.exist;
      const listItems = list.querySelectorAll('li');
      expect(listItems.length).to.equal(3);
      expect(listItems[0].textContent).to.equal('First item');
      expect(listItems[1].textContent).to.equal('Second item');
      expect(listItems[2].textContent).to.equal('Third item');
    });

    it('should render {*} markers as list items', () => {
      const item = {
        id: 103,
        displayName: 'Test Request',
        status: 'NEEDED_FROM_YOU',
        requestedDate: '2025-12-01',
        description: '{*} Item A\n{*} Item B',
        canUploadFile: true,
      };

      const result = resolveSharedContent(item);
      const { container } = renderContent(result.longDescriptionContent);
      const list = container.querySelector('ul');
      expect(list).to.exist;
      const listItems = list.querySelectorAll('li');
      expect(listItems.length).to.equal(2);
    });

    it('should render combined formatting (bold text within list items)', () => {
      const item = {
        id: 104,
        displayName: 'Test Request',
        status: 'NEEDED_FROM_YOU',
        requestedDate: '2025-12-01',
        description:
          '{b}Important:{/b} Please provide:\n[*] {b}Document A{/b}\n[*] Document B',
        canUploadFile: true,
      };

      const result = resolveSharedContent(item);
      const { container } = renderContent(result.longDescriptionContent);

      // Check for bold text in paragraph
      const paragraph = container.querySelector('p');
      expect(paragraph).to.exist;
      const strongInParagraph = paragraph.querySelector('strong');
      expect(strongInParagraph).to.exist;
      expect(strongInParagraph.textContent).to.equal('Important:');

      // Check for list with bold item
      const list = container.querySelector('ul');
      expect(list).to.exist;
      const listItems = list.querySelectorAll('li');
      expect(listItems.length).to.equal(2);
      const strongInListItem = listItems[0].querySelector('strong');
      expect(strongInListItem).to.exist;
      expect(strongInListItem.textContent).to.equal('Document A');
    });
  });

  // API STRUCTURED CONTENT FALLBACK PATTERN TESTS
  describe('API structured content fallback pattern', () => {
    const mockApiLongDescription = {
      blocks: [
        {
          type: 'paragraph',
          content:
            'This is API-provided structured content for longDescription.',
        },
        {
          type: 'list',
          style: 'bullet',
          items: ['API item 1', 'API item 2', 'API item 3'],
        },
      ],
    };

    const mockApiNextSteps = {
      blocks: [
        {
          type: 'paragraph',
          content: 'These are API-provided structured next steps.',
        },
      ],
    };

    context('longDescription fallback priority', () => {
      it('Priority 1: API-provided structured content (JSON blocks → TrackedItemContent)', () => {
        const item = {
          id: 200,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          canUploadFile: true,
          longDescription: mockApiLongDescription,
          description: 'Old simple description',
        };

        const result = resolveSharedContent(item);

        // Should render API structured content
        expect(result.longDescriptionTestId).to.equal('api-long-description');
        expect(result.longDescriptionContent).to.not.be.null;
      });
    });

    context('nextSteps fallback priority', () => {
      it('Priority 1: API structured next steps', () => {
        const item = {
          id: 205,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          canUploadFile: true,
          nextSteps: mockApiNextSteps,
        };

        const result = resolveSharedContent(item);

        // Should render API structured next steps
        expect(result.nextStepsContent).to.not.be.null;
        const { getByTestId, getByText } = renderContent(
          result.nextStepsContent,
        );
        expect(getByTestId('api-next-steps')).to.exist;
        getByText('These are API-provided structured next steps.');
      });
    });

    context('combined API structured content scenarios', () => {
      it('Renders both API longDescription and nextSteps when both are provided', () => {
        const item = {
          id: 213,
          displayName: 'Unknown Item Type',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          canUploadFile: true,
          longDescription: mockApiLongDescription,
          nextSteps: mockApiNextSteps,
        };

        const result = resolveSharedContent(item);

        // Should render both API structured contents
        expect(result.longDescriptionTestId).to.equal('api-long-description');
        const { getByTestId } = renderContent(result.nextStepsContent);
        expect(getByTestId('api-next-steps')).to.exist;
      });

      it('Renders API longDescription with frontend nextSteps (mixed API and dictionary)', () => {
        const item = {
          id: 214,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          canUploadFile: true,
          longDescription: mockApiLongDescription,
          // nextSteps will come from dictionary
        };

        const result = resolveSharedContent(item);

        // Should render API structured longDescription
        expect(result.longDescriptionTestId).to.equal('api-long-description');
        // Should render frontend dictionary nextSteps
        const { getByTestId } = renderContent(result.nextStepsContent);
        expect(getByTestId('frontend-next-steps')).to.exist;
      });

      it('Renders frontend description with API nextSteps', () => {
        const item = {
          id: 215,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          canUploadFile: true,
          // longDescription will come from dictionary
          nextSteps: mockApiNextSteps,
        };

        const result = resolveSharedContent(item);

        // Should render frontend dictionary longDescription
        expect(result.longDescriptionTestId).to.equal('frontend-description');
        // Should render API structured nextSteps
        const { getByTestId } = renderContent(result.nextStepsContent);
        expect(getByTestId('api-next-steps')).to.exist;
      });
    });

    context('backward compatibility', () => {
      it('Maintains existing behavior when API fields are undefined', () => {
        const item = {
          id: 216,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          canUploadFile: true,
          // longDescription and nextSteps not included (undefined)
        };

        const result = resolveSharedContent(item);

        // Should fallback to dictionary (existing behavior)
        expect(result.longDescriptionTestId).to.equal('frontend-description');
        expect(result.longDescriptionContent).to.not.be.null;
        const { getByTestId } = renderContent(result.nextStepsContent);
        expect(getByTestId('frontend-next-steps')).to.exist;
      });
    });
  });
});
