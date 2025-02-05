import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import formConfig, { arrayBuilderOptions } from '../../config/form';
import manifest from '../../manifest.json';

describe('22-10215 Form Config', () => {
  it('should render', () => {
    expect(formConfig).to.be.an('object');
  });
  it('should have a required properties', () => {
    expect(formConfig.rootUrl).to.contain(manifest.rootUrl);
    expect(formConfig.title).to.contain('Report 85/15 Rule enrollment ratio');
    const { getByText } = render(formConfig.subTitle()); // Render the subTitle component
    expect(
      getByText(
        'Statement of Assurance of Compliance with 85% Enrollment Ratios (VA Form 22-10215)',
      ),
    ).of.exist;
    expect(formConfig).to.have.property('chapters');
  });
  it('should return the correct item name', () => {
    const item = { programName: 'Test Program' };
    expect(arrayBuilderOptions.text.getItemName(item)).to.equal('Test Program');
  });

  it('should return the correct card description', () => {
    const item = {
      programName: 'Test Program',
      supportedFTEPercent: 50,
    };
    const mockGetFTECalcs = sinon.stub().returns({ supportedFTEPercent: 50 });
    global.getFTECalcs = mockGetFTECalcs;
    const description = arrayBuilderOptions.text.cardDescription(item);
    expect(description).to.not.equal('50 supported student FTE');

    mockGetFTECalcs.returns({ supportedFTEPercent: null });
    expect(arrayBuilderOptions.text.cardDescription(item)).to.be.null;

    delete global.getFTECalcs;
  });
});
