import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';

import { SAVED_SEPARATION_DATE } from '../../constants';
import { UpdateMilitaryHistory } from '../../components/UpdateMilitaryHistory';

const inRangeBddDate = moment()
  .add(120, 'days')
  .format('YYYY-MM-DD');

const inRangeBddDate2 = moment()
  .add(100, 'days')
  .format('YYYY-MM-DD');

describe('UpdateMilitaryHistory', () => {
  let wrapper;
  let oldSessionStorage;
  let storage = {};
  const servicePeriods = (to = inRangeBddDate2) => [
    {
      serviceBranch: 'Army',
      dateRange: {
        from: '2015-12-31',
        to,
      },
    },
  ];
  const form = {
    data: {
      serviceInformation: {
        servicePeriods: [],
      },
    },
  };

  function setUp({ separationDate = '', to, callback }) {
    form.data.serviceInformation.servicePeriods = servicePeriods(to);
    const setFormData = data => {
      form.data = data;
    };
    oldSessionStorage = window.sessionStorage;
    delete window.sessionStorage;
    window.sessionStorage = {
      getItem: key => storage[key] || null,
      setItem: (key, value) => {
        storage[key] = value;
      },
      removeItem: key => delete storage[key],
    };
    if (separationDate) {
      window.sessionStorage.setItem(SAVED_SEPARATION_DATE, separationDate);
    }
    wrapper = mount(
      <UpdateMilitaryHistory form={form} setFormData={setFormData} />,
    );
    callback();
  }

  afterEach(() => {
    window.sessionStorage = oldSessionStorage;
    storage = {};
    wrapper.unmount();
    form.data.serviceInformation.servicePeriods = [];
  });

  it('should get called', () => {
    setUp({
      separationDate: '', // don't add separation date to sessionStorage
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal(
          servicePeriods(),
        );
      },
    });
  });
  it('should update the form data', () => {
    setUp({
      separationDate: inRangeBddDate,
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal([
          ...servicePeriods(),
          {
            serviceBranch: '',
            dateRange: {
              from: '',
              to: inRangeBddDate,
            },
          },
        ]);
        expect(form.data.serviceInformation.servicePeriods).to.have.lengthOf(2);
        expect(form.data['view:isBddData']).to.be.true;
      },
    });
  });
  it('should add separation date to an existing "empty" entry', () => {
    setUp({
      separationDate: inRangeBddDate,
      to: '', // Add empty "to" date in prefill
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal(
          servicePeriods(inRangeBddDate),
        );
        expect(form.data.serviceInformation.servicePeriods).to.have.lengthOf(1);
        expect(form.data['view:isBddData']).to.be.true;
      },
    });
  });
  it('should not add a duplicate separation date', () => {
    setUp({
      separationDate: inRangeBddDate,
      to: inRangeBddDate, // Separation date already in prefill
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal(
          servicePeriods(inRangeBddDate),
        );
        expect(form.data.serviceInformation.servicePeriods).to.have.lengthOf(1);
        expect(form.data['view:isBddData']).to.be.true;
      },
    });
  });
});
