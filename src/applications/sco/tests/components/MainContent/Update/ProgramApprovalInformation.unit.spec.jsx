import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import ProgramApprovalInformation from '../../../../components/MainContent/Update/ProgramApprovalInformation';

describe('ProgramApprovalInformation', () => {
  it('Should render form 10275 link when toggle ON', () => {
    const { container } = renderWithStoreAndRouter(
      <ProgramApprovalInformation />,
      {
        initialState: {
          featureToggles: {
            [TOGGLE_NAMES.form10275Release]: true,
          },
        },
      },
    );

    const valink = $('va-link[data-testid="form-10275-link"]', container);
    expect(valink.getAttribute('text')).to.contain(
      'Commit to the Principles of Excellence for educational institutions',
    );
    const links = $$('va-link', container);
    expect(links.length).to.eq(12);
  });

  it('Should not render form 10275 link when toggle OFF', () => {
    const { container } = renderWithStoreAndRouter(
      <ProgramApprovalInformation />,
      {
        initialState: {
          featureToggles: {
            [TOGGLE_NAMES.form10275Release]: false,
          },
        },
      },
    );

    const links = $$('va-link', container);
    expect(links.length).to.eq(11);
  });
});
