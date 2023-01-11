import { expect } from 'chai';
import React from 'react';
import App from '../../../containers/App';
// import { mount } from 'enzyme';

describe('Education Letters landing page', () => {
  const initialState = {
    user: {},
    toggleLoginModal: () => {},
  };

  it('redirect logged in users', () => {
    // console.log(<App {...initialState} />['type']);
    expect(<App {...initialState} />);
    // expect(wrapper.text()).to.include('Download your VA education letter');
    // expect(
    //   wrapper.containsMatchingElement(
    //     <Layout
    //       clsName="introduction-page"
    //       breadCrumbs={{
    //         href: '/education/download-letters',
    //         text: 'Download your VA education letter',
    //       }}
    //     />,
    //   ),
    // ).to.be.true;
    // expect(wrapper.text()).to.contain('Child Component One');
    // wrapper.unmount();
  });
});
