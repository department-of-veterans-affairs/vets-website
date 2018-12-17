import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FormFooter from '../../components/FormFooter';

describe('FormFooter', () => {
  it('should render', () => {
    const wrapper = shallow(
      <FormFooter
        formConfig={{}}
        currentLocation={{ pathname: '/introduction' }}
      />,
    );

    expect(wrapper.text()).to.be.empty;
    wrapper.unmount();
  });

  it('should not render if on the confirmation page', () => {
    const GetFormHelp = function GetFormHelp() {
      return <div>Help!</div>;
    };
    const wrapper = shallow(
      <FormFooter
        formConfig={{ getHelp: GetFormHelp }}
        currentLocation={{ pathname: '/confirmation' }}
      />,
    );

    expect(wrapper.text()).to.be.empty;
    wrapper.unmount();
  });

  it('should render <GetFormHelp> if passed to config', () => {
    const GetFormHelp = function GetFormHelp() {
      return <div>Help!</div>;
    };
    const wrapper = shallow(
      <FormFooter
        formConfig={{ getHelp: GetFormHelp }}
        currentLocation={{ pathname: '/introduction' }}
      />,
    );

    expect(
      wrapper
        .find('GetFormHelp')
        .render()
        .text(),
    ).to.contain('Help!');
    wrapper.unmount();
  });
});
