import { expect } from 'chai';
import formConfig from '../../config/form';

describe('21-8940 form config', () => {
  it('should have correct formId and title', () => {
    expect(formConfig.formId).to.equal('21-8940');
    expect(formConfig.title).to.match(
      /Veteran's application for increased compensation/i,
    );
  });

  it('should define chapters', () => {
    expect(formConfig.chapters).to.be.an('object');
    expect(Object.keys(formConfig.chapters).length).to.be.greaterThan(5);
  });

  it('should include a transformForSubmit function', () => {
    expect(formConfig.transformForSubmit).to.be.a('function');
  });

  it('should have saveInProgress messages', () => {
    expect(formConfig.saveInProgress?.messages?.inProgress).to.be.a('string');
  });

  it('should have introduction and confirmation containers', () => {
    expect(formConfig.introduction).to.exist;
    expect(formConfig.confirmation).to.exist;
  });

  it('evaluates conditional pages for doctor and hospital information', () => {
    const doctorDepends =
      formConfig.chapters.sectionTwoP1Chapter.pages.doctorInformationPage
        .depends;
    const hospitalDepends =
      formConfig.chapters.sectionTwoP1Chapter.pages.hospitalInformationPage
        .depends;

    expect(
      doctorDepends({ doctorCareQuestion: { hasReceivedDoctorCare: true } }),
    ).to.be.true;
    expect(
      doctorDepends({ doctorCareQuestion: { hasReceivedDoctorCare: false } }),
    ).to.be.false;

    expect(
      hospitalDepends({
        hospitalizationQuestion: { hasBeenHospitalized: true },
      }),
    ).to.be.true;
    expect(
      hospitalDepends({
        hospitalizationQuestion: { hasBeenHospitalized: false },
      }),
    ).to.be.false;
  });
});
