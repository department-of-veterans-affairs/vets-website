import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import RecipientsSelect from '../../../components/ComposeForm/RecipientsSelect';
import * as Constants from '../../../util/constants';

describe('RecipientsSelect', () => {
  const recipientsList = [
    { id: 1, name: 'Recipient 1', signatureRequired: true },
    { id: 2, name: 'Recipient 2', signatureRequired: false },
  ];

  it('renders without errors', () => {
    const wrapper = mount(
      <RecipientsSelect
        recipientsList={recipientsList}
        onValueChange={() => {}}
      />,
    );
    expect(wrapper).to.exist;
    wrapper.unmount();
  });

  it('displays the correct number of options', () => {
    const wrapper = mount(
      <RecipientsSelect
        recipientsList={recipientsList}
        onValueChange={() => {}}
      />,
    );
    const options = wrapper.find('option');
    expect(options).to.have.lengthOf(recipientsList.length);
    wrapper.unmount();
  });

  it('calls the onValueChange callback when a recipient is selected', () => {
    const onValueChange = sinon.spy();
    const wrapper = mount(
      <RecipientsSelect
        recipientsList={recipientsList}
        onValueChange={onValueChange}
      />,
    );
    const select = wrapper.find('VaSelect');
    select.prop('onVaSelect')({ detail: { value: '1' } });
    expect(onValueChange.calledOnce).to.be.true;
    expect(onValueChange.calledWith(recipientsList[0])).to.be.true;
    wrapper.unmount();
  });

  it('displays the signature alert when a recipient with signatureRequired is selected', () => {
    const wrapper = mount(
      <RecipientsSelect
        recipientsList={recipientsList}
        onValueChange={() => {}}
        isSignatureRequired
      />,
    );
    const alert = wrapper.find('va-alert[data-testid="signature-alert"]');

    expect(alert.text()).to.contain(
      Constants.Prompts.Compose.SIGNATURE_REQUIRED,
    );
    wrapper.find('VaAlert').prop('onCloseEvent')();
    expect(alert).to.be.empty;
    wrapper.unmount();
  });

  it('does not display the signature alert when a recipient without signatureRequired is selected', () => {
    const wrapper = mount(
      <RecipientsSelect
        recipientsList={recipientsList}
        onValueChange={() => {}}
      />,
    );
    const select = wrapper.find('VaSelect');
    select.prop('onVaSelect')({ detail: { value: '2' } });
    const alert = wrapper.find('[data-testid="signature-alert"]');
    expect(alert).to.be.empty;
    wrapper.unmount();
  });
});
