import React from 'react';

export const appealStatusDescriptions = (eventType) => {
  const definitionMap = {
    form9: {
      status: {
        title: 'form9 Your Form 9 was received by the Regional Office (RO)',
        description: <div>
          <p>The Veterans Benefits Administration (VBA) RO has received your Form 9, and is now completing the final steps in the processing of your appeal before it is sent to the Board.</p>
          <ul>
            <li>If you didn't submit any new evidence with your Form 9, your appeal is now waiting for the RO to certify it to the Board.</li>
            <li>If you, your legal representative, or your healthcare provider added new evidence, the RO will review the evidence and another SSOC will be developed.</li>
          </ul>
        </div>,
      },
      nextAction: {
        title: 'You have asked for a videoconference hearing on your Form 9.',
        description: 'You will get a letter in the mail at least 30 days before your hearing is scheduled letting you know the date, time, and location of the hearing.'
      }
    },
    ssoc: {
      status: {
        title: 'SSOC status title',
        description: <p>SSOC description.</p>,
      },
      nextAction: {
        title: 'SSOC next action title.',
        description: 'SSOC next action description.'
      }
    },
    soc: {
      status: {
        title: 'SOC status title',
        description: <p>SOC description.</p>,
      },
      nextAction: {
        title: 'SOC next action title.',
        description: 'SOC next action description.'
      }
    },
    nod: {
      status: {
        title: 'NOD status title',
        description: <p>NOD description.</p>,
      },
      nextAction: {
        title: 'NOD next action title.',
        description: 'NOD next action description.'
      }
    },
    bva_final_decision: { // eslint-disable-line camelcase
      status: {
        title: 'bva_final_decision status title',
        description: <p>bva_final_decision description.</p>,
      },
      nextAction: {
        title: 'bva_final_decision next action title.',
        description: 'bva_final_decision next action description.'
      }
    },
  };

  return definitionMap[eventType];
}
