import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import WhoIsYourQuestionAboutCustomPage from '../../containers/WhoIsYourQuestionAboutCustomPage';

const mockStore = configureStore([]);

describe('WhoIsYourQuestionAboutCustomPage', () => {
  let store;
  let defaultProps;

  beforeEach(() => {
    store = mockStore({
      form: {
        data: {
          whoIsYourQuestionAbout: '',
          selectCategory: '',
          selectTopic: '',
          selectSubtopic: '',
        },
      },
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
    });

    defaultProps = {
      goBack: () => {},
      goToPath: () => {},
      onChange: () => {},
    };
  });

  it('should render the component and radio options', () => {
    const { container } = render(
      <Provider store={store}>
        <WhoIsYourQuestionAboutCustomPage {...defaultProps} />
      </Provider>,
    );
    const options = container.querySelectorAll('va-radio-option');

    expect(options[0].getAttribute('label')).to.eq('Myself');
    expect(options[1].getAttribute('label')).to.eq('Someone else');
    expect(options[2].getAttribute('label')).to.eq("It's a general question");
  });
});
