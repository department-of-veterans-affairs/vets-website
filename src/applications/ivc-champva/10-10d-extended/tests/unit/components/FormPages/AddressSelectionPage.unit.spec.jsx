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
  certifierRole: 'applicant',
  certifierAddress: addr({ street: '111 Certifier Rd', state: 'IN' }),
  sponsorAddress: addr({ street: '222 Sponsor Ave', state: 'IN' }),
  applicants: [],
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

describe('1010d <AddressSelectionPage>', () => {
  context('when the component renders', () => {
    it('should render correct number of options when duplicate addresses are present', () => {
      const { vaRadioOptions, optionLabels } = renderPage({
        data: {
          ...baseData,
          sponsorAddress: { ...baseData.certifierAddress },
          applicants: [
            { applicantAddress: addr({ street: '333 Driver Lane' }) },
            { applicantAddress: addr({ street: '333 Driver Lane' }) },
          ],
        },
      });
      expect(vaRadioOptions().length).to.equal(3);
      const labels = optionLabels().join(' | ');
      expect(labels.includes('111 Certifier Rd')).to.be.true;
      expect(labels.includes('333 Driver Lane')).to.be.true;
    });

    it('should exclude addresses from the current applicant when in array mode', () => {
      const applicants = [
        { applicantAddress: addr({ street: '123 A St' }) },
        { applicantAddress: addr({ street: '123 B St' }) },
        { applicantAddress: addr({ street: '123 C St' }) },
      ];

      const { optionLabels } = renderPage({
        data: { ...baseData, applicants },
        fullData: { ...baseData, applicants },
        pagePerItemIndex: '1',
      });

      const labels = optionLabels().join(' | ');
      expect(labels.includes('123 B St')).to.be.false;
      expect(labels.includes('123 A St')).to.be.true;
      expect(labels.includes('123 C St')).to.be.true;
    });

    it('should render the correct label text based on the applicant array index and role', () => {
      // case 1 - when the first array item and certifierRole === applicant
      const r1 = renderPage({
        data: { ...baseData, applicants: [{}] },
        pagePerItemIndex: '0',
      });
      const label1 = r1.vaRadio().getAttribute('label') || '';
      expect(label1.startsWith('Do you')).to.be.true;
      r1.unmount();

      // case 2 - when any other index in the array
      const r2 = renderPage({
        data: { ...baseData, certifierRole: 'sponsor', applicants: [{}, {}] },
        pagePerItemIndex: '1',
      });
      const label2 = r2.vaRadio().getAttribute('label') || '';
      expect(label2.startsWith('Does the applicant')).to.be.true;
      r2.unmount();
    });
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

      // enusre the original data object has not been mutated
      expect(props.data).to.not.have.property(FIELD_NAME);
    });

    it('should set the correct data when selecting an address option', () => {
      const onChange = sinon.spy();
      const chosen = addr({ street: '999 Picked St' });

      const { fireChange } = renderPage({
        onChange,
        fullData: { ...baseData, applicants: [{}, {}] },
        data: { ...baseData, applicants: [{}, {}] },
        pagePerItemIndex: '0',
      });

      fireChange(json(chosen));

      sinon.assert.calledOnce(onChange);
      const payload = onChange.firstCall.args[0];

      expect(payload[FIELD_NAME]).to.equal(json(chosen));
      expect(payload[DATA_KEY]).to.deep.equal(chosen);

      // ensure we are only setting the array item data
      expect(payload).to.not.have.property('certifierAddress');
      expect(payload).to.not.have.property('sponsorAddress');
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
