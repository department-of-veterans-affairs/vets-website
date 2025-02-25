import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import LicenseCertificationFilterAccordion from '../../components/LicenseCertificationFilterAccordion';

describe('<LicenseCertificationFilterAccordion>', () => {
  let store;

  beforeEach(() => {
    store = configureMockStore()({});
  });

  const defaultProps = {
    buttonLabel: 'Filter Results',
    button: 'Update Results',
    buttonOnClick: sinon.spy(),
    onClick: sinon.spy(),
    resetSearch: sinon.spy(),
    expanded: false,
    children: <div className="test-content">Filter content</div>,
  };

  const mountComponent = props => {
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <LicenseCertificationFilterAccordion {...props} />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should show update and clear buttons when expanded', () => {
    const wrapper = mountComponent({ ...defaultProps, expanded: true });
    expect(wrapper.find('.update-results-button-after')).to.have.lengthOf(1);
    expect(wrapper.find('.clear-filters-button-after')).to.have.lengthOf(1);
  });

  it('should call buttonOnClick when update button is clicked', () => {
    const wrapper = mountComponent({ ...defaultProps, expanded: true });
    wrapper.find('.update-results-button-after').simulate('click');
    expect(defaultProps.buttonOnClick.called).to.be.true;
  });

  it('should call resetSearch when clear button is clicked', () => {
    const wrapper = mountComponent({ ...defaultProps, expanded: true });
    wrapper.find('.clear-filters-button-after').simulate('click');
    expect(defaultProps.resetSearch.called).to.be.true;
  });
});
