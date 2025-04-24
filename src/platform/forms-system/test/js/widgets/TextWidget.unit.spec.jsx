import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import TextWidget from '../../../src/js/widgets/TextWidget';

describe('Schemaform <TextWidget>', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const tree = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        onChange={onChange}
        options={{}}
      />,
    );
    const vaTextInput = tree.container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('value')).to.equal('testing');
    expect(vaTextInput.getAttribute('type')).to.equal('text');
  });
  it('should render autocomplete attribute', () => {
    const onChange = sinon.spy();
    const tree = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        onChange={onChange}
        options={{
          autocomplete: 'date',
        }}
      />,
    );
    const vaTextInput = tree.container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('autocomplete')).to.equal('date');
  });
  it('should render ariaDescribedby attribute', () => {
    const onChange = sinon.spy();
    const tree = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        onChange={onChange}
        options={{
          ariaDescribedby: 'test-id',
        }}
      />,
    );
    const vaTextInput = tree.container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('aria-describedby')).to.equal('test-id');
  });
  it('should render ariaDescribedby attribute with pagePerItemIndex', () => {
    const onChange = sinon.spy();
    const tree = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        onChange={onChange}
        formContext={{ pagePerItemIndex: 2 }}
        options={{
          ariaDescribedby: 'test_id',
        }}
      />,
    );
    const vaTextInput = tree.container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('aria-describedby')).to.equal('test_id_2');
  });
  it('should render empty string when undefined', () => {
    const onChange = sinon.spy();
    const tree = render(
      <TextWidget
        id="1"
        schema={{ type: 'string' }}
        required
        onChange={onChange}
        options={{}}
      />,
    );
    const vaTextInput = tree.container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('value')).to.equal('');
  });
  it('should render number', () => {
    const onChange = sinon.spy();
    const tree = render(
      <TextWidget
        id="1"
        value="1"
        schema={{ type: 'number' }}
        required
        disabled={false}
        onChange={onChange}
        options={{}}
      />,
    );
    const vaTextInput = tree.container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('type')).to.equal('number');
  });
  it('should handle change', async () => {
    const onChange = sinon.spy();
    const tree = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        onChange={onChange}
        options={{}}
      />,
    );
    const vaTextInput = tree.container.querySelector('va-text-input');
    vaTextInput.value = 'nextvalue';
    vaTextInput.dispatchEvent(new Event('input', { bubbles: true }));
    await waitFor(() => {
      expect(onChange.calledWith('nextvalue')).to.be.true;
    });
  });
  it('should handle blur', async () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const tree = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        onChange={onChange}
        onBlur={onBlur}
        options={{}}
      />,
    );
    const vaTextInput = tree.container.querySelector('va-text-input');
    fireEvent.blur(vaTextInput);
    await waitFor(() => {
      expect(onBlur.calledWith('1')).to.be.true;
    });
  });
  it('should pass min max props', () => {
    const tree = render(
      <TextWidget
        id="1"
        value={0}
        schema={{ type: 'number', minValue: '0', maxValue: '10' }}
        required
        onChange={() => null}
        onBlur={() => null}
        options={{}}
      />,
    );

    const vaTextInput = tree.container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('min')).to.equal('0');
    expect(vaTextInput.getAttribute('max')).to.equal('10');
    expect(vaTextInput.getAttribute('id')).to.equal('1');
    expect(vaTextInput.getAttribute('value')).to.equal('0');
  });
  it('should not pass undefined if minLength and maxLength are undefined', () => {
    const tree = render(
      <TextWidget
        id="1"
        value={0}
        schema={{ type: 'number' }}
        required
        onChange={() => null}
        onBlur={() => null}
        options={{}}
      />,
    );
    const vaTextInput = tree.container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('min')).not.to.exist;
    expect(vaTextInput.getAttribute('max')).not.to.exist;
  });
});
