import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Footer from '../../components/Footer';

// Create a mock Redux store
const mockStore = configureMockStore();
const initialState = {
  askVA: {
    categoryID: '',
    topicID: '',
  },
};

describe('Footer Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders NeedHelpFooter when categoryID and topicID do not match the conditions', () => {
    // Set up the state for this test
    const state = {
      askVA: {
        categoryID: '75524deb-d864-eb11-bb24-000d3a575555', // NOT EDUCATION_BENEFITS or BENEFITS_ISSUES
        topicID: 'bf2a8586-e764-eb11-bb23-000d3a579c3f', // EDUCATION_BENEFITS
      },
    };
    store = mockStore(state);

    const screen = render(
      <Provider store={store}>
        <Footer
          currentLocation={{ pathname: '/some-other-path' }}
          categoryID={state.askVA.categoryID}
          topicID={state.askVA.topicID}
        />
      </Provider>,
    );

    const footerEducation = screen.getByText(
      /We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET./,
    );
    expect(footerEducation).to.exist;
  });

  it('renders NeedHelpFooterEducation when categoryID and topicID match the conditions', () => {
    // Set up the state for this test
    const state = {
      askVA: {
        categoryID: '66524deb-d864-eb11-bb24-000d3a579c45', // BENEFITS_ISSUES
        topicID: 'bf2a8586-e764-eb11-bb23-000d3a579c3f', // EDUCATION_BENEFITS
      },
    };
    store = mockStore(state);

    const screen = render(
      <Provider store={store}>
        <Footer
          currentLocation={{ pathname: '/some-other-path' }}
          categoryID={state.askVA.categoryID}
          topicID={state.askVA.topicID}
        />
      </Provider>,
    );

    const footer = screen.getByText(/For students outside the U.S., call us/);
    expect(footer).to.exist;
  });

  it('does not render NeedHelpFooterEducation when categoryID and topicID match the conditions but pathname does not', () => {
    // Set up the state for this test
    const state = {
      askVA: {
        categoryID: '66524deb-d864-eb11-bb24-000d3a579c45', // BENEFITS_ISSUES
        topicID: 'bf2a8586-e764-eb11-bb23-000d3a579c3f', // EDUCATION_BENEFITS
      },
    };
    store = mockStore(state);

    const screen = render(
      <Provider store={store}>
        <Footer
          currentLocation={{ pathname: '/category-topic-1' }}
          categoryID={state.askVA.categoryID}
          topicID={state.askVA.topicID}
        />
      </Provider>,
    );

    const footer = screen.getByText(
      /We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET/,
    );
    expect(footer).to.exist;
  });
});
