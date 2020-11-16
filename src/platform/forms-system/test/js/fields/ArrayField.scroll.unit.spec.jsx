import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from 'enzyme';

import ArrayField from '../../../src/js/fields/ArrayField';

const registry = {
  definitions: {},
  fields: {
    TitleField: f => f,
    SchemaField: f => f,
  },
};
const formContext = {
  setTouched: sinon.spy(),
};
const requiredSchema = {};

describe('Schemaform <ArrayField>', () => {
  it('should contain props for does not scroll.', () => {
    const idSchema = {
      $id: 'root_field',
    };
    const schema = {
      type: 'array',
      items: [],
      maxItems: 2,
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        doNotScroll: true,
        viewField: f => f,
      },
    };
    const formData = [{}, {}];
    const errorSchema = {};
    const onChange = sinon.spy();
    const onBlur = sinon.spy();

    const tree = shallow(
      <ArrayField
        schema={schema}
        errorSchema={errorSchema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
        formContext={formContext}
        requiredSchema={requiredSchema}
      />,
    );
    tree.instance().componentDidMount();
    tree.instance().handleAdd();
    expect(tree.instance().props.uiSchema['ui:options'].doNotScroll).to.be.true;
    tree.unmount();
  });
});
