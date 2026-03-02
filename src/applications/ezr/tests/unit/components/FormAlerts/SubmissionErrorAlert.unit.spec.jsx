import React from 'react';
import { waitFor, render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';

import SubmissionErrorAlert from '../../../../components/FormAlerts/SubmissionErrorAlert';
import content from '../../../../locales/en/content.json';

describe('ezr <SubmissionErrorAlert>', () => {
  const subject = (featureToggle = {}) => {
    const mockStore = {
      getState: () => ({
        form: {
          data: {
            /*
            We need to have all of the necessary data to supply to the submitTransformer
            as well as the data that is used to render the component
            */
            veteranDateOfBirth: '1990-01-01',
            gender: 'M',
            ...featureToggle,
          },
        },
        user: {
          profile: {
            userFullName: { first: 'John', last: 'Smith' },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <SubmissionErrorAlert />
      </Provider>,
    );
    const selectors = () => ({
      errorMessage: container.querySelector('.ezr-error-message'),
      vaAlert: container.querySelector('va-alert'),
      headerTitle: container.querySelector('h3'),
      downloadLink: container.querySelector('.ezr-application--download'),
    });
    return { selectors };
  };

  describe('when the component renders', () => {
    it('should render wrapper div that receives focus', async () => {
      const { selectors } = subject();
      const { errorMessage } = selectors();
      expect(errorMessage).to.exist;
      await waitFor(() => {
        expect(errorMessage).to.have.attr('tabindex', '-1');
      });
    });

    it('should render `va-alert` with status of `error`', () => {
      const { selectors } = subject();
      const { vaAlert } = selectors();
      expect(vaAlert).to.exist;
      expect(vaAlert).to.have.attr('status', 'error');
    });

    it('should render proper heading level & content', () => {
      const { selectors } = subject();
      const { headerTitle } = selectors();
      expect(headerTitle).to.exist;
      expect(headerTitle).to.contain.text(content['alert-submission-title']);
    });
  });
});
