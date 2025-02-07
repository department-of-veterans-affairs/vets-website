import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import CustomPreSubmitInfo from '../../components/PreSubmitInfo';

describe('<CustomPreSubmitInfo /> component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<CustomPreSubmitInfo />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the note text with the correct warning message', () => {
    expect(wrapper.text()).to.include(
      'According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or for providing incorrect information (See 18 U.S.C. 1001).',
    );
  });

  it('renders a link with the correct href and target attributes', () => {
    const link = wrapper.find('a');
    expect(link.prop('href')).to.equal('https://www.va.gov/privacy-policy/');
    expect(link.prop('target')).to.equal('_blank');
    expect(link.prop('rel')).to.include('noreferrer');
  });

  it('has the correct aria-label for the link', () => {
    const link = wrapper.find('a');
    expect(link.prop('aria-label')).to.equal(
      'Privacy policy, will open in new tab',
    );
  });

  it('renders the "Note:" label in bold', () => {
    const strongTag = wrapper.find('strong');
    expect(strongTag).to.have.lengthOf(1);
    expect(strongTag.text()).to.equal('Note:');
  });
});
