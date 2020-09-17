import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { SAVED_SEPARATION_DATE } from '../../constants';
import { UpdateMilitaryHistory } from '../../components/UpdateMilitaryHistory';

describe('UpdateMilitaryHistory', () => {
  let wrapper;
  let oldSessionStorage;
  let storage = {};
  const servicePeriods = (to = '2020-12-31') => [
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
      separationDate: '2021-01-30',
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal([
          ...servicePeriods(),
          {
            serviceBranch: '',
            dateRange: {
              from: '',
              to: '2021-01-30',
            },
          },
        ]);
        expect(form.data.serviceInformation.servicePeriods).to.have.lengthOf(2);
      },
    });
  });
  it('should add separation date to an existing "empty" entry', () => {
    const separationDate = '2021-01-30';
    setUp({
      separationDate,
      to: '', // Add empty "to" date in prefill
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal(
          servicePeriods(separationDate),
        );
        expect(form.data.serviceInformation.servicePeriods).to.have.lengthOf(1);
      },
    });
  });
  it('should not add a duplicate separation date', () => {
    const separationDate = '2021-01-30';
    setUp({
      separationDate,
      to: separationDate, // Separation date already in prefill
      callback: () => {
        expect(form.data.serviceInformation.servicePeriods).to.deep.equal(
          servicePeriods(separationDate),
        );
        expect(form.data.serviceInformation.servicePeriods).to.have.lengthOf(1);
      },
    });
  });
});
