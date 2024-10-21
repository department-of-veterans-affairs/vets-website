import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import InformalConferenceReview from '../../components/InformalConferenceReview';
import {
  informalConferenceTitle,
  newInformalConferenceTitle,
  informalConferenceLabel,
  editButtonLabel,
  newEditButtonLabel,
  informalConferenceLabels,
  newInformalConferenceReviewLabels,
} from '../../content/InformalConference';

describe('<InformalConferenceReview>', () => {
  const setup = (data = {}, toggle = false) => {
    const formData = { ...data, hlrUpdatedContent: toggle };
    return render(
      <InformalConferenceReview data={formData} editPage={() => {}} />,
    );
  };

  it('should render original informalConference rep data', () => {
    const screen = setup({ informalConference: 'rep' });
    screen.getByText(informalConferenceTitle);
    screen.getByText(informalConferenceLabel);
    screen.getByText(informalConferenceLabels.rep);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      editButtonLabel,
    );
  });

  it('should render original informalConference Veteran data', () => {
    const screen = setup({ informalConference: 'me' });
    screen.getByText(informalConferenceTitle);
    screen.getByText(informalConferenceLabel);
    screen.getByText(informalConferenceLabels.me);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      editButtonLabel,
    );
  });

  it('should render new informalConference rep data', () => {
    const screen = setup(
      { informalConference: 'rep', informalConferenceChoice: 'yes' },
      true,
    );
    screen.getByText(newInformalConferenceTitle);
    screen.getByText(informalConferenceLabel);
    screen.getByText(newInformalConferenceReviewLabels.yes);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      newEditButtonLabel,
    );
  });

  it('should render new informalConference Veteran data', () => {
    const screen = setup(
      { informalConference: 'me', informalConferenceChoice: 'yes' },
      true,
    );
    screen.getByText(newInformalConferenceTitle);
    screen.getByText(informalConferenceLabel);
    screen.getByText(newInformalConferenceReviewLabels.yes);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      newEditButtonLabel,
    );
  });

  it('should render new informalConference no data', () => {
    const screen = setup(
      { informalConference: 'me', informalConferenceChoice: 'no' },
      true,
    );
    screen.getByText(newInformalConferenceTitle);
    screen.getByText(informalConferenceLabel);
    screen.getByText(newInformalConferenceReviewLabels.no);
    expect($('va-button', screen.container).getAttribute('label')).to.eq(
      newEditButtonLabel,
    );
  });
});
