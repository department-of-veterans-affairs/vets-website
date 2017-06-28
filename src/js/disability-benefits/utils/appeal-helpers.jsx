import React from 'react';
import moment from 'moment';

export function appealStatusDescriptions(lastEvent) {
  const content = {
    form9: {
      status: {
        title: 'Your Form 9 was received by the Regional Office (RO)',
        description: <div>
          <p>The Veterans Benefits Administration (VBA) RO has received your Form 9, and is now completing the final steps in the processing of your appeal before it is sent to the Board.</p>
          <ul>
            <li>If you didn't submit any new evidence with your Form 9, your appeal is now waiting for the RO to certify it to the Board.</li>
            <li>If you, your legal representative, or your healthcare provider added new evidence, the RO will review the evidence and another SSOC will be developed.</li>
          </ul>
          <p>
            On average, Veterans with appeals in the Form 9 stage, wait about 12 months for VBA to complete the necessary action.
          </p>
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
        title: `To continue with your appeal, we need your Form 9 by ${moment(lastEvent.date).add(60, 'days').format('MMM DD, YYYY')}`,
        description: <div>
          <p>The Form 9 asks you to review the SOC and confirm the issues you want to appeal and why you want to appeal them. You can also let the Board know if you would like a hearing for your appeal.</p>
          <p><a href="#">Learn more about hearings.</a></p>
        </div>,
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
        title: `To continue with your appeal, we need your Form 9 by ${moment(lastEvent.date).add(60, 'days').format('MMM DD, YYYY')}`,
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
        title: 'The Board Has Made a Decision on Your Appeal',
        description: <div>
          <p>The Board has made a decision on each issue within your appeal. You will receive a copy of the Board's decision in the mail.</p>
          <h5>What if I don’t agree with the Board's decision?</h5>
          <p>If you disagree with issue the Board decided, you can appeal it by filing a Notice of Appeal with the United States Court of Appeals for Veterans Claims (CAVC), which is a Federal court. You have 120 days from the date written on the front of the Board decision to file an appeal with CAVC, if you decide to do so. <a href="https://www.uscourts.cavc.gov/appeal.php">Learn how to file an appeal with the CAVC.</a></p>
        </div>,
      },
    },
    certified: {
      status: {
        title: 'The Regional Office (RO) Has Certified Your Appeal',
        description: <div>
          <p>The Veterans Benefits Administration (VBA) RO has certified your appeal to the Board. This means it is now waiting for the Board to receive it and place it in line for review by a lawyer. You will be notified when your appeal is activated by the Board.</p>
          <p>The average time it takes for the Board to activate your appeal is 9 months.</p>
          <h5>Note:</h5>
          <ul>
            <li>If your <strong>Form 9 was received on or after February 2, 2013:</strong> If you or your legal representative adds new evidence, the evidence will only be reviewed by the Board and not the RO. If someone other than you or your representative submits evidence, the Board will have to remand the appeal to the RO to consider the evidence and issue a Supplemental Statement of the Case (SSOC). Sending the case back to the RO for this type of consideration can add years to the time it takes to decide your appeal, but you can avoid this additional delay if you send a letter to the Board that says you want the Board to consider the new evidence without sending it back to the RO.</li>
            <li>If your <strong>Form 9 was received before February 2, 2013:</strong> If you or anyone submits new evidence on your behalf, then the Board will have to remand the appeal to the RO to review the evidence and issue a Supplemental Statement of the Case (SSOC). Sending the case back to the RO for this type of consideration can add years to the time it takes to decide your appeal, but you can avoid this additional delay if you send a letter to the Board that says you want the Board to consider the new evidence without sending it back to the RO.</li>
          </ul>
        </div>,
      },
    },
    bva_remand: { // eslint-disable-line camelcase
      status: {
        title: 'Your Appeal Has Been Remanded',
        description: <div>
          <p>The Board has made a decision on each issue within your appeal and all or some of the issues have been remanded. This means the Veterans Law Judge who reviewed your appeal needs more information before making a decision on all or some of the issues.</p>
          <p>On average, about 54% of issues in appeals get remanded. The Board has sent your appeal to the Veterans Benefits Administration (VBA) to add any relevant information to your case. If a physical exam was requested, VBA will reach out to you. If your appeal is not granted during the VBA review, a Supplemental Statement of the Case (SSOC) will be developed and sent to the Board.</p>
          <p>On average, Veterans with appeals in the Remand stage, wait about 14 months for VBA to complete the necessary action.</p>
        </div>
      }
    },
    merged: {
      status: {
        title: 'Your Appeal Has Been Merged With Your Earlier Appeal',
        description: <p>Because you had separate appeals on multiple claims, the appeals have been merged so that all of the issues you appealed can be considered at the same time. Instead of waiting on two (or more) decisions, all of the issues in your appeals will be addressed in a single decision by the Board. Your place in line will is based on your oldest appeal, meaning that the issues from your newer appeal(s) will be decided more quickly than if the appeals were not merged.</p>
      }
    },
    field_grant: { // eslint-disable-line camelcase
      status: {
        title: 'Your Appeal Has Been Granted by the Regional Office (RO)',
        description: 'This means the Veterans Benefits Administration (VBA) RO has granted the claim you filed an appeal for. Your appeal is now closed.',
      }
    }
  };

  const emptyResponse = {
    status: {},
    nextAction: {}
  };

  return content[lastEvent.type] || emptyResponse;
}
