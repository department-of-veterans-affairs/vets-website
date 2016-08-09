import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { ContactInformationSection } from '../../../../src/client/components/veteran-information/ContactInformationSection';
import { makeField } from '../../../../src/common/fields';

describe('<ContactInformationSection>', () => {
  const mockEmail = makeField('mock@aol.com', true);

  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<ContactInformationSection data={{ email: makeField(''), emailConfirmation: makeField('') }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom.props.children).to.exist;
  });

  describe('Email confirmation', () => {
    it('does not include `error` prop when matches Email', () => {
      const tree = SkinDeep.shallowRender(
        <ContactInformationSection data={{ email: mockEmail, emailConfirmation: mockEmail }}/>);
      const emailInputs = tree.everySubTree('Email');
      expect(emailInputs).to.have.lengthOf(2);
      expect(emailInputs[1].props.error).to.be.undefined;
    });

    it('does include `error` prop when does not match Email', () => {
      const tree = SkinDeep.shallowRender(
        <ContactInformationSection data={{ email: makeField(''), emailConfirmation: mockEmail }}/>);
      const emailInputs = tree.everySubTree('Email');
      expect(emailInputs).to.have.lengthOf(2);
      expect(emailInputs[1].props.error).to.not.be.undefined;
    });
  });
});
