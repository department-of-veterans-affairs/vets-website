import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEventOnce } from 'platform/monitoring/record-event';
import { ANALYTICS_EVENTS, HELP_TEXT_CLICKED_EVENT } from '../constants';

const combatPtsdType = 'Combat';

const mstPtsdType = 'Sexual trauma';

const assaultPtsdType = 'Personal assault';

const nonCombatPtsdType =
  'Non-combat PTSD other than sexual trauma or personal assault';

export const ptsdTypeEnum = {
  combatPtsdType,
  mstPtsdType,
  assaultPtsdType,
  nonCombatPtsdType,
};

export const ptsdTypeHelp = (
  <VaAdditionalInfo
    trigger="Which should I choose?"
    disableAnalytics
    onClick={() =>
      recordEventOnce(
        ANALYTICS_EVENTS.openedPtsdTypeHelp,
        HELP_TEXT_CLICKED_EVENT,
      )
    }
  >
    <h3 className="vads-u-font-size--h4">Types of stressful events</h3>
    <h4 className="vads-u-font-size--h5">Combat</h4>
    <p>
      This means you participated in a fight or encounter with a military enemy
      or hostile unit or weapon. It also could mean you were present during
      these events either as a combatant or a service member supporting
      combatants -- for example, providing medical care to the wounded.
    </p>
    <h4 className="vads-u-font-size--h5">Sexual trauma</h4>
    <p>
      This means you experienced sexual harassment, sexual assault, or rape, by
      a service member or civilian, while on active duty, active duty for
      training, or inactive duty training.
    </p>
    <h4 className="vads-u-font-size--h5">Personal assault</h4>
    <p>
      This means you were a victim of an assault, battery, robbery, mugging,
      stalking, or harassment by a person who wasn’t part of an enemy force.
    </p>
    <h4 className="vads-u-font-size--h5">
      Non-combat PTSD other than sexual trauma or personal assault
    </h4>
    <p>
      This means you experienced an event such as a car accident, hurricane, or
      plane crash, or witnessed the death, injury, or threat to another person
      or to yourself, that was caused by something other than a hostile military
      or terrorist activity.
    </p>
  </VaAdditionalInfo>
);
