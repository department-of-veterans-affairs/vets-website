import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from 'platform/forms-system/src/js/actions';
import * as helpers from 'platform/forms-system/src/js/helpers';
import { get } from 'lodash';
import submitForm from '../../config/submitForm';
import { transform } from '../../../0993/helpers';

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
  it('should create correct eventData and call submitToUrl with it use transformForSubmit', async () => {
    formConfig = {
      transformForSubmit: transform,
    };
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
});
