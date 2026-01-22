import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { cleanup } from '@testing-library/react';
import FilterAccordion from '../../components/FilterAccordion';

describe('<FilterAccordion>', () => {
  let store;

  beforeEach(() => {
    store = configureMockStore()({});
  });

  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    buttonLabel: 'Filter Results',
    button: 'Update Results',
    buttonOnClick: sinon.spy(),
    onClick: sinon.spy(),
    resetSearch: sinon.spy(),
    updateResults: sinon.spy(),
    open: false,
    children: <div className="test-content">Filter content</div>,
  };

  const mountComponent = props => {
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <FilterAccordion {...props} />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should show update and clear buttons when expanded', () => {
    const wrapper = mountComponent({ ...defaultProps, open: true });
    expect(wrapper.find('VaButton[text="Update Results"]')).to.have.lengthOf(1);
    expect(wrapper.find('VaButton[text="Reset search"]')).to.have.lengthOf(1);
  });

  it('should call updateResults when update button is clicked', () => {
    const updateResultsSpy = sinon.spy();
    const wrapper = mountComponent({
      ...defaultProps,
      open: true,
      updateResults: updateResultsSpy,
    });
    wrapper
      .find('VaButton[text="Update Results"]')
      .getDOMNode()
      .click();
    expect(updateResultsSpy.called).to.be.true;
  });

  it('should call resetSearch when clear button is clicked', () => {
    const resetSearchSpy = sinon.spy();
    const wrapper = mountComponent({
      ...defaultProps,
      open: true,
      resetSearch: resetSearchSpy,
    });
    wrapper
      .find('VaButton[text="Reset search"]')
      .getDOMNode()
      .click();
    expect(resetSearchSpy.called).to.be.true;
  });

  it('should set initial expanded state correctly', () => {
    const wrapper = mountComponent({ ...defaultProps, open: true });
    expect(wrapper.find('VaAccordionItem').props().open).to.be.true;

    const collapsedWrapper = mountComponent({
      ...defaultProps,
      open: false,
    });
    expect(collapsedWrapper.find('VaAccordionItem').props().open).to.be.true;
  });
});
