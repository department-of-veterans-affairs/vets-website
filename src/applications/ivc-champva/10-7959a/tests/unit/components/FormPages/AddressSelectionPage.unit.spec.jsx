import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon-v20';
import AddressSelectionPage, {
  FIELD_NAME,
  NOT_SHARED,
} from '../../../../components/FormPages/AddressSelectionPage';

const DATA_KEY = 'testKey';

const addr = (overrides = {}) => ({
  street: '123 Main St',
  city: 'Citytown',
  state: 'IN',
  country: 'USA',
  ...overrides,
});

const baseData = {
  certifierRole: 'sponsor',
  certifierAddress: addr({ street: '111 Certifier Rd', state: 'IN' }),
  sponsorAddress: addr({ street: '222 Sponsor Ave', state: 'IN' }),
};

const json = obj => JSON.stringify(obj);
const NavButtons = () => null;

const makeProps = (overrides = {}) => ({
  NavButtons,
  contentAfterButtons: null,
  contentBeforeButtons: null,
  data: { ...baseData, ...(overrides.data || {}) },
  dataKey: overrides.dataKey || DATA_KEY,
  fullData: overrides.fullData,
  goForward: overrides.goForward || sinon.spy(),
  pagePerItemIndex: overrides.pagePerItemIndex,
  onChange: overrides.onChange || sinon.spy(),
});

const renderPage = (overrides = {}) => {
  const props = makeProps(overrides);
  const utils = render(<AddressSelectionPage {...props} />);

  const vaRadio = () => utils.container.querySelector('va-radio');
  const vaRadioOptions = () =>
    Array.from(utils.container.querySelectorAll('va-radio-option'));
  const optionLabels = () =>
    vaRadioOptions().map(o => o.getAttribute('label') || '');

  const fireChange = value =>
    vaRadio().dispatchEvent(
      new CustomEvent('vaValueChange', { detail: { value }, bubbles: true }),
    );

  const submitForm = () => {
    const form = utils.container.querySelector('form');
    fireEvent.submit(form);
  };

  return {
    ...utils,
    props,
    vaRadio,
    vaRadioOptions,
    optionLabels,
    fireChange,
    submitForm,
  };
};

describe('10-7959a <AddressSelectionPage>', () => {
  it('should render correct number of options when duplicate addresses are present', () => {
    const { vaRadioOptions, optionLabels } = renderPage({
      data: {
        ...baseData,
        sponsorAddress: { ...baseData.certifierAddress },
      },
    });
    expect(vaRadioOptions().length).to.equal(2);
    const labels = optionLabels().join(' | ');
    expect(labels.includes('111 Certifier Rd')).to.be.true;
  });

  context('when an option has been selected', () => {
    it('should set the correct data when selecting the `No` option', () => {
      const onChange = sinon.spy();
      const { props, fireChange } = renderPage({
        onChange,
        data: { ...baseData },
      });

      fireChange(NOT_SHARED);

      sinon.assert.calledOnce(onChange);
      const payload = onChange.firstCall.args[0];

      // ensure we are setting the full data object, and not an array item
      expect(payload).to.have.property('certifierAddress');
      expect(payload).to.have.property('sponsorAddress');

      expect(payload[FIELD_NAME]).to.equal(NOT_SHARED);
      expect(Object.prototype.hasOwnProperty.call(payload, DATA_KEY)).to.be
        .false;

      // ensure the original data object has not been mutated
      expect(props.data).to.not.have.property(FIELD_NAME);
    });

    it('should set the correct data when selecting an address option', () => {
      const onChange = sinon.spy();
      const chosen = addr({ street: '999 Picked St' });

      const { fireChange } = renderPage({
        onChange,
        data: { ...baseData },
      });

      fireChange(json(chosen));

      sinon.assert.calledOnce(onChange);
      const payload = onChange.firstCall.args[0];

      expect(payload[FIELD_NAME]).to.equal(json(chosen));
      expect(payload[DATA_KEY]).to.deep.equal(chosen);
    });
  });

  context('when attempting to continue to the next page', () => {
    it('should set an error when submitting without an option selected', () => {
      const goForward = sinon.spy();
      const { submitForm, vaRadio } = renderPage({
        goForward,
        data: { ...baseData },
      });

      submitForm();

      expect(vaRadio()).to.have.attr('error');
      sinon.assert.notCalled(goForward);
    });

    it('should successfully submit form when an option has been selected', () => {
      const goForward = sinon.spy();
      const data = { ...baseData, [FIELD_NAME]: NOT_SHARED };

      const { submitForm } = renderPage({ goForward, data });
      submitForm();

      sinon.assert.calledOnceWithExactly(goForward, { formData: data });
    });
  });
});
