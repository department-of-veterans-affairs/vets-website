import { render } from '@testing-library/react';
import { ptsdFirstIncidentIntro } from '../../content/ptsdFirstIncidentIntro';

describe('ptsdFirstIncidentIntro', () => {
  it('renders', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
        'view:nonCombatPtsdType': true,
      },
    };
    const tree = render(ptsdFirstIncidentIntro({ formData }));

    tree.getByText(
      'On the next few screens, we’ll ask about the first event that caused your combat and non-combat PTSD.',
      { exact: false },
    );
  });
});
