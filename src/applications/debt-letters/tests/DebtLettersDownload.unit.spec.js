import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import DebtLettersDownload from '../components/DebtLettersDownload';

describe('DebtLettersDownload', () => {
  const fakeStore = {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
      debtLetters: {
        isFetching: false,
        debts: [],
        debtLinks: [
          {
            documentId: '{70412535-E39E-4202-B24E-2751D9FBC874}',
            docType: '194',
            typeDescription: 'First Demand Letter',
            receivedAt: '2020-05-01',
            date: '2020-05-01',
          },
          {
            documentId: '{64B0BDC4-D40C-4C54-86E0-104C987B8D8F}',
            docType: '1213',
            typeDescription: 'Second Demand Letter',
            receivedAt: '2020-05-02',
            date: '2020-05-02',
          },
        ],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  it('renders correct number of debt rows', () => {
    const wrapper = mount(
      <MemoryRouter>
        <DebtLettersDownload store={fakeStore} />
      </MemoryRouter>,
    );

    expect(wrapper.find(`DebtLettersTable`).length).to.equal(1);
    expect(wrapper.find(`DebtLettersTable`).find(`li`).length).to.equal(2);
    expect(
      wrapper
        .find(`DebtLettersTable`)
        .find(`li`)
        .at(0)
        .text(),
    ).to.equal(
      'May 2, 2020 - Second Demand Letter Download Second Demand Letter datedMay 2, 2020(PDF)',
    );
    expect(
      wrapper
        .find(`DebtLettersTable`)
        .find(`li`)
        .at(1)
        .text(),
    ).to.equal(
      'May 1, 2020 - First Demand Letter Download First Demand Letter datedMay 1, 2020(PDF)',
    );
    wrapper.unmount();
  });
});
