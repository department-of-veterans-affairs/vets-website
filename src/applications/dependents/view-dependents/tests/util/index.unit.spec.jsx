import ReactTestUtils from 'react-dom/test-utils';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';

import {
  splitPersons,
  isServerError,
  isClientError,
  mask,
} from '../../util/index';

describe('View Dependents splitPersons Utility', () => {
  const mockData = [
    {
      awardIndicator: 'N',
    },
    {
      awardIndicator: 'N',
    },
  ];

  it('should return a populated object with two arrays', () => {
    const data = splitPersons(mockData);

    expect(data.onAward).to.exist;
    expect(data.notOnAward).to.exist;
    expect(data.notOnAward[0].awardIndicator).to.equal('N');
    expect(data.notOnAward[1].awardIndicator).to.equal('N');
  });
});

describe('View Dependents isServerError Utility', () => {
  it('should return true on a 500 error', () => {
    const errorCheck = isServerError(500);

    expect(errorCheck).to.be.true;
  });
});

describe('View Dependents isClientError Utility', () => {
  it('should return true on a 400 error', () => {
    const errorCheck = isClientError(400);

    expect(errorCheck).to.be.true;
  });
});

describe('Mask utility', () => {
  it('should mask all but the last 4 of the SSN', () => {
    const tree = ReactTestUtils.renderIntoDocument(mask('1234-56-7890'));
    const dom = findDOMNode(tree);
    const result = `<span aria-hidden="true">●●●–●●–7890</span><span class="sr-only">ending with 7 8 9 0</span>`;
    expect(dom.innerHTML).to.equal(result);
  });
});
