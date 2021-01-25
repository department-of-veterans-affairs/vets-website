import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DebtLettersList from '../components/DebtLettersList';

describe('DebtLettersList', () => {
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
            documentId: '{64B0BDC4-D40C-4C54-86E0-104C987B8D8F}',
            docType: '1213',
            typeDescription: 'Second Demand Letter',
            receivedAt: '2020-05-29',
          },
          {
            documentId: '{70412535-E39E-4202-B24E-2751D9FBC874}',
            docType: '194',
            typeDescription: 'First Demand Letter',
            receivedAt: '2020-05-29',
          },
          {
            documentId: '{3626D232-98D9-41AB-AA3A-CD2DDF7DA59C}',
            docType: '194',
            typeDescription: 'First Demand Letter',
            receivedAt: '2020-05-29',
          },
          {
            documentId: '{641D0414-10A9-4246-9AFD-3C0BE2D62B2F}',
            docType: '1213',
            typeDescription: 'Second Demand Letter',
            receivedAt: '2020-05-29',
          },
        ],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('mounts wrapper component', () => {
    const wrapper = shallow(<DebtLettersList store={fakeStore} />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
  it('renders correct number of debt rows', () => {
    const wrapper = shallow(<DebtLettersList store={fakeStore} />);
    expect(wrapper.dive().find(`DebtLettersTable`).length).to.equal(1);
    expect(
      wrapper
        .dive()
        .find('DebtLettersTable')
        .dive()
        .find('td')
        .at(0)
        .text(),
    ).to.equal('May 29, 2020');
    expect(
      wrapper
        .dive()
        .find('DebtLettersTable')
        .dive()
        .find('td')
        .at(1)
        .text(),
    ).to.equal('Second Demand Letter');
    wrapper.unmount();
  });
  it('renders correct empty state', () => {
    const fakeStoreEmptyState = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        debtLetters: {
          isPendingVBMS: false,
          isPending: false,
          debts: [],
          debtLinks: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = shallow(<DebtLettersList store={fakeStoreEmptyState} />);
    expect(wrapper.dive().find(`table`).length).to.equal(0);
    wrapper.unmount();
  });
});
