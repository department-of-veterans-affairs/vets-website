import { expect } from 'chai';

import { isBrowser } from '../../utils';

describe('health care questionnaire -- utils -- browser check', () => {
  it('window is undefined', () => {
    const window = undefined;
    const result = isBrowser(window);
    expect(result).to.have.property('isWebKit');
    expect(result.isWebKit).to.be.false;
    expect(result).to.have.property('isWebKit');
    expect(result.isMobileSafari).to.be.false;
    expect(result).to.have.property('isMobileSafari');
    expect(result.isIE).to.be.false;
    expect(result).to.have.property('isIE');
  });
  it('navigator is undefined', () => {
    const window = { navigator: undefined };
    const result = isBrowser(window);
    expect(result).to.have.property('isIOS');
    expect(result.isWebKit).to.be.false;
    expect(result).to.have.property('isWebKit');
    expect(result.isMobileSafari).to.be.false;
    expect(result).to.have.property('isMobileSafari');
    expect(result.isIE).to.be.false;
    expect(result).to.have.property('isIE');
  });
  it('navigator is missing userAgent', () => {
    const window = { navigator: {} };

    const result = isBrowser(window);
    expect(result).to.have.property('isIOS');
    expect(result.isWebKit).to.be.false;
    expect(result).to.have.property('isWebKit');
    expect(result.isMobileSafari).to.be.false;
    expect(result).to.have.property('isMobileSafari');
    expect(result.isIE).to.be.false;
    expect(result).to.have.property('isIE');
  });

  it('detects iOS', () => {
    const window = {
      navigator: {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Mobile/15E148 Safari/604.1',
      },
    };

    const result = isBrowser(window);
    expect(result).to.have.property('isIOS');
    expect(result.isIOS).to.be.true;
  });
  it('detects webkit', () => {
    const window = {
      navigator: {
        userAgent:
          'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.83 Safari/537.1',
      },
    };

    const result = isBrowser(window);
    expect(result).to.have.property('isWebKit');
    expect(result.isWebKit).to.be.true;
  });
  it('detects isMobileSafari', () => {
    const window = {
      navigator: {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      },
    };

    const result = isBrowser(window);
    expect(result).to.have.property('isMobileSafari');
    expect(result.isMobileSafari).to.be.true;
  });
  it('detects is not mobile safari', () => {
    const window = {
      navigator: {
        userAgent:
          'Mozilla/5.0 (Linux; {Android Version}; {Build Tag etc.}) AppleWebKit/{WebKit Rev} (KHTML, like Gecko) Chrome/{Chrome Rev} Mobile Safari/{WebKit Rev}',
      },
    };

    const result = isBrowser(window);
    expect(result).to.have.property('isMobileSafari');
    expect(result.isMobileSafari).to.be.false;
  });
  it('detects isIE', () => {
    const window = {
      navigator: {
        msSaveOrOpenBlob: () => {},
      },
    };

    const result = isBrowser(window);
    expect(result).to.have.property('isIE');
    expect(result.isIE).to.be.true;
  });
});
