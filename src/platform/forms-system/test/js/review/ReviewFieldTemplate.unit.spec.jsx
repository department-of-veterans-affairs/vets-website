import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import ReviewFieldTemplate from '../../../src/js/review/ReviewFieldTemplate';
import StringField from '../../../src/js/review/StringField';

describe('Schemaform ReviewFieldTemplate', () => {
  it('should render review row', () => {
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate
        schema={{ type: 'string' }}
        uiSchema={{ 'ui:title': 'Label' }}
      />,
    );

    expect(tree.everySubTree('.review-row')).to.not.be.empty;
    expect(tree.subTree('dt').text()).to.equal('Label');
    expect(tree.everySubTree('dd')).to.not.be.empty;
  });
  it('should render description', () => {
    const uiSchema = {
      'ui:title': 'Label',
      'ui:description': 'Blah',
    };
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate schema={{ type: 'string' }} uiSchema={uiSchema} />,
    );

    expect(tree.subTree('dt').text()).to.contain('Label');
    expect(tree.subTree('p').text()).to.equal('Blah');
  });
  it('should render element description', () => {
    const uiSchema = {
      'ui:title': 'Label',
      'ui:description': <div>Blah</div>,
    };
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate schema={{ type: 'string' }} uiSchema={uiSchema} />,
    );

    expect(tree.subTree('dt').text()).to.contain('Label');
    expect(tree.text()).to.contain('Blah');
  });
  it('should render description component', () => {
    const uiSchema = {
      'ui:title': 'Label',
      'ui:description': () => <span>Blah</span>,
    };
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate
        schema={{ type: 'string' }}
        uiSchema={uiSchema}
        formContext={{ pagePerItemIndex: 2 }}
      />,
    );

    const dt = tree.subTree('dt');
    expect(dt.text()).to.contain('Label');
    expect(dt.text()).to.contain('uiDescription');
    expect(dt.props.children[2].props.index).to.eq(2);
  });
  it('should render just children for object type', () => {
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate
        schema={{ type: 'object' }}
        uiSchema={{ 'ui:title': 'Label' }}
      >
        <div className="test-child" />
      </ReviewFieldTemplate>,
    );

    expect(tree.everySubTree('.review-row')).to.be.empty;
    expect(tree.everySubTree('.test-child')).to.not.be.empty;
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
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate schema={{ type: 'string' }} uiSchema={uiSchema}>
        <div className="test-child" />
      </ReviewFieldTemplate>,
    );

    expect(tree.subTree('dt').text()).to.equal('Test');
    // Children are ignored for non-string/array objects
    expect(tree.everySubTree('.test-child').length).to.equal(0);
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
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate schema={{ type: 'object' }} uiSchema={uiSchema}>
        <div className="test-child" />
      </ReviewFieldTemplate>,
    );

    expect(tree.everySubTree('.review-row')).to.be.empty;
    expect(tree.everySubTree('.test-child').length).to.equal(1);
  });

  const hideEmptyUiSchema = {
    'ui:title': 'Label',
    'ui:reviewWidget': () => <span />,
    'ui:options': {
      hideEmptyValueInReview: true,
    },
  };
  it('should render children with content when hideEmptyValueInReview is set', () => {
    const schema = { type: 'string' };
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate schema={schema} uiSchema={hideEmptyUiSchema}>
        <StringField
          schema={schema}
          uiSchema={hideEmptyUiSchema}
          formData={'1234'}
        />
      </ReviewFieldTemplate>,
    );

    expect(tree.everySubTree('.review-row')).to.not.be.empty;
    expect(tree.subTree('dt').text()).to.equal('Label');
    expect(tree.dive(['StringField']).props.formData).to.equal('1234');
  });
  it('should hide review row with empty value & hideEmptyValueInReview is set', () => {
    const schema = { type: 'string' };
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate schema={schema} uiSchema={hideEmptyUiSchema}>
        <StringField
          schema={schema}
          uiSchema={hideEmptyUiSchema}
          formData={''}
        />
      </ReviewFieldTemplate>,
    );

    expect(tree.everySubTree('.review-row')).to.be.empty;
  });
  it('should hide review row with empty value & hideEmptyValueInReview is set', () => {
    const schema = { type: 'string' };
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate schema={schema} uiSchema={hideEmptyUiSchema}>
        <StringField
          schema={schema}
          uiSchema={hideEmptyUiSchema}
          formData={null}
        />
      </ReviewFieldTemplate>,
    );

    expect(tree.everySubTree('.review-row')).to.be.empty;
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
    const tree = SkinDeep.shallowRender(
      <ReviewFieldTemplate schema={schema} uiSchema={uiSchema}>
        <StringField schema={schema} uiSchema={uiSchema} formData={''} />
      </ReviewFieldTemplate>,
    );

    expect(tree.everySubTree('.review-row')).to.not.be.empty;
    expect(tree.subTree('dt').text()).to.equal('Test');
    expect(tree.subTree('dd').text()).to.equal('123'); // ignore formData
  });
});
