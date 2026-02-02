import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import SelectWidget from '../../../src/js/widgets/SelectWidget';

describe('Schemaform <SelectWidget>', () => {
  it('should render', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const onChange = sinon.spy();
    const { container } = render(
      <SelectWidget
        schema={{}}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    );

    expect(container.querySelectorAll('option').length).to.equal(2);
  });
  it('should render label from options', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const labels = {
      testValue: 'Other',
    };
    const onChange = sinon.spy();
    const { container } = render(
      <SelectWidget
        schema={{}}
        id="testing"
        onChange={onChange}
        options={{ enumOptions, labels }}
      />,
    );

    const options = container.querySelectorAll('option');
    expect(options[1].textContent).to.equal('Other');
  });
  it('should render widgetProps from options', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const widgetProps = { 'aria-label': 'testing' };

    const onChange = sinon.spy();
    const { container } = render(
      <SelectWidget
        schema={{}}
        id="testing"
        onChange={onChange}
        options={{ enumOptions, widgetProps }}
      />,
    );

    const select = container.querySelector('select');
    expect(select.getAttribute('aria-label')).to.eq('testing');
  });
  it('should render selectedProps from options', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const selectedProps = { testValue: { 'data-value': 'ok-test' } };
    const props = {
      schema: {},
      id: 'testing',
      options: { enumOptions, selectedProps },
    };

    const { container, rerender } = render(<SelectWidget {...props} />);
    let select = container.querySelector('select');
    expect(select.getAttribute('data-value')).to.not.exist;
    
    rerender(<SelectWidget value="testValue" {...props} />);
    select = container.querySelector('select');
    expect(select.getAttribute('data-value')).to.equal('ok-test');
  });
  it('should handle change', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const onChange = sinon.spy();
    const { container } = render(
      <SelectWidget
        schema={{}}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    );

    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: '' } });
    expect(onChange.firstCall.args[0]).to.be.undefined;
    
    fireEvent.change(select, { target: { value: 'testValue' } });
    expect(onChange.secondCall.args[0]).to.equal('testValue');
  });
  it('should handle number change', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 2,
      },
    ];
    const onChange = sinon.spy();
    const { container } = render(
      <SelectWidget
        schema={{ type: 'number' }}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    );

    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: '2' } });
    expect(onChange.calledWith(2)).to.be.true;
  });
  it('should handle boolean change', () => {
    const enumOptions = [
      {
        label: 'True',
        value: 'true',
      },
      {
        label: 'False',
        value: 'false',
      },
    ];
    const onChange = sinon.spy();
    const { container } = render(
      <SelectWidget
        schema={{ type: 'boolean' }}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    );

    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: 'true' } });
    expect(onChange.calledWith(true)).to.be.true;
  });
  it('should handle blur', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const onBlur = sinon.spy();
    const { container } = render(
      <SelectWidget
        schema={{}}
        id="testing"
        onBlur={onBlur}
        options={{ enumOptions }}
      />,
    );

    const select = container.querySelector('select');
    fireEvent.blur(select, { target: { value: 'testValue' } });
    expect(onBlur.calledWith('testing', 'testValue')).to.be.true;
  });
  it('should not render blank option when default exists', () => {
    const enumOptions = [
      {
        label: 'Testing',
        value: 'testValue',
      },
    ];
    const onChange = sinon.spy();
    const { container } = render(
      <SelectWidget
        schema={{
          default: 'testValue',
        }}
        id="testing"
        onChange={onChange}
        options={{ enumOptions }}
      />,
    );

    expect(container.querySelectorAll('option').length).to.equal(1);
  });
});
