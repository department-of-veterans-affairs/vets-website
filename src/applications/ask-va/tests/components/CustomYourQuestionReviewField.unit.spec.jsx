import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PageFieldSummary from '../../components/PageFieldSummary';

const mockStore = configureStore([]);

describe('PageFieldSummary Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      askVA: {
        updatedInReview: 'yourQuestion',
      },
    });
  });

  it('should render null if renderedProperties is not provided', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PageFieldSummary renderedProperties={null} />
      </Provider>,
    );

    expect(wrapper.isEmptyRender()).to.be.true;

    wrapper.unmount();
  });
});
