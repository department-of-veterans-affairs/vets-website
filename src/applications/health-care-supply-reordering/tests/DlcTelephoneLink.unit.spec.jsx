import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import DlcTelephoneLink from '../components/DlcTelephoneLink';
import { DLC_PHONE } from '../constants';

describe('DlcTelephoneLink', () => {
  it('should render the component correctly', () => {
    const telephoneLink = mount(<DlcTelephoneLink />);
    const telephoneElements = telephoneLink.find('va-telephone');

    const telephoneAttributes = telephoneElements.map(node => {
      const props = node.props();
      return [props.contact, props.tty];
    });

    expect(telephoneAttributes).to.deep.equal([
      [DLC_PHONE, undefined],
      [CONTACTS[711], true],
    ]);

    telephoneLink.unmount();
  });
});
