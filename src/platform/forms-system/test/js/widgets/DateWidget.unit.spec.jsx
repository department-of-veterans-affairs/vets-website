import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import DateWidget from '../../../src/js/widgets/DateWidget';

describe('Schemaform: DateWidget', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const { container } = render(
      <DateWidget id="test" onChange={onChange} onBlur={onBlur} />,
    );

    expect(container.querySelectorAll('select').length).to.equal(2);
    expect(container.querySelectorAll('input').length).to.equal(1);
  });
  it('should render initial date', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const { container } = render(
      <DateWidget
        id="test"
        value="2010-01-03"
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    const selects = container.querySelectorAll('select');
    const inputs = container.querySelectorAll('input');
    expect(selects[0].value).to.equal('1');
    expect(selects[1].value).to.equal('3');
    expect(inputs[0].value).to.equal('2010');
  });
  it('should call onChange', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const { container } = render(
      <DateWidget id="test" onChange={onChange} onBlur={onBlur} />,
    );

    const yearInput = container.querySelector('input[type="number"]');
    fireEvent.change(yearInput, { target: { value: '2001' } });

    expect(onChange.called).to.be.true;
  });
  it('should call onChange only when all fields filled out if required', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const { container } = render(
      <DateWidget id="test" required onChange={onChange} onBlur={onBlur} />,
    );

    const selects = container.querySelectorAll('select');
    const yearInput = container.querySelector('input[type="number"]');

    fireEvent.change(selects[0], { target: { value: '1' } }); // month
    expect(onChange.firstCall.args[0]).to.be.undefined;

    fireEvent.change(selects[1], { target: { value: '2' } }); // day
    expect(onChange.secondCall.args[0]).to.be.undefined;

    fireEvent.change(yearInput, { target: { value: '2001' } }); // year
    expect(onChange.thirdCall.args[0]).not.to.be.undefined;
  });
  it('should call onBlur', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const { container } = render(
      <DateWidget id="test" onChange={onChange} onBlur={onBlur} />,
    );

    const selects = container.querySelectorAll('select');
    const yearInput = container.querySelector('input[type="number"]');

    // Touch and blur all fields to trigger onBlur
    fireEvent.change(selects[0], { target: { value: '1' } }); // month
    fireEvent.blur(selects[0]);
    fireEvent.change(selects[1], { target: { value: '2' } }); // day
    fireEvent.blur(selects[1]);
    fireEvent.change(yearInput, { target: { value: '2020' } }); // year
    fireEvent.blur(yearInput);

    expect(onBlur.called).to.be.true;
  });
  it('should be able to be disabled', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const tree = render(
      <DateWidget disabled id="test" onChange={onChange} onBlur={onBlur} />,
    );

    const month = tree.getByLabelText('Month');
    const day = tree.getByLabelText('Day');
    const year = tree.getByLabelText('Year');

    expect(month).to.have.attribute('disabled');
    expect(day).to.have.attribute('disabled');
    expect(year).to.have.attribute('disabled');
  });
  describe('Month/Year', () => {
    it('should render', () => {
      const onChange = sinon.spy();
      const onBlur = sinon.spy();
      const { container } = render(
        <DateWidget
          options={{ monthYear: true }}
          id="test"
          onChange={onChange}
          onBlur={onBlur}
        />,
      );

      expect(container.querySelectorAll('select').length).to.equal(1);
      expect(container.querySelectorAll('input').length).to.equal(1);
    });
    it('should render initial date', () => {
      const onChange = sinon.spy();
      const onBlur = sinon.spy();
      const { container } = render(
        <DateWidget
          options={{ monthYear: true }}
          id="test"
          value="2010-01-XX"
          onChange={onChange}
          onBlur={onBlur}
        />,
      );

      const select = container.querySelector('select');
      const input = container.querySelector('input[type="number"]');
      expect(select.value).to.equal('1');
      expect(input.value).to.equal('2010');
    });
    it('should call onChange', () => {
      const onChange = sinon.spy();
      const onBlur = sinon.spy();
      const { container } = render(
        <DateWidget
          options={{ monthYear: true }}
          id="test"
          onChange={onChange}
          onBlur={onBlur}
        />,
      );

      const yearInput = container.querySelector('input[type="number"]');
      fireEvent.change(yearInput, { target: { value: '2001' } });

      expect(onChange.called).to.be.true;
    });
    it('should call onChange only when all fields filled out if required', () => {
      const onChange = sinon.spy();
      const onBlur = sinon.spy();
      const { container } = render(
        <DateWidget
          options={{ monthYear: true }}
          id="test"
          required
          onChange={onChange}
          onBlur={onBlur}
        />,
      );

      const select = container.querySelector('select');
      const yearInput = container.querySelector('input[type="number"]');

      fireEvent.change(yearInput, { target: { value: '2001' } });
      expect(onChange.firstCall.args[0]).to.be.undefined;

      fireEvent.change(select, { target: { value: '1' } });
      expect(onChange.secondCall.args[0]).not.to.be.undefined;
    });
    it('should call onBlur', () => {
      const onChange = sinon.spy();
      const onBlur = sinon.spy();
      const { container } = render(
        <DateWidget
          options={{ monthYear: true }}
          id="test"
          onChange={onChange}
          onBlur={onBlur}
        />,
      );

      const select = container.querySelector('select');
      const yearInput = container.querySelector('input[type="number"]');

      // Touch and blur to trigger onBlur
      fireEvent.change(select, { target: { value: '1' } });
      fireEvent.blur(select);
      fireEvent.change(yearInput, { target: { value: '2020' } });
      fireEvent.blur(yearInput);

      expect(onBlur.called).to.be.true;
    });
  });
});
