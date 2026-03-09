import React from 'react';
import { expect } from 'chai';
import { set } from 'lodash';
import LegalName from '../../../components/personal-information/LegalName';
import { renderWithProfileReducers as render } from '../../unit-test-helpers';

function createInitialState() {
  return {
    vaProfile: {
      hero: {
        userFullName: {
          first: null,
          middle: null,
          last: null,
          suffix: null,
        },
      },
    },
  };
}

describe('Personal Info - Legal Name', () => {
  it('should render the error alert if no names are present', () => {
    const initialState = createInitialState();
    const tree = render(<LegalName />, {
      initialState,
    });
    expect(
      tree.getByText(
        /something went wrong on our end and we can’t load your legal name/i,
      ),
    ).to.exist;
  });

  it('should render a name if provided through state', () => {
    const state = createInitialState();
    const tree = render(<LegalName />, {
      initialState: set(state, 'vaProfile.hero.userFullName', {
        first: 'John',
        middle: 'middlename',
        last: 'Doe',
        suffix: 'Jr',
      }),
    });
    expect(tree.getByText(/john middlename doe jr/i)).to.exist;
  });

  it('should handle a missing userFullName object in state', () => {
    const state = {
      vaProfile: {
        hero: {},
      },
    };
    const tree = render(<LegalName />, {
      initialState: set(state, 'vaProfile.hero.userFullName', null),
    });
    expect(
      tree.getByText(
        /something went wrong on our end and we can’t load your legal name/i,
      ),
    ).to.exist;
  });
});
