import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import TextWidget from '../../../src/js/widgets/TextWidget';

describe('Schemaform <TextWidget>', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        disabled={false}
        onChange={onChange}
        options={{}}
      />,
    );
    const input = container.querySelector('input');
    expect(input.value).to.equal('testing');
    expect(input.type).to.equal('text');
  });
  it('should render autocomplete attribute', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        disabled={false}
        onChange={onChange}
        options={{
          autocomplete: 'date',
        }}
      />,
    );
    const input = container.querySelector('input');
    expect(input.getAttribute('autocomplete')).to.equal('date');
  });
  it('should render ariaDescribedby attribute', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        disabled={false}
        onChange={onChange}
        options={{
          ariaDescribedby: 'test-id',
        }}
      />,
    );
    const input = container.querySelector('input');
    expect(input.getAttribute('aria-describedby')).to.equal('test-id');
  });
  it('should render ariaDescribedby attribute with pagePerItemIndex', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        disabled={false}
        onChange={onChange}
        formContext={{ pagePerItemIndex: 2 }}
        options={{
          ariaDescribedby: 'test_id',
        }}
      />,
    );
    const input = container.querySelector('input');
    expect(input.getAttribute('aria-describedby')).to.equal('test_id_2');
  });
  it('should render empty string when undefined', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <TextWidget
        id="1"
        schema={{ type: 'string' }}
        required
        disabled={false}
        onChange={onChange}
        options={{}}
      />,
    );
    const input = container.querySelector('input');
    expect(input.value).to.equal('');
  });
  it('should render number', () => {
    const onChange = sinon.spy();
    const { container } = render(
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
    const input = container.querySelector('input');
    expect(input.type).to.equal('number');
  });
  it('should handle change', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        disabled={false}
        onChange={onChange}
        options={{}}
      />,
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'nextvalue' } });
    expect(onChange.calledWith('nextvalue')).to.be.true;
  });
  it('should handle blur', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const { container } = render(
      <TextWidget
        id="1"
        value="testing"
        schema={{ type: 'string' }}
        required
        disabled={false}
        onChange={onChange}
        onBlur={onBlur}
        options={{}}
      />,
    );
    const input = container.querySelector('input');
    fireEvent.blur(input);
    expect(onBlur.calledWith('1')).to.be.true;
  });
  it('should pass min max props', () => {
    const { container } = render(
      <TextWidget
        id="1"
        value={0}
        schema={{ type: 'number', minValue: '0', maxValue: '10' }}
        required
        disabled={false}
        onChange={() => null}
        onBlur={() => null}
        options={{}}
      />,
    );

    const input = container.querySelector('input');
    expect(input.getAttribute('min')).to.equal('0');
    expect(input.getAttribute('max')).to.equal('10');
    expect(input.id).to.equal('1');
    expect(input.value).to.equal('0');
  });
  it('should not pass undefined if minLength and maxLength are undefined', () => {
    const { container } = render(
      <TextWidget
        id="1"
        value={0}
        schema={{ type: 'number' }}
        required
        disabled={false}
        onChange={() => null}
        onBlur={() => null}
        options={{}}
      />,
    );

    const input = container.querySelector('input');
    expect(input.getAttribute('min')).to.not.exist;
    expect(input.getAttribute('max')).to.not.exist;
  });
});
