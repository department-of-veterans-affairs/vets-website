import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import InformalConferenceContactReview from '../../components/InformalConferenceContactReview';
import {
  informalConferenceContactTitle,
  informalConferenceContactLabel,
  informalConferenceContactOptions,
  newEditButtonLabel,
} from '../../content/InformalConferenceContact';

describe('<InformalConferenceReview>', () => {
  const setup = (data = {}) => {
    return render(
      <InformalConferenceContactReview data={data} editPage={() => {}} />,
    );
  };

  it('should render original informalConference rep data', () => {
    const screen = setup({ informalConference: 'rep' });
    screen.getByText(informalConferenceContactTitle);
    screen.getByText(informalConferenceContactLabel);
    screen.getByText(informalConferenceContactOptions.rep);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      newEditButtonLabel,
    );
  });

  it.skip('should render original informalConference Veteran data', () => {
    const screen = setup({ informalConference: 'me' });
    screen.getByText(informalConferenceContactTitle);
    screen.getByText(informalConferenceContactLabel);
    screen.getByText(informalConferenceContactOptions.me);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      newEditButtonLabel,
    );
  });
});
