import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { cleanup } from '@testing-library/react';
import LicenseCertificationFilterAccordion from '../../components/LicenseCertificationFilterAccordion';

describe('<LicenseCertificationFilterAccordion>', () => {
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
    expect(wrapper.find('VaButton[text="Update Results"]')).to.have.lengthOf(1);
    expect(wrapper.find('ClearFiltersBtn')).to.have.lengthOf(1);
  });

  it('should call buttonOnClick when update button is clicked', () => {
    const wrapper = mountComponent({ ...defaultProps, expanded: true });
    wrapper.find('VaButton[text="Update Results"]').simulate('click');
    expect(defaultProps.buttonOnClick.called).to.be.true;
  });

  it('should call resetSearch when clear button is clicked', () => {
    const wrapper = mountComponent({ ...defaultProps, expanded: true });
    wrapper.find('ClearFiltersBtn').simulate('click');
    expect(defaultProps.resetSearch.called).to.be.true;
  });

  it('should toggle expanded state on button click', () => {
    const wrapper = mountComponent({ ...defaultProps, expanded: false });

    const button = wrapper.find('va-accordion-item');
    button.simulate('click');

    expect(defaultProps.onClick.calledOnce).to.be.true;
    expect(defaultProps.onClick.calledWith(true)).to.be.true;

    button.simulate('click');

    expect(defaultProps.onClick.calledTwice).to.be.true;
    expect(defaultProps.onClick.calledWith(false)).to.be.true;
  });

  it('should set initial expanded state correctly', () => {
    const wrapper = mountComponent({ ...defaultProps, expanded: true });
    let openState = wrapper.find('va-accordion-item').prop('open');
    expect(openState).to.be.true;

    const collapsedWrapper = mountComponent({
      ...defaultProps,
      expanded: false,
    });
    openState = collapsedWrapper.find('va-accordion-item').prop('open');
    expect(openState).to.be.false;
  });

  it('should correctly update isExpanded state when toggled', () => {
    const wrapper = mountComponent({ ...defaultProps, expanded: false });

    expect(wrapper.find('va-accordion-item').props().open).to.be.false;

    wrapper.find('va-accordion-item').simulate('click');
    expect(wrapper.find('va-accordion-item').props().open).to.be.true;

    wrapper.find('va-accordion-item').simulate('click');
    expect(wrapper.find('va-accordion-item').props().open).to.be.false;
  });
  it('should not throw an error if onClick is undefined', () => {
    const wrapper = mountComponent({ ...defaultProps, onClick: undefined });

    expect(() => {
      wrapper.find('va-accordion-item').simulate('click');
    }).to.not.throw();
  });
});
