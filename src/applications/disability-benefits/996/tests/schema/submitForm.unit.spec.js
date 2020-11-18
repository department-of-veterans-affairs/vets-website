import { expect } from 'chai';

import formConfig from '../../config/form';

const getFormData = (sameOffice, informalConference) => ({
  data: {
    sameOffice,
    informalConference,
    informalConferenceTimes: [],
  },
});

const getEvent = (result, office, conf) => ({
  event: `${formConfig.trackingPrefix}-submission${result}`,
  'decision-reviews-differentOffice': office,
  'decision-reviews-informalConf': conf,
});

describe('HLR submit form', () => {
  it('should record a submission attempt & failed attempt', done => {
    const config = {
      ...formConfig,
      submitUrl: '', // something that will always fail
    };
    formConfig.submit(getFormData(false, 'no'), config).finally(() => {
      expect(global.window.dataLayer[0]).to.deep.equal(
        getEvent('-failed', 'no', 'no'),
      );
      done();
    });
  });
  it('should record a submission attempt & failed attempt with different data', done => {
    const config = {
      ...formConfig,
      submitUrl: '', // something that will always fail
    };
    formConfig.submit(getFormData(true, 'yes'), config).finally(() => {
      expect(global.window.dataLayer[0]).to.deep.equal(
        getEvent('-failed', 'yes', 'yes'),
      );
      done();
    });
  });
  it('should record a submission attempt & failed attempt with different data', done => {
    const config = {
      ...formConfig,
      submitUrl: '', // something that will always fail
    };
    formConfig.submit(getFormData(true, 'rep'), config).finally(() => {
      expect(global.window.dataLayer[0]).to.deep.equal(
        getEvent('-failed', 'yes', 'yes-with-rep'),
      );
      done();
    });
  });
  // TODO: Test successful XMLHttpRequest
});
