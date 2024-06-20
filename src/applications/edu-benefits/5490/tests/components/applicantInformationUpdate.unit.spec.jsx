import { expect } from 'chai';
import BenefitSelectionWarning from '../../components/BenefitSelectionWarning';

describe("BenefitSelectionWarning chapter === 'chapter33'", () => {
  let chapter;
  beforeEach(() => {
    chapter = 'chapter33';
  });
  it("should render relationship === 'child'", () => {
    const relationship = 'child';
    const div = BenefitSelectionWarning(chapter, relationship);
    expect(div).to.not.be.null;
  });
  it("should render relationship === 'spouse'", () => {
    const relationship = 'spouse';
    const div = BenefitSelectionWarning(chapter, relationship);
    expect(div).to.not.be.null;
  });
});

describe("BenefitSelectionWarning chapter === 'chapter32'", () => {
  let chapter;
  beforeEach(() => {
    chapter = 'chapter32';
  });
  it("should render relationship === 'child'", () => {
    const relationship = 'child';
    const div = BenefitSelectionWarning(chapter, relationship);
    expect(div).to.not.be.null;
  });
  it("should render relationship === 'spouse'", () => {
    const relationship = 'spouse';
    const div = BenefitSelectionWarning(chapter, relationship);
    expect(div).to.not.be.null;
  });
});
