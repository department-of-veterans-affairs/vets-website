import React from 'react';
import { expect } from 'chai';

import {
  displayFileSize,
  formatSSN,
  isReactComponent,
  pluralize,
} from '../../ui';

describe('ui/index', () => {
  describe('formatSSN', () => {
    it('should format SSN properly with dashes when entered as one digit', () => {
      const result = formatSSN('123456789');
      expect(result).to.equal('123-45-6789');
    });

    it('should format SSN properly with dashes when entered with dashes', () => {
      const result = formatSSN('123-45-6789');
      expect(result).to.equal('123-45-6789');
    });

    it('should format SSN properly with dashes when entered with spaces', () => {
      const result = formatSSN('123 45 6789');
      expect(result).to.equal('123-45-6789');
    });

    it('should format SSN properly with dashes when fewer than 6 digits are entered', () => {
      const result = formatSSN('1234');
      expect(result).to.equal('123-4');
    });

    it('should format SSN properly with dashes when between 7 and 9 digits are entered', () => {
      const result = formatSSN('1234567');
      expect(result).to.equal('123-45-67');
    });
  });

  describe('isReactComponent', () => {
    it('should return true for function component', () => {
      expect(isReactComponent(() => <div />)).to.be.true;
    });
    it('should return true for class component', () => {
      class MyComponent extends React.Component {
        constructor() {
          super();
          this.state = { test: true };
        }

        render() {
          return <div>{this.state.test}</div>;
        }
      }
      expect(isReactComponent(MyComponent)).to.be.true;
    });
    it('should return true for memoized component', () => {
      expect(isReactComponent(React.memo(() => <div />))).to.be.true;
    });
    it('should return false for regular element', () => {
      expect(isReactComponent(<div />)).to.be.false;
    });
    it('should return false for fragment', () => {
      expect(isReactComponent(<>Test</>)).to.be.false;
    });
    it('should return false for string', () => {
      expect(isReactComponent('Test')).to.be.false;
    });
    it('should return false for number', () => {
      expect(isReactComponent(3)).to.be.false;
    });
    it('should return false for null', () => {
      expect(isReactComponent(null)).to.be.false;
    });
    it('should return false for undefined', () => {
      expect(isReactComponent()).to.be.false;
    });
  });

  describe('displayFileSize', () => {
    it('should display correctly', () => {
      expect(displayFileSize(null)).to.equal('');
      expect(displayFileSize(0)).to.equal('0B');
      expect(displayFileSize(1)).to.equal('1B');
      expect(displayFileSize(1024)).to.equal('1KB');
      expect(displayFileSize(1024 * 1024)).to.equal('1MB');
    });
  });

  describe('pluralize', () => {
    it('should return singular form when count is 1', () => {
      expect(pluralize(1, 'issue')).to.equal('issue');
      expect(pluralize(1, 'child', 'children')).to.equal('child');
      expect(pluralize(1, 'person')).to.equal('person');
    });

    it('should return plural form when count is not 1', () => {
      expect(pluralize(0, 'issue')).to.equal('issues');
      expect(pluralize(2, 'issue')).to.equal('issues');
      expect(pluralize(10, 'issue')).to.equal('issues');
    });

    it('should use custom plural form when provided', () => {
      expect(pluralize(0, 'child', 'children')).to.equal('children');
      expect(pluralize(2, 'child', 'children')).to.equal('children');
      expect(pluralize(0, 'person', 'people')).to.equal('people');
      expect(pluralize(5, 'person', 'people')).to.equal('people');
    });

    it('should default to adding "s" when no plural form provided', () => {
      expect(pluralize(0, 'item')).to.equal('items');
      expect(pluralize(2, 'item')).to.equal('items');
      expect(pluralize(0, 'message')).to.equal('messages');
      expect(pluralize(3, 'message')).to.equal('messages');
    });

    it('should handle edge cases', () => {
      expect(pluralize(-1, 'item')).to.equal('items');
      expect(pluralize(0.5, 'item')).to.equal('items');
      expect(pluralize(1.0, 'item')).to.equal('item');
    });

    it('should handle empty strings', () => {
      expect(pluralize(1, '')).to.equal('');
      expect(pluralize(2, '')).to.equal('s');
    });

    it('should throw error for invalid count parameter', () => {
      expect(() => pluralize('1', 'item')).to.throw(
        'pluralize: count parameter must be a number',
      );
      expect(() => pluralize(null, 'item')).to.throw(
        'pluralize: count parameter must be a number',
      );
      expect(() => pluralize(undefined, 'item')).to.throw(
        'pluralize: count parameter must be a number',
      );
      expect(() => pluralize({}, 'item')).to.throw(
        'pluralize: count parameter must be a number',
      );
    });

    it('should throw error for invalid singular parameter', () => {
      expect(() => pluralize(1, 123)).to.throw(
        'pluralize: singular parameter must be a string',
      );
      expect(() => pluralize(1, null)).to.throw(
        'pluralize: singular parameter must be a string',
      );
      expect(() => pluralize(1, undefined)).to.throw(
        'pluralize: singular parameter must be a string',
      );
      expect(() => pluralize(1, {})).to.throw(
        'pluralize: singular parameter must be a string',
      );
    });

    it('should throw error for invalid plural parameter', () => {
      expect(() => pluralize(1, 'item', 123)).to.throw(
        'pluralize: plural parameter must be a string',
      );
      expect(() => pluralize(1, 'item', null)).to.throw(
        'pluralize: plural parameter must be a string',
      );
      expect(() => pluralize(1, 'item', {})).to.throw(
        'pluralize: plural parameter must be a string',
      );
    });
  });
});
