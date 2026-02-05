import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ReviewFieldTemplate from '../../../src/js/review/ReviewFieldTemplate';
import StringField from '../../../src/js/review/StringField';
import { TextWidget } from '../../../src/js/review/widgets';

describe('Schemaform ReviewFieldTemplate', () => {
  it('should render review row', () => {
    const { container } = render(
      <ReviewFieldTemplate
        schema={{ type: 'string' }}
        uiSchema={{ 'ui:title': 'Label' }}
      />,
    );

    expect(container.querySelectorAll('.review-row').length).to.not.equal(0);
    expect(container.querySelector('dt').textContent).to.equal('Label');
    expect(container.querySelectorAll('dd').length).to.not.equal(0);
  });
  it('should render description', () => {
    const uiSchema = {
      'ui:title': 'Label',
      'ui:description': 'Blah',
    };
    const { container } = render(
      <ReviewFieldTemplate schema={{ type: 'string' }} uiSchema={uiSchema} />,
    );

    expect(container.querySelector('dt').textContent).to.contain('Label');
    expect(container.querySelector('p').textContent).to.equal('Blah');
  });
  it('should render element description', () => {
    const uiSchema = {
      'ui:title': 'Label',
      'ui:description': <div>Blah</div>,
    };
    const { container } = render(
      <ReviewFieldTemplate schema={{ type: 'string' }} uiSchema={uiSchema} />,
    );

    expect(container.querySelector('dt').textContent).to.contain('Label');
    expect(container.textContent).to.contain('Blah');
  });
  it('should render description component', () => {
    const uiSchema = {
      'ui:title': 'Label',
      'ui:description': () => <span>Blah</span>,
    };
    const { container } = render(
      <ReviewFieldTemplate
        schema={{ type: 'string' }}
        uiSchema={uiSchema}
        formContext={{ pagePerItemIndex: 2 }}
      />,
    );

    const dt = container.querySelector('dt');
    expect(dt.textContent).to.contain('Label');
    expect(dt.textContent).to.contain('Blah');
  });
  it('should render just children for object type', () => {
    const { container } = render(
      <ReviewFieldTemplate
        schema={{ type: 'object' }}
        uiSchema={{ 'ui:title': 'Label' }}
      >
        <div className="test-child" />
      </ReviewFieldTemplate>,
    );

    expect(container.querySelectorAll('.review-row').length).to.equal(0);
    expect(container.querySelectorAll('.test-child').length).to.not.equal(0);
  });
  it('should render the custom reviewField', () => {
    const uiSchema = {
      'ui:title': 'Label',
      'ui:description': 'Blah',
      'ui:reviewField': () => (
        <dl className="review-row">
          <dt>Test</dt>
        </dl>
      ),
    };
    const { container } = render(
      <ReviewFieldTemplate schema={{ type: 'string' }} uiSchema={uiSchema}>
        <div className="test-child" />
      </ReviewFieldTemplate>,
    );

    expect(container.querySelector('dt').textContent).to.equal('Test');
    // Children are ignored for non-string/array objects
    expect(container.querySelectorAll('.test-child').length).to.equal(0);
  });
  it('should render the custom reviewField & children', () => {
    const uiSchema = {
      'ui:title': 'Label',
      'ui:description': 'Blah',
      'ui:reviewField': () => (
        <dl className="review-row">
          <dt>Test</dt>
        </dl>
      ),
    };
    const { container } = render(
      <ReviewFieldTemplate schema={{ type: 'object' }} uiSchema={uiSchema}>
        <div className="test-child" />
      </ReviewFieldTemplate>,
    );

    expect(container.querySelector('dl').getAttribute('class')).to.exist;
    expect(container.querySelector('dt').textContent).to.equal('Test');
    expect(container.querySelectorAll('.test-child').length).to.equal(0);
  });

  const hideEmptyUiSchema = {
    'ui:title': 'Label',
    'ui:options': {
      hideEmptyValueInReview: true,
    },
  };
  it('should render children with content when hideEmptyValueInReview is set', () => {
    const schema = { type: 'string' };
    const { container } = render(
      <ReviewFieldTemplate schema={schema} uiSchema={hideEmptyUiSchema}>
        <StringField
          registry={{ widgets: { text: TextWidget } }}
          schema={schema}
          uiSchema={hideEmptyUiSchema}
          formData="1234"
        />
      </ReviewFieldTemplate>,
    );

    expect(container.querySelectorAll('.review-row').length).to.not.equal(0);
    expect(container.querySelector('dt').textContent).to.equal('Label');
    // The actual value should be rendered somewhere in the component
    expect(container.textContent).to.contain('1234');
  });
  it('should hide review row with empty value & hideEmptyValueInReview is set', () => {
    const schema = { type: 'string' };
    const { container } = render(
      <ReviewFieldTemplate schema={schema} uiSchema={hideEmptyUiSchema}>
        <StringField
          registry={{ widgets: { text: TextWidget } }}
          schema={schema}
          uiSchema={hideEmptyUiSchema}
          formData=""
        />
      </ReviewFieldTemplate>,
    );

    expect(container.querySelectorAll('.review-row').length).to.equal(0);
  });
  it('should hide review row with empty value & hideEmptyValueInReview is set', () => {
    const schema = { type: 'string' };
    const { container } = render(
      <ReviewFieldTemplate schema={schema} uiSchema={hideEmptyUiSchema}>
        <StringField
          registry={{ widgets: { text: TextWidget } }}
          schema={schema}
          uiSchema={hideEmptyUiSchema}
          formData={null}
        />
      </ReviewFieldTemplate>,
    );

    expect(container.querySelectorAll('.review-row').length).to.equal(0);
  });
  it('should render reviewWidget with empty value & hideEmptyValueInReview is set', () => {
    const schema = { type: 'string' };
    const uiSchema = {
      'ui:title': 'Label',
      'ui:reviewWidget': () => <span />,
      'ui:reviewField': () => (
        <dl className="review-row">
          <dt>Test</dt>
          <dd>123</dd>
        </dl>
      ),
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    };
    const { container } = render(
      <ReviewFieldTemplate schema={schema} uiSchema={uiSchema}>
        <StringField
          registry={{ widgets: { text: TextWidget } }}
          schema={schema}
          uiSchema={uiSchema}
          formData=""
        />
      </ReviewFieldTemplate>,
    );

    expect(container.querySelectorAll('.review-row').length).to.not.equal(0);
    expect(container.querySelector('dt').textContent).to.equal('Test');
    expect(container.querySelector('dd').textContent).to.equal('123'); // ignore formData
  });
});
