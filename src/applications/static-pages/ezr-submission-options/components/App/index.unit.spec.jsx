import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { App, MERGED_URL, STANDALONE_URL } from '.';

describe('ezr submission options', () => {
  const subject = ({ enabled = false } = {}) => {
    const mockStore = {
      getState: () => ({
        featureToggles: { form1010dExtended: enabled },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    return render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
  };

  it('should render correct application link when the feature toggle is `false`', () => {
    const { container } = subject();
    const vaActionLink = container.querySelector('va-link-action');
    expect(vaActionLink).to.have.attr('href', STANDALONE_URL);
  });

  it('should render correct application link when the feature toggle is `true`', () => {
    const { container } = subject({ enabled: true });
    const vaActionLink = container.querySelector('va-link-action');
    expect(vaActionLink).to.have.attr('href', MERGED_URL);
  });
});
