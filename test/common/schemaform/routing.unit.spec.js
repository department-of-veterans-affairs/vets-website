import { expect } from 'chai';

describe('Schemaform routing', () => {
  describe('getNextPage', () => {
    xit('should match current page correctly when an array page', () => {
      const route = {
        pageConfig: {
          pageKey: 'testPage',
          showPagePerItem: true,
          arrayPath: 'arrayProp',
          errorMessages: {},
          title: '',
          path: '/testing/:index'
        },
        pageList: [
          {
            pageKey: 'blah',
            path: 'a-path'
          },
          {
            pageKey: 'testPage',
            path: '/testing/:index',
            showPagePerItem: true,
            arrayPath: 'arrayProp'
          }
        ]
      };
      const form = {
        pages: {
          testPage: {
            schema: {
              properties: {
                arrayProp: {
                  items: [{}]
                }
              }
            },
            uiSchema: {
              arrayProp: {
                items: {}
              }
            }
          }
        },
        data: {
          arrayProp: [{}]
        }
      };
      const user = {
        profile: {
          savedForms: []
        },
        login: {
          currentlyLoggedIn: false
        }
      };

      const page = getNextPage(pageList, data, pathname, pageConfig);
      expect(page).to.equal(1);
    });
  });
});
