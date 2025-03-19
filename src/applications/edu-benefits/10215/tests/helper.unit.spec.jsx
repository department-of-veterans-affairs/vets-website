// src/applications/edu-benefits/10215/helpers.test.js
import { expect } from 'chai';
import { childContent, getFTECalcs } from '../helpers';

describe('getFTECalcs', () => {
  it('should return correct FTE calculations for supported and non-supported values', () => {
    const program = { fte: { supported: 5, nonSupported: 15 } };
    const result = getFTECalcs(program);
    expect(result).to.deep.equal({
      supported: 5,
      nonSupported: 15,
      total: 20,
      supportedFTEPercent: '25%',
    });
  });

  it('should handle zero supported and non-supported values', () => {
    const program = { fte: { supported: 0, nonSupported: 0 } };
    const result = getFTECalcs(program);
    expect(result).to.deep.equal({
      supported: 0,
      nonSupported: 0,
      total: 0,
      supportedFTEPercent: null,
    });
  });

  it('should handle only supported values', () => {
    const program = { fte: { supported: 10, nonSupported: 0 } };
    const result = getFTECalcs(program);
    expect(result).to.deep.equal({
      supported: 10,
      nonSupported: 0,
      total: 10,
      supportedFTEPercent: '100%',
    });
  });

  it('should handle only non-supported values', () => {
    const program = { fte: { supported: 0, nonSupported: 10 } };
    const result = getFTECalcs(program);
    expect(result).to.deep.equal({
      supported: 0,
      nonSupported: 10,
      total: 10,
      supportedFTEPercent: null,
    });
  });

  it('should return null for supportedFTEPercent when total is NaN', () => {
    const program = { fte: { supported: null, nonSupported: null } };
    const result = getFTECalcs(program);
    expect(result).to.deep.equal({
      supported: 0,
      nonSupported: 0,
      total: 0,
      supportedFTEPercent: null,
    });
  });
  it('should render the pdf download link', () => {
    const downloadLink = 'Download Link';
    const goBack = () => {};
    const content = childContent(downloadLink, goBack);
    expect(content.props.children[0].props.children[1]).to.exist;
  });
});
