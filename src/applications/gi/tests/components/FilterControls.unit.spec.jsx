import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import FilterControls from '../../components/FilterControls';

const mockStore = configureStore([thunk]);

describe('<FilterControls>', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  const defaultProps = {
    categoryCheckboxes: [
      { label: 'License', name: 'license', checked: false },
      { label: 'Certification', name: 'certification', checked: true },
    ],
    handleCheckboxGroupChange: sinon.spy(),
    dropdown: {
      label: 'State',
      options: [
        { value: 'all', label: 'All states' },
        { value: 'CA', label: 'California' },
      ],
    },
    handleDropdownChange: sinon.spy(),
    filterLocation: 'all',
  };

  const mountComponent = props => {
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <FilterControls {...props} />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should render', () => {
    const wrapper = mountComponent(defaultProps);
    expect(wrapper.find(VaCheckboxGroup)).to.exist;
    expect(wrapper.find('va-checkbox')).to.have.lengthOf(2);
    expect(wrapper.find('Dropdown')).to.exist;
  });

  it('should call handleCheckboxGroupChange when checkbox group changes', () => {
    const wrapper = mountComponent(defaultProps);
    const checkboxGroup = wrapper.find(VaCheckboxGroup);
    checkboxGroup.props().onVaChange({ detail: { value: ['license'] } });
    expect(defaultProps.handleCheckboxGroupChange.called).to.be.true;
  });

  it('should call handleDropdownChange when dropdown changes', () => {
    const wrapper = mountComponent(defaultProps);
    const dropdown = wrapper.find('Dropdown');
    dropdown.props().onChange({ target: { value: 'CA' } });
    expect(defaultProps.handleDropdownChange.called).to.be.true;
  });
});
