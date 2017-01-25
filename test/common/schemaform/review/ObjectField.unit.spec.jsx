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
});
