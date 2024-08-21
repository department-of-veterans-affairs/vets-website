import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '../../../forms-system/src/js/utilities/ui';

import {
  displayFileSize,
  formatSSN,
  isReactComponent,
  customScrollAndFocus,
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

  // Not testing the scroll part of this function
  describe('customScrollAndFocus', () => {
    it('should focus on h3 when no param is passed', () => {
      const { container } = render(
        <>
          <div id="main">
            <div name="topScrollElement" />
            <h1>H1</h1>
            <h2>H2</h2>
            <h3>H3</h3>
          </div>
        </>,
      );

      const h3 = $('h3', container);
      customScrollAndFocus();

      waitFor(() => {
        expect(document.activeElement).to.eq(h3);
      });
    });
    it('should focus when passed a string selector', () => {
      const { container } = render(
        <>
          <div id="main">
            <div name="topScrollElement" />
            <h1>H1</h1>
            <h2>H2</h2>
            <h3>H3</h3>
          </div>
        </>,
      );
      customScrollAndFocus('h2');

      const h2 = $('h2', container);
      waitFor(() => {
        expect(document.activeElement).to.eq(h2);
      });
    });
    it('should call function when passed a function', () => {
      const spy = sinon.spy();
      customScrollAndFocus(spy);
      waitFor(() => {
        expect(spy.called).to.be.true;
      });
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
});
