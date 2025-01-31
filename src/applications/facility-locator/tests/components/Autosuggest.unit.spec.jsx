import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Autosuggest from '../../components/Autosuggest';

describe('<Autosuggest inputId="any">', () => {
  it('Autosuggest should render.', () => {
    const wrapper = shallow(<Autosuggest inputId="any" />);
    expect(wrapper.type()).to.not.equal(null);
    const outerDiv = wrapper.find('div').first();
    expect(outerDiv.prop('id')).to.equal('any-autosuggest-container');
    expect(outerDiv.hasClass('autosuggest-container')).to.equal(true);
    expect(outerDiv.hasClass('vads-u-width--full')).to.equal(true);
    expect(outerDiv.hasClass('usa-input-error')).to.equal(false); // without error, should not have it
    wrapper.unmount();
  });

  it('Autosuggest should render with error.', () => {
    const wrapper = shallow(<Autosuggest inputId="any" showError />);
    const outerDiv = wrapper.find('div').first();
    expect(outerDiv.hasClass('usa-input-error')).to.equal(true); // with error, should have it
    wrapper.unmount();
  });

  it('Autosuggest should render with label.', () => {
    const wrapper = shallow(<Autosuggest inputId="any" label="any label" />);
    const label = wrapper.find('label').first();
    expect(label.text()).to.equal('any label');
    expect(label.props('htmlFor')).to.equal('any');
    expect(label.hasClass('any-label')).to.equal(true);
    wrapper.unmount();
  });

  it('Autosuggest should render with label that is component.', () => {
    const componentLabel = (
      <>
        <div>any label</div>
        <div>still the label</div>
      </>
    );
    const wrapper = shallow(
      <Autosuggest inputId="any" label={componentLabel} />,
    );
    const label = wrapper.find('label').first();
    expect(label.text()).to.equal('any labelstill the label');
    wrapper.unmount();
  });

  it('Autosuggest should render with label sibling.', () => {
    const wrapper = shallow(
      <Autosuggest inputId="any" labelSibling={<div>any sibling</div>} />,
    );
    const sibling = wrapper.find('div').at(1);
    expect(sibling.text()).to.equal('any sibling');
    wrapper.unmount();
  });
});
