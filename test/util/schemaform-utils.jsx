import _ from 'lodash/fp';
import Form from 'react-jsonschema-form';
import ReactTestUtils from 'react-dom/test-utils';

import React from 'react';
import { findDOMNode } from 'react-dom';
import SchemaForm from '../../src/js/common/schemaform/SchemaForm';
import { fillDate } from './unit-helpers';

import {
  replaceRefSchemas,
  updateSchemaAndData
} from '../../src/js/common/schemaform/formState';

function getDefaultData(schema) {
  if (schema.type === 'array') {
    return [];
  } else if (schema.type === 'object') {
    return {};
  }

  return undefined;
}
export class DefinitionTester extends React.Component {
  constructor(props) {
    super(props);
    const { data, uiSchema } = props;

    const definitions = _.assign(props.definitions || {}, props.schema.definitions);
    const schema = replaceRefSchemas(props.schema, definitions);

    const {
      data: newData,
      schema: newSchema
    } = updateSchemaAndData(schema, uiSchema, data || getDefaultData(schema));

    this.state = {
      formData: newData,
      schema: newSchema,
      uiSchema
    };
  }
  handleChange = (data) => {
    const {
      schema,
      uiSchema,
      formData
    } = this.state;
    const { pagePerItemIndex, arrayPath } = this.props;

    let fullData = data;

    if (arrayPath) {
      fullData = _.set([arrayPath, pagePerItemIndex], data, formData);
    }

    const {
      data: newData,
      schema: newSchema
    } = updateSchemaAndData(schema, uiSchema, fullData);

    this.setState({
      formData: newData,
      schema: newSchema,
      uiSchema
    });
  }
  render() {
    let { schema, uiSchema, formData } = this.state;
    const { pagePerItemIndex, arrayPath } = this.props;

    if (arrayPath) {
      schema = schema.properties[arrayPath].items[pagePerItemIndex];
      uiSchema = uiSchema[arrayPath].items;
      formData = formData ? formData[arrayPath][pagePerItemIndex] : formData;
    }

    return (
      <SchemaForm
          safeRenderCompletion
          reviewMode={this.props.reviewMode}
          name="test"
          title={this.props.title || 'test'}
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          pagePerItemIndex={this.props.pagePerItemIndex}
          onChange={this.handleChange}
          uploadFile={this.props.uploadFile}
          onSubmit={this.props.onSubmit}/>
    );
  }
}

export function submitForm(form) {
  ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
    preventDefault: f => f
  });
}

function getIdentifier(node) {
  const tagName = node.tagName.toLowerCase();
  if (node.id) {
    return `${tagName}#${node.id}`;
  }

  if (node.name) {
    return `${tagName}[name='${node.name}']`;
  }

  const classes = node.getAttribute('class');
  if (classes) {
    // Make a dot-separated list of class names
    const classList = classes.split(' ').reduce((c, carry) => `${c}.${carry}`, '');
    return `${tagName}${classList}`;
  }

  return tagName;
}

const bar = '\u2551';
const elbow = '\u2559';
const tee = '\u255F';

function printTree(node, level = 0, isLastChild = true, padding = '') {
  const nextLevel = level + 1; // For tail call optimization...theoretically...
  const lastPipe = isLastChild ? `${elbow} ` : `${tee} `;

  console.log(`${padding}${lastPipe}${getIdentifier(node)}`); // eslint-disable-line no-console

  // Recurse for each child
  const newPadding = padding + (isLastChild ? '  ' : `${bar} `);
  const children = Array.from(node.children);
  children.forEach((child, index) => {
    const isLast = index === children.length - 1;
    return printTree(child, nextLevel, isLast, newPadding);
  });
}

export function getFormDOM(form) {
  const formDOM = findDOMNode(form);

  formDOM.fillData = function fillData(id, value) {
    ReactTestUtils.Simulate.change(this.querySelector(id), {
      target: {
        value
      }
    });
  };

  formDOM.files = function fillFiles(id, files) {
    ReactTestUtils.Simulate.change(this.querySelector(id), {
      target: {
        files
      }
    });
  };

  formDOM.submitForm = () => {
    submitForm(form);
  };

  formDOM.setCheckbox = function toggleCheckbox(selector, checked) {
    ReactTestUtils.Simulate.change(this.querySelector(selector), {
      target: {
        checked
      }
    });
  };

  // Accepts 'Y', 'N', true, false
  formDOM.setYesNo = function setYesNo(selector, value) {
    const isYes = typeof value === 'string' ? value.toLowerCase() === 'y' : !!value;
    ReactTestUtils.Simulate.change(this.querySelector(selector), {
      target: {
        value: isYes ? 'Y' : 'N'
      }
    });
  };

  formDOM.selectRadio = function selectRadio(fieldName, value) {
    ReactTestUtils.Simulate.change(this.querySelector(`input[name^="${fieldName}"][value="${value}"]`), {
      target: { value }
    });
  };

  formDOM.click = function click(selector) {
    ReactTestUtils.Simulate.click(this.querySelector(selector));
  };

  // TODO: Remove fillDate from unit-helpers and prefer this one
  formDOM.fillDate = function populateDate(partialId, dateString) {
    fillDate(this, partialId, dateString);
  };

  /**
   * Prints the formDOM as a tree in the console for debugging purposes
   * @return {void}
   */
  formDOM.printTree = function print() {
    printTree(this);
  };

  return formDOM;
}
