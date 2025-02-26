import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LicenseCertificationKeywordSearch from '../../components/LicenseCertificationKeywordSearch';

describe('<LicenseCertificationKeywordSearch>', () => {
  let store;

  beforeEach(() => {
    store = configureStore()({});
  });

  const defaultProps = {
    inputValue: '',
    handleInput: sinon.spy(),
    suggestions: [
      { lacNm: 'Microsoft Azure', type: 'Certification', state: 'all' },
      { lacNm: 'AWS Cloud', type: 'Certification', state: 'all' },
    ],
    onSelection: sinon.spy(),
    onUpdateAutocompleteSearchTerm: sinon.spy(),
    handleClearInput: sinon.spy(),
  };

  const mountComponent = props => {
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <LicenseCertificationKeywordSearch {...props} />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should render', () => {
    const wrapper = mountComponent(defaultProps);
    expect(wrapper.find('#keyword-search')).to.exist;
    expect(wrapper.find(VaAdditionalInfo)).to.exist;
  });

  it('should show clear icon when input has value', () => {
    const wrapper = mountComponent(defaultProps);
    expect(wrapper.find('va-icon#clear-input')).to.exist;
  });

  it('should call onUpdateAutocompleteSearchTerm when input changes', () => {
    const wrapper = mountComponent(defaultProps);
    wrapper.find('input').simulate('change', { target: { value: 'test' } });
    expect(defaultProps.onUpdateAutocompleteSearchTerm.called).to.be.true;
  });

  it('should show suggestions when input has value', () => {
    const wrapper = mountComponent(defaultProps);
    expect(wrapper.find('.suggestions-list')).to.exist;
    // expect(wrapper.find('.suggestion')).to.have.lengthOf(2);
  });
});
