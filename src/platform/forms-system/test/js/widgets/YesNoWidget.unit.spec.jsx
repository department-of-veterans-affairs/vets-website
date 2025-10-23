import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import YesNoWidget from '../../../src/js/widgets/YesNoWidget';
import { $, $$ } from '../../../src/js/utilities/ui';

describe('Schemaform <YesNoWidget>', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const { container } = render(<YesNoWidget value onChange={onChange} />);
    const inputs = $$('input', container);
    expect(inputs.length).to.equal(2);
    expect(inputs[0].checked).to.be.true;
    expect(inputs[1].checked).not.to.be.true;
  });

  it('should render undefined', () => {
    const onChange = sinon.spy();
    const { container } = render(<YesNoWidget onChange={onChange} />);
    const inputs = $$('input', container);
    expect(inputs.length).to.equal(2);
    expect(inputs[0].checked).not.to.be.true;
    expect(inputs[1].checked).not.to.be.true;
  });

  it('should render false', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <YesNoWidget value={false} onChange={onChange} />,
    );
    const inputs = $$('input', container);
    expect(inputs.length).to.equal(2);
    expect(inputs[0].checked).not.to.be.true;
    expect(inputs[1].checked).to.be.true;
  });

  it('should handle change', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <YesNoWidget value={false} onChange={onChange} />,
    );
    fireEvent.click($('input', container));
    expect(onChange.calledWith(true)).to.be.true;
  });

  it('should handle false change', () => {
    const onChange = sinon.spy();
    const { container } = render(<YesNoWidget value onChange={onChange} />);
    fireEvent.click($$('input', container)[1]);
    expect(onChange.calledWith(false)).to.be.true;
  });

  it('should render labels', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <YesNoWidget
        value
        options={{
          labels: {
            Y: 'Whatever',
            N: 'Testing',
          },
        }}
        onChange={onChange}
      />,
    );
    const labels = $$('label', container);
    expect(labels[0].textContent).to.equal('Whatever');
    expect(labels[1].textContent).to.equal('Testing');
  });

  it('should reverse value', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <YesNoWidget
        value
        options={{
          yesNoReverse: true,
        }}
        onChange={onChange}
      />,
    );

    const inputs = $$('input', container);
    expect(inputs[0].checked).to.be.false;
    expect(inputs[1].checked).to.be.true;
  });

  it('should add custom props', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <YesNoWidget
        value
        options={{
          yesNoReverse: true,
          widgetProps: {
            Y: { 'data-test': 'yes-input' },
            N: { 'data-test': 'no-input' },
          },
        }}
        onChange={onChange}
      />,
    );

    const inputs = $$('input', container);
    expect(inputs[0].dataset.test).to.equal('yes-input');
    expect(inputs[1].dataset.test).to.equal('no-input');
  });

  it('should update selected props', async () => {
    const options = {
      widgetProps: {
        Y: { 'data-test': 'yes-input' },
        N: { 'data-test': 'no-input' },
      },
      selectedProps: {
        Y: { 'data-selected': 'yes-selected' },
        N: { 'data-selected': 'no-selected' },
      },
    };
    const onChange = sinon.spy();
    const { container, rerender } = render(
      <YesNoWidget value options={options} onChange={onChange} />,
    );

    // "Yes" selected
    const inputs = $$('input', container);
    expect(inputs[0].dataset.test).to.equal('yes-input');
    expect(inputs[0].dataset.selected).to.equal('yes-selected');
    expect(inputs[1].dataset.test).to.equal('no-input');
    expect(inputs[1].dataset.selected).to.be.undefined;

    // "No" selected
    rerender(
      <YesNoWidget value={false} options={options} onChange={onChange} />,
    );

    await waitFor(() => {
      expect(inputs[0].dataset.test).to.equal('yes-input');
      expect(inputs[0].dataset.selected).to.be.undefined;
      expect(inputs[1].dataset.test).to.equal('no-input');
      expect(inputs[1].dataset.selected).to.equal('no-selected');
    });
  });

  it('should log events to google analytics', () => {
    global.window.dataLayer = [];
    const onChange = sinon.spy();
    const options = {
      title: 'YesNo title',
      labels: {
        N: 'Nope',
      },
      enableAnalytics: true,
    };
    const { container } = render(
      <YesNoWidget value options={options} onChange={onChange} />,
    );

    fireEvent.click($('input[value="N"]', container));
    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'int-radio-button-option-click',
      'radio-button-label': options.title,
      'radio-button-optionLabel': options.labels.N,
      'radio-button-required': false,
    });
  });

  it('should log events to google analytics', () => {
    global.window.dataLayer = [];
    const onChange = sinon.spy();
    const options = {
      title: <div>Test YesNo</div>,
      labels: {
        N: 'Nope',
      },
      errorMessages: { required: 'yep' },
      enableAnalytics: true,
    };
    const { container } = render(
      <YesNoWidget options={options} onChange={onChange} />,
    );

    fireEvent.click($('input[value="Y"]', container));
    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'int-radio-button-option-click',
      'radio-button-label': 'Test YesNo',
      'radio-button-optionLabel': 'Yes',
      'radio-button-required': true,
    });
  });
});
