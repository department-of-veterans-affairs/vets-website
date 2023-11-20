import { expect } from 'chai';
import sinon from 'sinon';

import {
  isEmptyObject,
  getItemSchema,
  recordButtonClick,
  recordModalVisible,
  recordRadioChange,
} from '../../utils/helpers';

describe('isEmptyObject', () => {
  it('should return true for an empty object', () => {
    expect(isEmptyObject({})).to.be.true;
  });
  it('should return true for non objects or filled objects', () => {
    expect(isEmptyObject()).to.be.false;
    expect(isEmptyObject('')).to.be.false;
    expect(isEmptyObject([])).to.be.false;
    expect(isEmptyObject('test')).to.be.false;
    expect(isEmptyObject(null)).to.be.false;
    expect(isEmptyObject(true)).to.be.false;
    expect(isEmptyObject(() => {})).to.be.false;
    expect(isEmptyObject({ test: '' })).to.be.false;
  });
});

describe('getItemSchema', () => {
  const schema = {
    items: [{ a: 1 }, { a: 2 }, { a: 3 }],
    additionalItems: { b: 1 },
  };
  it('should return indexed iItems', () => {
    expect(getItemSchema(schema, 0)).to.deep.equal({ a: 1 });
    expect(getItemSchema(schema, 1)).to.deep.equal({ a: 2 });
    expect(getItemSchema(schema, 2)).to.deep.equal({ a: 3 });
  });
  it('should return additionalItems', () => {
    expect(getItemSchema(schema, 3)).to.deep.equal({ b: 1 });
  });
});

describe('recordButtonClick', () => {
  it('should record button clicks', () => {
    const recordSpy = sinon.spy();
    recordButtonClick('type', 'label', 'color', recordSpy);
    expect(
      recordSpy.calledWith({
        event: 'cta-button-click',
        'button-type': 'type',
        'button-click-label': 'label',
        'button-background-color': 'color',
      }),
    ).to.be.true;
  });
});

describe('recordModalVisible', () => {
  it('should record button clicks', () => {
    const recordSpy = sinon.spy();
    recordModalVisible('type', 'heading', 'key', 'reason', recordSpy);
    expect(
      recordSpy.calledWith({
        event: 'visible-alert-box',
        'alert-box-type': 'type',
        'alert-box-heading': 'heading',
        'error-key': 'key',
        'alert-box-full-width': false,
        'alert-box-background-only': false,
        'alert-box-closeable': false,
        'reason-for-alert': 'reason',
      }),
    ).to.be.true;
  });
});

describe('recordRadioChange', () => {
  it('should record button clicks', () => {
    const recordSpy = sinon.spy();
    recordRadioChange('title', 'label', 'required', recordSpy);
    expect(
      recordSpy.calledWith({
        event: 'int-radio-button-option-click',
        'radio-button-label': 'title',
        'radio-button-optionLabel': 'label',
        'radio-button-required': 'required',
      }),
    ).to.be.true;
  });
});
