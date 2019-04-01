import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { recordEventOnce } from '../utils';
import { ANALYTICS_EVENTS, HELP_TEXT_CLICKED_EVENT } from '../constants';

const combatPtsdType = 'Combat';

const mstPtsdType = 'Sexual trauma';

const assaultPtsdType = 'Personal assault';

const nonCombatPtsdType = 'Non-combat PTSD';

export const ptsdTypeEnum = {
  combatPtsdType,
  mstPtsdType,
  assaultPtsdType,
  nonCombatPtsdType,
};

export const nonCombatPtsdTypeLong = (
  <span>
    {nonCombatPtsdType} <strong>other than</strong> sexual trauma or personal
    assault
  </span>
);

export const ptsdTypeHelp = (
  <AdditionalInfo
    triggerText="Which should I choose?"
    onClick={() =>
      recordEventOnce(
        ANALYTICS_EVENTS.openedPtsdTypeHelp,
        HELP_TEXT_CLICKED_EVENT,
      )
    }
  >
    <h4>Types of stressful events</h4>
    <h5>Combat</h5>
    <p>
      This means you participated in a fight or encounter with a military enemy
      or hostile unit or weapon. It also could mean you were present during
      these events either as a combatant or a Servicemember supporting
      combatants -- for example, providing medical care to the wounded.
    </p>
    <h5>Sexual trauma</h5>
    <p>
      This means you experienced sexual harassment, sexual assault, or rape, by
      a Servicemember or civilian, while on active duty, active duty for
      training, or inactive duty training.
    </p>
    <h5>Personal assault</h5>
    <p>
      This means you were a victim of an assault, battery, robbery, mugging,
      stalking, or harassment by a person who wasn't part of an enemy force.
    </p>
    <h5>Non-combat PTSD other than sexual trauma or personal assault</h5>
    <p>
      This means you experienced an event such as a car accident, hurricane, or
      plane crash, or witnessed the death, injury, or threat to another person
      or to yourself, that was caused by something other than a hostile military
      or terrorist activity.
    </p>
  </AdditionalInfo>
);
