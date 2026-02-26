import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithProfileReducers as render } from '../../unit-test-helpers';
import * as helpers from '../../../helpers';

import NameTag from '../../../components/hub/NameTag';

const NULL_USER = {
  first: '',
  middle: '',
  last: '',
  suffix: '',
};

const getInitialState = () => ({
  vaProfile: {
    hero: {
      userFullName: {
        first: 'Johnnie',
        middle: 'Leonard',
        last: 'Weaver',
        suffix: '',
      },
    },
    militaryInformation: {
      serviceHistory: {
        serviceHistory: [
          {
            branchOfService: 'Army',
            beginDate: '2004-02-01',
            endDate: '2007-02-01',
          },
          {
            branchOfService: 'Coast Guard',
            beginDate: '2009-02-01',
            endDate: '2019-02-01',
          },
          {
            branchOfService: 'Navy',
            beginDate: '2007-02-01',
            endDate: '2009-02-01',
          },
        ],
      },
    },
  },
});

const withUserFullName = (userFullName = { ...NULL_USER }) => {
  const initialState = getInitialState();
  initialState.vaProfile.hero.userFullName = userFullName;
  return render(<NameTag />, { initialState });
};

describe('<NameTag>', () => {
  context(
    'when name is set and there are multiple service history entries',
    () => {
      let view;
      beforeEach(() => {
        sinon.stub(helpers, 'handleRouteChange').callsFake(() => {});

        view = render(<NameTag />, {
          initialState: getInitialState(),
        });
      });
      afterEach(() => {
        helpers.handleRouteChange.restore();
      });

      it("should render the Veteran's name", () => {
        view.getByText('Johnnie Leonard Weaver');
      });
      it('should render the most recent branch of service', () => {
        view.getByText('United States Coast Guard');
        view.getByRole('img', { alt: /coast guard seal/ });
      });
      it('should render the veteran status card link', () => {
        const link = view.container.querySelector(
          'va-link[text="Veteran Status Card"]',
        );
        expect(link).to.exist;
        link.click();
        expect(helpers.handleRouteChange.called).to.be.true;
      });
    },
  );

  context('when there is no service history', () => {
    it('should only render the name and veteran status card link', () => {
      const initialState = getInitialState();
      initialState.vaProfile.militaryInformation.serviceHistory.serviceHistory = [];
      const view = render(<NameTag />, { initialState });
      view.getByText('Johnnie Leonard Weaver');
      expect(view.queryByText(/United States/i)).to.not.exist;
      view.getByRole('img', {
        name: /VA seal/,
      });
    });
  });

  context('when capitalizing middle initials', () => {
    it('should capitalize single letter, middle initials', () => {
      const view = withUserFullName({
        first: 'Max',
        middle: 'H g',
        last: 'Miller',
      });
      view.getByText('Max H G Miller');
    });

    it('should capitalize middle initials with punctuation', () => {
      const view = withUserFullName({
        first: 'Max',
        middle: 'h. G.',
        last: 'Miller',
      });
      view.getByText('Max H. G. Miller');
    });

    it('should not capitalize full word, middle names', () => {
      const view = withUserFullName({
        first: 'Max',
        middle: 'de Rosa',
        last: 'Miller',
      });
      view.getByText('Max de Rosa Miller');
    });
  });
});
