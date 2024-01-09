import React from 'react';

import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import PageFieldSummary from '../../../components/PageFieldSummary';

describe('<PageFieldSummary>', () => {
  describe('when the component renders', () => {
    it.skip('should render chapter title and questions', async () => {
      const mockStore = {
        getState: () => ({
          form: {
            data: {},
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              userFullName: {
                first: 'Peter',
                middle: 'B',
                last: 'Parker',
              },
            },
          },
          askVA: {
            categoryID: '2',
            updatedInReview: '',
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };
      const props = {
        params: { id: '123' },
        title: 'Tell us your question',
        defaultEditButton: () => {},
        updatedPage: '',
        renderedProperties: [
          {
            props: {
              name: 'question',
              formData: 'Fake answer',
              uiSchema: {
                'ui:title': 'What is your question?',
              },
            },
          },
          {
            props: {
              name: 'reason',
              formData: 'Fake reason',
              uiSchema: {
                'ui:title': "Tell us the reason you're contacting us?",
              },
            },
          },
        ],
      };

      const view = render(
        <Provider store={mockStore}>
          <PageFieldSummary {...props} />
        </Provider>,
      );

      expect(view.container.querySelector('h4')).to.contain.text(
        'Tell us your question',
      );

      expect(view.container.querySelectorAll('dt').length).to.eq(2);
      expect(view.container.querySelectorAll('dt')[0]).to.contain.text(
        'What is your question?',
      );
      expect(view.container.querySelectorAll('dt')[1]).to.contain.text(
        "Tell us the reason you're contacting us?",
      );
    });
  });
});
