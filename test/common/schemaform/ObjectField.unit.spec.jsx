import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ObjectField from '../../../src/js/common/schemaform/ObjectField';

describe('Schemaform: ObjectField', () => {
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
          onChange={onChange}
          onBlur={onBlur}/>
    );

    expect(tree.everySubTree('SchemaField')).not.to.be.empty;
  });
  it('should render description', () => {
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
      'ui:description': 'Blah'
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
          uiSchema={uiSchema}
          schema={schema}
          idSchema={{}}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}/>
    );

    expect(tree.text()).to.contain('Blah');
  });
  it('should render title', () => {
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
          idSchema={{}}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}/>
    );

    expect(tree.everySubTree('TitleField')).is.not.empty;
  });
});
