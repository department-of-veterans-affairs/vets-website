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

    expect(tree.everySubTree('ExpandingGroup')).not.to.be.empty;
    expect(tree.subTree('ExpandingGroup').props.open).to.be.false;
  });
  it('should not hide expand under items when true', () => {
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

    expect(tree.everySubTree('ExpandingGroup')).not.to.be.empty;
    expect(tree.subTree('ExpandingGroup').props.open).to.be.true;
  });
});
