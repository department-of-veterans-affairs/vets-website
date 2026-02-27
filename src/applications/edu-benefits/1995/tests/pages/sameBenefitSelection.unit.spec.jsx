import { expect } from 'chai';
import { sameBenefitSelectionPage } from '../../pages/mebQuestionnaire';

describe('sameBenefitSelectionPage', () => {
  it('should correctly display for unauthenticated users choosing same-benefit without a pre-filled current benefit', () => {
    const { uiSchema, schema } = sameBenefitSelectionPage();

    // Verify schema has required field
    expect(schema.type).to.equal('object');
    expect(schema.required).to.include('mebSameBenefitSelection');

    // Verify the field exists in properties
    expect(schema.properties.mebSameBenefitSelection).to.exist;
    expect(schema.properties.mebSameBenefitSelection.type).to.equal('string');

    // Verify UI schema configuration
    expect(
      uiSchema.mebSameBenefitSelection['ui:title'].props.children,
    ).to.equal('Which benefit have you most recently used?');
    expect(uiSchema.mebSameBenefitSelection['ui:widget']).to.equal('radio');
  });

  it('should correctly define the required mebSameBenefitSelection field with all enum options', () => {
    const { schema } = sameBenefitSelectionPage();

    // Verify required field
    expect(schema.required).to.deep.equal(['mebSameBenefitSelection']);

    // Verify enum values
    expect(schema.properties.mebSameBenefitSelection.enum).to.deep.equal([
      'chapter33',
      'chapter30',
      'chapter1606',
      'transferOfEntitlement',
      'chapter35',
      'fryScholarship',
    ]);

    // Verify enum names
    expect(schema.properties.mebSameBenefitSelection.enumNames).to.deep.equal([
      'Post-9/11 GI Bill (PGIB, Chapter 33)',
      'Montgomery GI Bill Active Duty (MGIB-AD, Chapter 30)',
      'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
      'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
      "Survivors' and Dependents' Educational Assistance (DEA, Chapter 35)",
      'Fry Scholarship (Chapter 33)',
    ]);

    // Verify field type
    expect(schema.properties.mebSameBenefitSelection.type).to.equal('string');
  });

  it('should have radio widget configured', () => {
    const { uiSchema } = sameBenefitSelectionPage();

    expect(uiSchema.mebSameBenefitSelection['ui:widget']).to.equal('radio');
  });

  it('should display required field description', () => {
    const { uiSchema } = sameBenefitSelectionPage();
    const Description = uiSchema.mebSameBenefitSelection['ui:description'];

    expect(Description).to.exist;
  });
});
