import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ObjectField from '../../../../src/js/common/schemaform/review/ObjectField';

describe('Schemaform review: ObjectField', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string'
        }
      }
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
          schema={schema}
          idSchema={{}}
          formData={{}}
          requiredSchema={{}}
          onChange={onChange}
          onBlur={onBlur}/>
    );

    expect(tree.everySubTree('SchemaField')).not.to.be.empty;
  });
  it('should render header', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string'
        }
      }
    };
    const uiSchema = {
      'ui:title': 'Blah'
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
          uiSchema={uiSchema}
          schema={schema}
          formContext={{}}
          requiredSchema={{}}
          idSchema={{ $id: 'root' }}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}/>
    );

    expect(tree.everySubTree('.form-review-panel-page-header-row')).not.to.be.empty;
    expect(tree.subTree('.form-review-panel-page-header').text()).to.equal('Blah');
  });
  it('should hide title', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string'
        }
      }
    };
    const uiSchema = {
      'ui:title': 'Blah'
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
          uiSchema={uiSchema}
          schema={schema}
          requiredSchema={{}}
          formContext={{ hideTitle: true }}
          idSchema={{ $id: 'root' }}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}/>
    );

    expect(tree.everySubTree('.form-review-panel-page-header-row')).not.to.be.empty;
    expect(tree.subTree('.form-review-panel-page-header').text()).to.be.empty;
  });
  it('should hide expand under items when false', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean'
        },
        test2: {
          type: 'string'
        }
      }
    };
    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test'
        }
      }
    };
    const formData = {
      test: false
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
          schema={schema}
          uiSchema={uiSchema}
          idSchema={{}}
          formData={formData}
          onChange={onChange}
          onBlur={onBlur}/>
    );

    expect(tree.everySubTree('SchemaField').length).to.equal(1);
  });
  it('should hide fields that are hide on review', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean'
        }
      }
    };
    const uiSchema = {
      test: {
        'ui:options': {
          hideOnReview: true
        }
      }
    };
    const formData = {
      test: true
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
          schema={schema}
          uiSchema={uiSchema}
          idSchema={{}}
          formData={formData}
          onChange={onChange}
          onBlur={onBlur}/>
    );

    expect(tree.everySubTree('SchemaField')).to.be.empty;
  });
  it('should hide false fields that are hide on review false', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean'
        }
      }
    };
    const uiSchema = {
      test: {
        'ui:options': {
          hideOnReviewIfFalse: true
        }
      }
    };
    const formData = {
      test: false
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
          schema={schema}
          uiSchema={uiSchema}
          idSchema={{}}
          formData={formData}
          onChange={onChange}
          onBlur={onBlur}/>
    );

    expect(tree.everySubTree('SchemaField')).to.be.empty;
  });
});
