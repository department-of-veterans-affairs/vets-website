import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import InformalConferenceReview from '../../components/InformalConferenceReview';
import {
  newInformalConferenceTitle,
  informalConferenceLabel,
  newEditButtonLabel,
  newInformalConferenceLabels,
} from '../../content/InformalConference';

describe('<InformalConferenceReview>', () => {
  const setup = (data = {}) => {
    return render(<InformalConferenceReview data={data} editPage={() => {}} />);
  };

  it('should render new informalConference rep data', () => {
    const screen = setup({
      informalConference: 'rep',
      informalConferenceChoice: 'yes',
    });
    screen.getByText(newInformalConferenceTitle);
    screen.getByText(informalConferenceLabel);
    screen.getByText(newInformalConferenceLabels.yes);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      newEditButtonLabel,
    );
  });

  it('should render new informalConference Veteran data', () => {
    const screen = setup({
      informalConference: 'me',
      informalConferenceChoice: 'yes',
    });
    screen.getByText(newInformalConferenceTitle);
    screen.getByText(informalConferenceLabel);
    screen.getByText(newInformalConferenceLabels.yes);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      newEditButtonLabel,
    );
  });

  it('should render new informalConference no data', () => {
    const screen = setup({
      informalConference: 'me',
      informalConferenceChoice: 'no',
    });
    screen.getByText(newInformalConferenceTitle);
    screen.getByText(informalConferenceLabel);
    screen.getByText(newInformalConferenceLabels.no);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      newEditButtonLabel,
    );
  });
});
