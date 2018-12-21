import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

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

export const ptsdTypeDescription = (
  <div>
    <p>
      First we‘re going to ask you about the type of event or events that
      contributed to your PTSD.
    </p>
  </div>
);

export const ptsdTypeHelp = (
  <AdditionalInfo triggerText="Which should I choose?">
    <h4>Types of Stressful incidents</h4>
    <h5>Combat</h5>
    <p>
      This means you participated in a fight or encounter with a military enemy
      or hostile unit or weapon. It also includes if you were present during
      these events either as a combatant or a Servicemember supporting
      combatants such as providing medical care to the wounded.
    </p>
    <h5>Military sexual trauma</h5>
    <p>
      This includes sexual harassment, sexual assault, or rape that happens in a
      military setting.
    </p>
    <h5>Personal assault</h5>
    <p>
      This means a person, who isn‘t part of an enemy force, committed harm.
      Examples of personal assault include: assault, battery, robbery, mugging,
      stalking, or harassment.
    </p>
    <h5>
      Non-combat PTSD other than Military sexual trauma or Personal assault
    </h5>
    <p>
      This means you experienced an event such as a car accident, hurricane, or
      plane crash, or witnessing the death, injury, or threat to another person
      or to yourself, caused by something other than a hostile military or
      terrorist activity.
    </p>
  </AdditionalInfo>
);
