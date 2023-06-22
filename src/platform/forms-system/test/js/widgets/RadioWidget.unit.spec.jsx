import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import RadioWidget from '../../../src/js/widgets/RadioWidget';
import { $, $$ } from '../../../src/js/utilities/ui';

describe('Schemaform <RadioWidget>', () => {
  const getAttr = (dom, index, attr) =>
    $$('input', dom)[index].getAttribute(attr);

  it('should render', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const { container } = render(
      <RadioWidget value onChange={onChange} options={{ enumOptions }} />,
    );
    expect($$('input', container).length).to.equal(2);
    const labels = $$('label', container);
    expect(labels[0].textContent).to.equal('Testing');
    expect(labels[1].textContent).to.equal('Testing2');
  });
  it('should render label from options', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const labels = {
      1: 'Other',
    };
    const { container } = render(
      <RadioWidget
        value
        onChange={onChange}
        options={{ enumOptions, labels }}
      />,
    );
    expect($$('input', container).length).to.equal(2);
    const labelsInDom = $$('label', container);
    expect(labelsInDom[0].textContent).to.equal('Other');
    expect(labelsInDom[1].textContent).to.equal('Testing2');
  });
  it('should handle change', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const { container } = render(
      <RadioWidget value onChange={onChange} options={{ enumOptions }} />,
    );
    fireEvent.click($('input', container));
    expect(onChange.calledWith('1')).to.be.true;
  });

  it('should render nested content', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const nestedContent = {
      1: <span>Nested</span>,
    };
    const { container } = render(
      <RadioWidget
        value="1"
        onChange={onChange}
        options={{ enumOptions, nestedContent }}
      />,
    );

    expect($('.schemaform-radio-indent', container).textContent).to.equal(
      'Nested',
    );
  });

  it('should not render nested content if not selected', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const nestedContent = {
      1: <span>Nested</span>,
    };
    const { container } = render(
      <RadioWidget
        value="2"
        onChange={onChange}
        options={{ enumOptions, nestedContent }}
      />,
    );

    expect(container.innerHTML).not.to.contain('Nested');
  });

  it('should add custom props', () => {
    const onChange = sinon.spy();
    const options = {
      enumOptions: [
        { label: 'Testing', value: '1' },
        { label: 'Testing2', value: '2' },
      ],
      widgetProps: {
        1: { 'data-test': 'first' },
        2: { 'data-test': 'second' },
      },
    };
    const { container } = render(
      <RadioWidget value onChange={onChange} options={options} />,
    );

    expect(getAttr(container, 0, 'data-test')).to.equal('first');
    expect(getAttr(container, 0, 'data-selected')).to.be.null;

    expect(getAttr(container, 1, 'data-test')).to.equal('second');
    expect(getAttr(container, 1, 'data-selected')).to.be.null;
  });

  it('should update selected props on radio inputs', async () => {
    const onChange = sinon.spy();
    const options = {
      id: 'test',
      enumOptions: [
        { label: 'Testing', value: '1' },
        { label: 'Testing2', value: '2' },
        { label: 'Testing3', value: '3' },
      ],
      widgetProps: {
        1: { 'data-test': 'first' },
        2: { 'data-test': 'second' },
        3: { 'data-test': 'third' },
      },
      selectedProps: {
        1: { 'data-selected': 'first_1' },
        2: { 'data-selected': 'second_2' },
        3: { 'data-selected': 'third_3' },
      },
    };
    // first option selected
    const { container, rerender } = render(
      <RadioWidget value="1" onChange={onChange} options={options} />,
    );

    await fireEvent.click($('input[value="1"]', container));
    await waitFor(() => {
      expect(getAttr(container, 0, 'data-test')).to.equal('first');
      expect(getAttr(container, 0, 'data-selected')).to.equal('first_1');
      expect(getAttr(container, 1, 'data-test')).to.equal('second');
      expect(getAttr(container, 1, 'data-selected')).to.be.null;
      expect(getAttr(container, 2, 'data-test')).to.equal('third');
      expect(getAttr(container, 2, 'data-selected')).to.be.null;
    });

    // second option selected
    rerender(<RadioWidget value="2" onChange={onChange} options={options} />);
    await waitFor(() => {
      expect(getAttr(container, 0, 'data-test')).to.equal('first');
      expect(getAttr(container, 0, 'data-selected')).to.be.null;
      expect(getAttr(container, 1, 'data-test')).to.equal('second');
      expect(getAttr(container, 1, 'data-selected')).to.equal('second_2');
      expect(getAttr(container, 2, 'data-test')).to.equal('third');
      expect(getAttr(container, 2, 'data-selected')).to.be.null;
    });

    // third option selected
    rerender(<RadioWidget value="3" onChange={onChange} options={options} />);

    await waitFor(() => {
      expect(getAttr(container, 0, 'data-test')).to.equal('first');
      expect(getAttr(container, 0, 'data-selected')).to.be.null;
      expect(getAttr(container, 1, 'data-test')).to.equal('second');
      expect(getAttr(container, 1, 'data-selected')).to.be.null;
      expect(getAttr(container, 2, 'data-test')).to.equal('third');
      expect(getAttr(container, 2, 'data-selected')).to.equal('third_3');
    });
  });

  it('should log events to google analytics', () => {
    global.window.dataLayer = [];
    const onChange = () => {};
    const options = {
      title: <div>Test Radio</div>,
      enumOptions: [
        { label: 'Testing', value: '1' },
        { label: 'Testing2', value: '2' },
      ],
      enableAnalytics: true,
    };
    const { container } = render(
      <RadioWidget value onChange={onChange} options={options} />,
    );

    fireEvent.click($('input[value="2"]', container));
    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'int-radio-button-option-click',
      'radio-button-label': 'Test Radio',
      'radio-button-optionLabel': 'Testing2',
      'radio-button-required': false,
    });
  });
});
