import { expect } from 'chai';
import sinon from 'sinon';
import {
  formatDate,
  getStatus,
  extractMessages,
  pickStatusStyle,
  getCurrentStepFromStateList,
  downloadPdfBlob,
} from '../../helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    it('should format ISO date string with Z suffix', () => {
      const result = formatDate('1901-09-11Z');
      expect(result).to.equal('September 11, 1901');
    });

    it('should format ISO date string without Z suffix', () => {
      const result = formatDate('1941-12-05');
      expect(result).to.equal('December 5, 1941');
    });

    it('should handle various date formats with Z', () => {
      const testCases = [
        { input: '2025-08-04Z', expected: 'August 4, 2025' },
        { input: '2023-04-01Z', expected: 'April 1, 2023' },
        { input: '2025-02-07Z', expected: 'February 7, 2025' },
        { input: '2000-01-01Z', expected: 'January 1, 2000' },
        { input: '1999-12-31Z', expected: 'December 31, 1999' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(formatDate(input)).to.equal(expected);
      });
    });

    it('should return empty string for falsy inputs', () => {
      const falsyInputs = [null, undefined, '', false, 0, NaN];

      falsyInputs.forEach(input => {
        expect(formatDate(input)).to.equal('N/A');
      });
    });
  });
  describe('extractMessages', () => {
    it('returns code when present (priority: code > title > detail)', () => {
      const resp = {
        errors: [
          {
            code: 'RES_CH31_ELIGIBILITY_503',
            title: 'Service Unavailable',
            detail: 'Down',
          },
        ],
      };
      expect(extractMessages(resp)).to.deep.equal(['RES_CH31_ELIGIBILITY_503']);
    });

    it('falls back to title when code is missing', () => {
      const resp = { errors: [{ title: 'Bad Request', detail: 'Invalid' }] };
      expect(extractMessages(resp)).to.deep.equal(['Bad Request']);
    });

    it('falls back to detail when only detail is present', () => {
      const resp = { errors: [{ detail: 'Not Authorized' }] };
      expect(extractMessages(resp)).to.deep.equal(['Not Authorized']);
    });

    it('maps multiple errors using the same priority logic', () => {
      const resp = {
        errors: [
          {
            code: 'RES_CH31_ELIGIBILITY_400',
            title: 'Bad Request',
            detail: 'x',
          },
          { title: 'Forbidden', detail: 'Not Authorized' },
          { detail: 'Service Unavailable' },
        ],
      };
      expect(extractMessages(resp)).to.deep.equal([
        'RES_CH31_ELIGIBILITY_400',
        'Forbidden',
        'Service Unavailable',
      ]);
    });

    it('returns ["Unknown error"] when errors array is empty', () => {
      const resp = { errors: [] };
      expect(extractMessages(resp)).to.deep.equal(['Unknown error']);
    });

    it('returns ["Unknown error"] when errors is not an array', () => {
      const resp = { errors: {} };
      expect(extractMessages(resp)).to.deep.equal(['Unknown error']);
    });

    it('returns ["Unknown error"] when resp is null/undefined', () => {
      expect(extractMessages(null)).to.deep.equal(['Unknown error']);
      expect(extractMessages(undefined)).to.deep.equal(['Unknown error']);
    });
  });

  describe('getStatus', () => {
    it('coerces numeric string status to number', () => {
      const resp = { errors: [{ status: '503' }] };
      expect(getStatus(resp)).to.equal(503);
    });

    it('returns number when status is numeric', () => {
      const resp = { errors: [{ status: 400 }] };
      expect(getStatus(resp)).to.equal(400);
    });

    it('returns null when status is non-numeric', () => {
      const resp = { errors: [{ status: 'abc' }] };
      expect(getStatus(resp)).to.equal(null);
    });

    it('returns null when errors array is empty', () => {
      const resp = { errors: [] };
      expect(getStatus(resp)).to.equal(null);
    });

    it('returns null when errors is not an array', () => {
      const resp = { errors: {} };
      expect(getStatus(resp)).to.equal(null);
    });

    it('returns null when resp is null/undefined', () => {
      expect(getStatus(null)).to.equal(null);
      expect(getStatus(undefined)).to.equal(null);
    });
  });
  describe('pickStatusStyle', () => {
    it('returns check/green for "Eligible"', () => {
      expect(pickStatusStyle('Eligible')).to.deep.equal({
        icon: 'check',
        cls: 'vads-u-color--green',
      });
    });

    it('is case-insensitive and trims whitespace', () => {
      expect(pickStatusStyle('  eLiGiBlE  ')).to.deep.equal({
        icon: 'check',
        cls: 'vads-u-color--green',
      });
    });

    it('returns close/secondary-dark for "Ineligible"', () => {
      expect(pickStatusStyle('Ineligible')).to.deep.equal({
        icon: 'close',
        cls: 'vads-u-color--secondary-dark',
      });
    });

    it('treats unknown or falsy values as ineligible (fallback)', () => {
      for (const v of [undefined, null, '', '  ', 'unknown', 0]) {
        expect(pickStatusStyle(v)).to.deep.equal({
          icon: 'close',
          cls: 'vads-u-color--secondary-dark',
        });
      }
    });
  });
});

describe('getCurrentStepFromStateList', () => {
  const TOTAL = 7;

  it('returns 1 when stateList is not an array', () => {
    expect(getCurrentStepFromStateList(null, TOTAL)).to.equal(1);
    expect(getCurrentStepFromStateList(undefined, TOTAL)).to.equal(1);
    expect(getCurrentStepFromStateList({}, TOTAL)).to.equal(1);
  });

  it('returns 1 when stateList is an empty array', () => {
    expect(getCurrentStepFromStateList([], TOTAL)).to.equal(1);
  });

  it('prefers ACTIVE and returns its (1-based) step number', () => {
    const stateList = [
      { stepCode: 'APPL', status: 'COMPLETE' }, // step 1
      { stepCode: 'ELGLDET', status: 'ACTIVE' }, // step 2
      { stepCode: 'ORICMPT', status: 'PENDING' }, // step 3
    ];

    expect(getCurrentStepFromStateList(stateList, TOTAL)).to.equal(2);
  });

  it('returns the first ACTIVE even if a PENDING appears earlier (ACTIVE takes precedence)', () => {
    const stateList = [
      { stepCode: 'APPL', status: 'PENDING' }, // step 1 pending
      { stepCode: 'ELGLDET', status: 'ACTIVE' }, // step 2 active
      { stepCode: 'ORICMPT', status: 'PENDING' }, // step 3 pending
    ];

    expect(getCurrentStepFromStateList(stateList, TOTAL)).to.equal(2);
  });

  it('when no ACTIVE exists, focuses the first PENDING step (1-based)', () => {
    const stateList = [
      { stepCode: 'APPL', status: 'COMPLETE' }, // step 1 complete
      { stepCode: 'ELGLDET', status: 'PENDING' }, // step 2 pending
      { stepCode: 'ORICMPT', status: 'PENDING' }, // step 3 pending
    ];

    expect(getCurrentStepFromStateList(stateList, TOTAL)).to.equal(2);
  });

  it('returns 1 when the first step is PENDING (no ACTIVE)', () => {
    const stateList = [
      { stepCode: 'APPL', status: 'PENDING' }, // step 1 pending
      { stepCode: 'ELGLDET', status: 'PENDING' },
    ];

    expect(getCurrentStepFromStateList(stateList, TOTAL)).to.equal(1);
  });

  it('returns total when there is no ACTIVE and no PENDING (assume all complete)', () => {
    const stateList = [
      { stepCode: 'APPL', status: 'COMPLETE' },
      { stepCode: 'ELGLDET', status: 'COMPLETE' },
      { stepCode: 'ORICMPT', status: 'COMPLETE' },
    ];

    expect(getCurrentStepFromStateList(stateList, TOTAL)).to.equal(TOTAL);
  });

  it('caps the returned value at total (ACTIVE beyond total)', () => {
    const smallTotal = 2;
    const stateList = [
      { stepCode: 'APPL', status: 'COMPLETE' }, // step 1
      { stepCode: 'ELGLDET', status: 'COMPLETE' }, // step 2
      { stepCode: 'ORICMPT', status: 'ACTIVE' }, // step 3 => should cap to total=2
    ];

    expect(getCurrentStepFromStateList(stateList, smallTotal)).to.equal(2);
  });

  it('caps the returned value at total (PENDING beyond total)', () => {
    const smallTotal = 2;
    const stateList = [
      { stepCode: 'APPL', status: 'COMPLETE' }, // step 1
      { stepCode: 'ELGLDET', status: 'COMPLETE' }, // step 2
      { stepCode: 'ORICMPT', status: 'PENDING' }, // step 3 => should cap to total=2
    ];

    expect(getCurrentStepFromStateList(stateList, smallTotal)).to.equal(2);
  });

  it('handles items with missing/null status safely', () => {
    const stateList = [
      { stepCode: 'APPL' }, // no status
      null,
      { stepCode: 'ORICMPT', status: 'PENDING' }, // first real pending is index 2 => step 3
    ];

    expect(getCurrentStepFromStateList(stateList, TOTAL)).to.equal(3);
  });

  it('returns total even if list contains statuses that are neither ACTIVE nor PENDING', () => {
    const stateList = [
      { stepCode: 'APPL', status: 'COMPLETE' },
      { stepCode: 'ELGLDET', status: 'COMPLETED' }, // note: not handled by function
      { stepCode: 'ORICMPT', status: 'DONE' },
    ];

    expect(getCurrentStepFromStateList(stateList, TOTAL)).to.equal(TOTAL);
  });
});

describe('downloadPdfBlob', () => {
  let createObjectURLStub;
  let revokeObjectURLStub;
  let createElementStub;
  let appendChildStub;
  let removeChildStub;
  let mockLink;

  beforeEach(() => {
    mockLink = {
      href: '',
      download: '',
      click: sinon.stub(),
    };

    createObjectURLStub = sinon
      .stub(URL, 'createObjectURL')
      .returns('blob:mock-url');
    revokeObjectURLStub = sinon.stub(URL, 'revokeObjectURL');

    const originalCreateElement = document.createElement.bind(document);
    createElementStub = sinon
      .stub(document, 'createElement')
      .callsFake(tagName => {
        if (tagName === 'a') {
          return mockLink;
        }
        return originalCreateElement(tagName);
      });

    const originalAppendChild = document.body.appendChild.bind(document.body);
    const originalRemoveChild = document.body.removeChild.bind(document.body);
    appendChildStub = sinon
      .stub(document.body, 'appendChild')
      .callsFake(child => {
        if (child === mockLink) {
          return child;
        }
        return originalAppendChild(child);
      });
    removeChildStub = sinon
      .stub(document.body, 'removeChild')
      .callsFake(child => {
        if (child === mockLink) {
          return child;
        }
        return originalRemoveChild(child);
      });
  });

  afterEach(() => {
    if (createObjectURLStub) createObjectURLStub.restore();
    if (revokeObjectURLStub) revokeObjectURLStub.restore();
    if (createElementStub) createElementStub.restore();
    if (appendChildStub) appendChildStub.restore();
    if (removeChildStub) removeChildStub.restore();
  });

  it('creates a link, triggers download, and cleans up', () => {
    const blob = new Blob(['pdf content'], { type: 'application/pdf' });

    downloadPdfBlob(blob, 'test.pdf');

    expect(createObjectURLStub.calledWith(blob)).to.equal(true);
    expect(createElementStub.calledWith('a')).to.equal(true);
    expect(mockLink.href).to.equal('blob:mock-url');
    expect(mockLink.download).to.equal('test.pdf');
    expect(appendChildStub.calledWith(mockLink)).to.equal(true);
    expect(mockLink.click.calledOnce).to.equal(true);
    expect(removeChildStub.calledWith(mockLink)).to.equal(true);
    expect(revokeObjectURLStub.calledWith('blob:mock-url')).to.equal(true);
  });
});
