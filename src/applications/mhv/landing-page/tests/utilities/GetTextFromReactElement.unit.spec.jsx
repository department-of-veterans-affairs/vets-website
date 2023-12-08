import { expect } from 'chai';
import React from 'react';
import { getTextFromReactElement } from '../../utilities';

describe('getTextFromReactElement', () => {
  it('should return the string for plain text', () => {
    const result = getTextFromReactElement('Hello World');
    expect(result).to.equal('Hello World');
  });

  it('should return the text content of a simple React element', () => {
    const element = <span>Hello World</span>;
    const result = getTextFromReactElement(element);
    expect(result).to.equal('Hello World');
  });

  it('should return the combined text of nested React elements', () => {
    const element = (
      <div>
        <span>Hello</span>
        <span>World</span>
      </div>
    );
    const result = getTextFromReactElement(element);
    expect(result).to.equal('HelloWorld');
  });

  it('should return an empty string for an invalid input', () => {
    const result = getTextFromReactElement(null);
    expect(result).to.equal('');
  });
});
