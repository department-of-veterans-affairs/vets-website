import { expect } from 'chai';
import { getTextFromElement } from '../../utilities';

class MockNode {
  constructor(nodeType, nodeValue = '') {
    this.nodeType = nodeType;
    this.nodeValue = nodeValue;
    this.childNodes = [];
  }

  appendChild(node) {
    this.childNodes.push(node);
  }
}

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

describe('getTextFromElement', () => {
  it('should return the string for text nodes', () => {
    const textNode = new MockNode(TEXT_NODE, 'Hello World');
    const result = getTextFromElement(textNode);
    expect(result).to.equal('Hello World');
  });

  it('should return the text content of a simple element node', () => {
    const element = new MockNode(ELEMENT_NODE);
    element.appendChild(new MockNode(TEXT_NODE, 'Hello World'));
    const result = getTextFromElement(element);
    expect(result).to.equal('Hello World');
  });

  it('should return the combined text of nested elements', () => {
    const parentElement = new MockNode(ELEMENT_NODE);
    const childElement1 = new MockNode(ELEMENT_NODE);
    const childText1 = new MockNode(TEXT_NODE, 'Hello');
    const childElement2 = new MockNode(ELEMENT_NODE);
    const childText2 = new MockNode(TEXT_NODE, 'World');

    childElement1.appendChild(childText1);
    childElement2.appendChild(childText2);
    parentElement.appendChild(childElement1);
    parentElement.appendChild(childElement2);

    const result = getTextFromElement(parentElement);
    expect(result).to.equal('HelloWorld');
  });
});
