import { expect } from 'chai';
import { reformatDrupalFooterData } from '../helpers';

describe('footer utilities', () => {
  const links = {
    bottomRailFooterData: {
      description: 'bottom rail footer data',
      links: [
        {
          description: 'Accessibility',
          url: {
            path: 'https://www.va.gov/accessibility-at-va',
          },
        },
        {
          description: 'Civil Rights',
          url: {
            path:
              'https://www.va.gov/resources/your-civil-rights-and-how-to-file-a-discrimination-complaint',
          },
        },
      ],
    },
    footerColumnsData: {
      description: 'footer columns data',
      links: [
        {
          description: 'Column 1',
          links: [
            {
              description: 'Women Veterans',
              url: {
                path: 'https://www.va.gov/womenvet',
              },
            },
          ],
        },
        {
          description: 'Column 2',
          links: [
            {
              description: 'VA forms',
              url: {
                path: '/find-forms',
              },
            },
          ],
        },
        {
          description: 'Column 3',
          links: [
            {
              description: 'VA news',
              url: {
                path: 'https://www.news.va.org',
              },
            },
          ],
        },
      ],
    },
    hardCodedFooterData: [
      {
        column: 4,
        href: 'https://www.va.gov/resources',
        order: 1,
        title: 'Resources and support',
      },
    ],
  };

  describe('reformatDrupalFooterData', () => {
    it('should properly return an array of formatted links for the footer', () => {
      expect(reformatDrupalFooterData(links)).to.deep.equal([
        {
          column: 'bottom_rail',
          href: 'https://www.va.gov/accessibility-at-va',
          order: 1,
          target: null,
          title: 'Accessibility',
        },
        {
          column: 'bottom_rail',
          href:
            'https://www.va.gov/resources/your-civil-rights-and-how-to-file-a-discrimination-complaint',
          order: 2,
          target: null,
          title: 'Civil Rights',
        },
        {
          column: 1,
          href: 'https://www.va.gov/womenvet',
          order: 1,
          target: null,
          title: 'Women Veterans',
        },
        {
          column: 2,
          href: '/find-forms',
          order: 1,
          target: null,
          title: 'VA forms',
        },
        {
          column: 3,
          href: 'https://www.news.va.org',
          order: 1,
          target: null,
          title: 'VA news',
        },
        {
          column: 4,
          href: 'https://www.va.gov/resources',
          order: 1,
          title: 'Resources and support',
        },
      ]);
    });
  });
});
