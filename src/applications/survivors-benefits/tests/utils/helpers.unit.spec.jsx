import { expect } from 'chai';
import sinon from 'sinon';
import {
  servedDuringWartime,
  durationInDays,
  formatCurrency,
  formatFullName,
  isHomeAcreageMoreThanTwo,
  getJobTitleOrType,
  obfuscateAccountNumber,
  isProductionEnv,
  showMultiplePageResponse,
  addStyleToShadowDomOnPages,
} from '../../utils/helpers';

describe('534 EZ Form Helper Utils', () => {
  it('durationInDays should calculate days between two dates', () => {
    const days = durationInDays('2022-01-01', '2022-01-31');
    expect(days).to.equal(30);
  });

  it('durationInDays should handle same start and end date', () => {
    const startDate = '2024-06-15';
    const endDate = '2024-06-15';
    const result = durationInDays(startDate, endDate);
    expect(result).to.equal(0);
  });

  it('durationInDays should handle end date before start date', () => {
    const startDate = '2024-12-01';
    const endDate = '2024-11-30';
    const result = durationInDays(startDate, endDate);
    expect(result).to.equal(-1);
  });

  it('servedDuringWartime should return if vet served during wartime', () => {
    const warDates = {
      beforeWWII: { from: '1914-07-28', to: '1918-11-11' },
      wwii: { from: '1941-12-07', to: '1946-12-31' },
      korea: { from: '1950-06-25', to: '1955-01-31' },
      vietnam: { from: '1964-08-05', to: '1975-05-07' },
      gulfWar: { from: '1990-08-02', to: 'present' },
    };

    // Test case: Served during WWII
    expect(servedDuringWartime(warDates.wwii)).to.be.true;

    // Test case: Served before WWII
    expect(servedDuringWartime(warDates.beforeWWII)).to.be.true;

    // Test case: Served during Vietnam War
    expect(servedDuringWartime(warDates.vietnam)).to.be.true;

    // Test case: Served outside wartime periods
    expect(servedDuringWartime({ from: '1980-01-01', to: '1981-01-01' })).to.be
      .false;
  });

  it('formatCurrency should format number as currency string', () => {
    expect(formatCurrency(1000)).to.equal('$1,000');
    expect(formatCurrency(1234567.89)).to.equal('$1,234,567.89');
    expect(formatCurrency(0)).to.equal('$0');
  });

  it('formatFullName should format full name correctly', () => {
    const nameObj = {
      first: 'John',
      middle: 'H.',
      last: 'Doe',
      suffix: 'Jr.',
    };
    expect(formatFullName(nameObj)).to.equal('John H. Doe Jr.');

    const nameObjNoMiddle = {
      first: 'Jane',
      last: 'Smith',
    };
    expect(formatFullName(nameObjNoMiddle)).to.equal('Jane Smith');

    const emptyNameObj = { first: '', middle: '', last: '', suffix: '' };
    expect(formatFullName(emptyNameObj)).to.equal('');
    expect(formatFullName({})).to.equal('');
  });

  it('isHomeAcreageMoreThanTwo returns true if home acreage is more than two', () => {
    expect(
      isHomeAcreageMoreThanTwo({
        homeOwnership: true,
        homeAcreageMoreThanTwo: true,
      }),
    ).to.be.true;
  });

  it('getJobTitleOrType returns job title or type', () => {
    expect(
      getJobTitleOrType({ jobTitle: 'Engineer', jobType: 'Full-time' }),
    ).to.equal('Engineer');
    expect(getJobTitleOrType({ jobTitle: '', jobType: 'Part-time' })).to.equal(
      'Part-time',
    );
    expect(getJobTitleOrType({})).to.equal('');
  });

  it('obfuscateAccountNumber should obfuscate all but last 4 digits', () => {
    expect(obfuscateAccountNumber('123456789')).to.equal('*****6789');
    expect(obfuscateAccountNumber('9876543210')).to.equal('******3210');
  });

  it('isProductionEnv should return true only in production environment', () => {
    const result = isProductionEnv();
    // Since tests run in non-production, expect false
    expect(result).to.be.false;
  });

  it('showMultiplePageResponse should return correct boolean from sessionStorage', () => {
    window.sessionStorage.setItem('showMultiplePageResponse', 'true');
    expect(showMultiplePageResponse()).to.be.true;

    window.sessionStorage.setItem('showMultiplePageResponse', 'false');
    expect(showMultiplePageResponse()).to.be.false;
  });

  it('addStyleToShadowDomOnPages injects a stylesheet', async () => {
    const host = document.createElement('va-select');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });
    shadowRoot.adoptedStyleSheets = [];

    // Spy on push to confirm a stylesheet is injected
    const pushSpy = sinon.spy(shadowRoot.adoptedStyleSheets, 'push');

    // Stub a minimal CSSStyleSheet since jsdom doesn't implement adoptedStyleSheets;
    // replaceSync is a harmless no-op here just to satisfy the helper's usage
    const originalCSSStyleSheet = global.CSSStyleSheet;
    // Temporarily override global.CSSStyleSheet for test stubbing (restores at the end)
    global.CSSStyleSheet = function CSSStyleSheet() {
      return { replaceSync() {} };
    };

    try {
      await addStyleToShadowDomOnPages([''], ['va-select'], 'p{color:red}');
      await new Promise(r => setTimeout(r, 0));
      expect(pushSpy.calledOnce).to.be.true;
    } finally {
      pushSpy.restore();
      // restores original CSSStyleSheet
      global.CSSStyleSheet = originalCSSStyleSheet;
      document.body.removeChild(host);
    }
  });
});
