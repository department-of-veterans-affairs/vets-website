import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import FormFooter from '../../components/FormFooter';

describe('FormFooter', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <FormFooter formConfig={{}} currentLocation={{ pathname: '/introduction' }}/>
    );

    expect(tree.dive(['AskVAQuestions']).text()).to.contain('Need help?');
  });

  it('should not render if on the confirmation page', () => {
    const tree = SkinDeep.shallowRender(
      <FormFooter formConfig={{}} currentLocation={{ pathname: '/confirmation' }}/>
    );

    expect(tree.text()).to.be.empty;
  });

  it('should render <GetFormHelp> if passed to config', () => {
    const GetFormHelp = function GetFormHelp() { return( <div>Help!</div> ) };
    const tree = SkinDeep.shallowRender(
      <FormFooter formConfig={{ getHelp: GetFormHelp }} currentLocation={{ pathname: '/introduction' }}/>
    );

    expect(tree.dive(['AskVAQuestions', 'GetFormHelp']).text()).to.contain('Help!');
  });
});
