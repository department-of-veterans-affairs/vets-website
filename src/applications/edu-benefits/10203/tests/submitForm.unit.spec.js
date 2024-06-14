import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from 'platform/forms-system/src/js/actions';
import * as helpers from 'platform/forms-system/src/js/helpers';
import { get } from 'lodash';
import submitForm from '../submitForm';

describe('submitForm', () => {
  let form;
  let formConfig;
  let submitToUrlStub;
  let transformForSubmitStub;
  let sandbox;

  beforeEach(() => {
    form = {
      data: {
        'view:benefit': { benefit1: true, benefit2: false, benefit3: true },
        isEnrolledStem: true,
        isPursuingTeachingCert: false,
        benefitLeft: 'someValue',
        degreeName: 'someDegree',
        schoolName: 'someSchool',
        schoolCity: 'someCity',
        schoolState: 'someState',
        isActiveDuty: true,
        preferredContactMethod: 'email',
        bankAccount: { accountType: 'checking' },
      },
    };

    formConfig = {
      submitUrl: 'test-url',
      trackingPrefix: 'test-prefix',
      transformForSubmit: null,
    };

    sandbox = sinon.createSandbox();
    submitToUrlStub = sandbox
      .stub(actions, 'submitToUrl')
      .returns(Promise.resolve());
    transformForSubmitStub = sandbox
      .stub(helpers, 'transformForSubmit')
      .returns({});
    sandbox.stub({ get }, 'get').returns('none');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create correct eventData and call submitToUrl with it', async () => {
    await submitForm(form, formConfig);

    expect(transformForSubmitStub.calledWith(formConfig, form)).to.be.true;

    const expectedEventData = {
      'edu-benefits-currently-used': 'benefit1 benefit3',
      'edu-currently-enrolled': 'No',
      'edu-pursuing-teaching-certification': 'Yes',
    };
    expect(
      submitToUrlStub.calledWith(
        sinon.match.any,
        formConfig.submitUrl,
        formConfig.trackingPrefix,
        sinon.match(expectedEventData),
      ),
    ).to.be.false;
  });
  it('should correctly set edu-currently-enrolled based on isEnrolledStem', async () => {
    form.data.isEnrolledStem = true;
    await submitForm(form, formConfig);
    let eventData = submitToUrlStub.firstCall.args[3];
    expect(eventData['edu-currently-enrolled']).to.equal('Yes');

    form.data.isEnrolledStem = false;
    await submitForm(form, formConfig);
    eventData = submitToUrlStub.secondCall.args[3];
    expect(eventData['edu-currently-enrolled']).to.equal('No');
  });
  it('should correctly set edu-pursuing-teaching-certification based on isPursuingTeachingCert', async () => {
    form.data.isPursuingTeachingCert = true;
    await submitForm(form, formConfig);
    let eventData = submitToUrlStub.firstCall.args[3];
    expect(eventData['edu-pursuing-teaching-certification']).to.equal('Yes');

    form.data.isPursuingTeachingCert = false;
    await submitForm(form, formConfig);
    eventData = submitToUrlStub.secondCall.args[3];
    expect(eventData['edu-pursuing-teaching-certification']).to.equal('No');
  });

  it('should correctly set active-duty based on isActiveDuty', async () => {
    form.data.isActiveDuty = true;
    await submitForm(form, formConfig);
    let eventData = submitToUrlStub.firstCall.args[3];
    expect(eventData['active-duty']).to.equal('Yes');

    form.data.isActiveDuty = false;
    await submitForm(form, formConfig);
    eventData = submitToUrlStub.secondCall.args[3];
    expect(eventData['active-duty']).to.equal('No');
  });
});
