import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { resolveSharedContent } from '../../../../components/claim-document-request-pages/shared/descriptionContent';

// Helper to render JSX content returned by resolveSharedContent
const renderContent = content => render(<div>{content}</div>);

describe('resolveSharedContent', () => {
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

  // Two-tier content: longDescription/nextSteps blocks or item.description only
  describe('Structured content (longDescription / nextSteps blocks)', () => {
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

    context('longDescription', () => {
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

        expect(result.longDescriptionTestId).to.equal('api-long-description');
        expect(result.longDescriptionContent).to.not.be.null;
      });
    });

    context('nextSteps', () => {
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

        expect(result.nextStepsContent).to.not.be.null;
        const { getByTestId, getByText } = renderContent(
          result.nextStepsContent,
        );
        expect(getByTestId('api-next-steps')).to.exist;
        getByText('These are API-provided structured next steps.');
      });
    });

    context('combined scenarios', () => {
      it('should render both longDescription and nextSteps when both provided', () => {
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

        expect(result.longDescriptionTestId).to.equal('api-long-description');
        const { getByTestId } = renderContent(result.nextStepsContent);
        expect(getByTestId('api-next-steps')).to.exist;
      });

      it('should render longDescription when nextSteps not provided', () => {
        const item = {
          id: 214,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          canUploadFile: true,
          longDescription: mockApiLongDescription,
        };

        const result = resolveSharedContent(item);

        expect(result.longDescriptionTestId).to.equal('api-long-description');
        expect(result.nextStepsContent).to.be.null;
      });

      it('should render only nextSteps when no description content', () => {
        const item = {
          id: 215,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          canUploadFile: true,
          nextSteps: mockApiNextSteps,
        };

        const result = resolveSharedContent(item);

        expect(result.longDescriptionTestId).to.be.null;
        expect(result.longDescriptionContent).to.be.null;
        const { getByTestId } = renderContent(result.nextStepsContent);
        expect(getByTestId('api-next-steps')).to.exist;
      });
    });

    context('when no blocks or description provided', () => {
      it('returns null description and nextSteps', () => {
        const item = {
          id: 216,
          displayName: '21-4142/21-4142a',
          status: 'NEEDED_FROM_YOU',
          requestedDate: '2025-12-01',
          canUploadFile: true,
        };

        const result = resolveSharedContent(item);

        expect(result.longDescriptionTestId).to.be.null;
        expect(result.longDescriptionContent).to.be.null;
        expect(result.nextStepsContent).to.be.null;
      });
    });
  });
});
