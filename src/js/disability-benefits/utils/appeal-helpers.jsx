import React from 'react';

export const appealStatusDescriptions = {
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
      title: 'Your Statement of the Case (SOC) was Prepared by the Regional Office (RO)',
      description: <div>
        <p>The Veterans Benefits Administration (VBA) RO has mailed you the SOC for your appeal. Included with your SOC is a Form 9, which you can use to ask for your appeal to continue.</p>
        <p>
          To continue your appeal, you need to complete and send back your Form 9 by July 28, 2017. If you do not send back a Form 9 in time, your appeal will be closed.
        </p>
      </div>,
    },
    nextAction: {
      title: 'To continue with your appeal, we need your Form 9 by',
      description: <div>
        <p>The Form 9 asks you to review the SOC and confirm the issues you want to appeal and why you want to appeal them. You can also let the Board know if you would like a hearing for your appeal.</p>
        <p><a href="#">Learn more about hearings.</a></p>
      </div>,
    }
  },
  nod: {
    status: {
      title: 'Your NOD has been received by the Veterans Benefits Administration (VBA) RO.',
      description: <p>Your NOD has been received by the RO. The RO will make a decision or develop the Statement of the Case (SOC) for your appeal. This means they review all of the evidence related to your appeal, including any new evidence you submit. When the SOC is prepared, you will receive a copy of it in the mail.</p>,
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
