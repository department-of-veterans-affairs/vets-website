import { expect } from 'chai';
import { parseRepType } from '../../utilities/helpers';

describe('parseRepType', () => {
  it('should return correct title and subtitle for Organization', () => {
    const result = parseRepType('Organization');
    expect(result.title).to.equal('Veterans Service Organization (VSO)');
    expect(result.subTitle).to.equal('Veteran Service Organization');
  });

  it('should return correct title and subtitle for Attorney', () => {
    const result = parseRepType('Attorney');
    expect(result.title).to.equal('accredited attorney');
    expect(result.subTitle).to.equal('Accredited attorney');
  });

  it('should return correct title and subtitle for Claims Agent', () => {
    const result = parseRepType('Claims Agent');
    expect(result.title).to.equal('accredited claims agent');
    expect(result.subTitle).to.equal('Accredited claims agent');
  });

  it('should return default title and subtitle for unknown type', () => {
    const result = parseRepType('Random Type');
    expect(result.title).to.equal('accredited representative');
    expect(result.subTitle).to.equal('Accredited representative');
  });
});
