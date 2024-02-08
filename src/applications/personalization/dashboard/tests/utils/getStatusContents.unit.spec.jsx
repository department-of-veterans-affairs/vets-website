import { expect } from 'chai';

import { mockAppealData } from '../helpers';
import { getStatusContents } from '../../utils/getStatusContents';

describe('getStatusContents', () => {
  it('should return correct title and description for Pending Statement of Case', () => {
    const { title, description } = getStatusContents(mockAppealData.data[0]);
    const content = description.props.children[2];

    expect(title).to.equal(
      'A Decision Review Officer is reviewing your appeal',
    );
    expect(content).to.include(
      'received your Notice of Disagreement. A Decision Review Officer (DRO) will review all of the evidence related to your appeal, including any new evidence you sent.',
    );
  });

  it('should return correct title and description for Pending Form 9', () => {
    const { title, description } = getStatusContents(mockAppealData.data[6]);
    const content =
      description.props.children[2].props.children[0].props.children[0];

    expect(title).to.equal('Please review your Statement of the Case');
    expect(content).to.equal(
      'Submit VA Form 9 to continue your appeal to the Board of Veterans’ Appeals, ',
    );
  });

  it('should return correct title and description for Pending Certification', () => {
    const { title, description } = getStatusContents(mockAppealData.data[7]);
    const content = description.props.children[2];
    expect(title).to.equal(
      'The Decision Review Officer is finishing their review of your appeal',
    );
    expect(content).to.include(
      'received your VA Form 9 and will send your appeal to the Board of Veterans’ Appeals.',
    );
  });

  it('should return correct title and description for Pending Certification - Supplemental Statement of Case', () => {
    const { title, description } = getStatusContents(mockAppealData.data[8]);
    const content = description.props.children[0].props.children[2];
    expect(title).to.equal(
      'Please review your Supplemental Statement of the Case',
    );
    expect(content).to.include(
      'sent you a Supplemental Statement of the Case on',
    );
  });

  it('should return correct title and description for Remand - Supplemental Statement of Case ', () => {
    const { title, description } = getStatusContents(mockAppealData.data[9]);
    const content = description.props.children.join('');
    expect(title).to.equal(
      'Please review your Supplemental Statement of the Case',
    );
    expect(content).to.include(
      'The Agency of Original Jurisdiction sent you a Supplemental Statement of the Case on September 12, 2015 because, after completing the remand instructions from the Board, they couldn’t fully grant your appeal.',
    );
  });

  it('should return correct title and description for Pending - Hearing Schedule', () => {
    const { title, description } = getStatusContents(mockAppealData.data[5]);
    const content = description.props.children[0].props.children.join('');
    expect(title).to.equal('You’re waiting for your hearing to be scheduled');
    expect(content).to.include(
      "You requested a videoconference hearing. We'll schedule your hearing, and, you’ll receive a notice in the mail at least 30 days before the hearing date.",
    );
  });

  it('should return correct title and description for Scheduled Hearing', () => {
    const { title, description } = getStatusContents(mockAppealData.data[10]);
    const content = description.props.children[0].props.children.join('');
    expect(title).to.equal('Your hearing has been scheduled');
    expect(content).to.include(
      'Your videoconference hearing is scheduled for September 12, 2015 at bva',
    );
  });

  it('should return correct title and description for at VSO', () => {
    const { title, description } = getStatusContents(mockAppealData.data[11]);
    const content = description.props.children.join('');
    expect(title).to.equal(
      'Your appeal is with your Veterans Service Organization',
    );
    expect(content).to.include(
      'Disabled American Veterans is reviewing your appeal to make additional arguments in support of your case. For more information, please contact Disabled American Veterans.',
    );
  });

  it('should return correct title and description for Review in progress', () => {
    const { title, description } = getStatusContents(mockAppealData.data[12]);
    const content = description.props.children.join('');
    expect(title).to.equal('A judge is reviewing your appeal');
    expect(content).to.include(
      'Your appeal is at the Board of Veterans’ Appeals being reviewed by a Veterans Law Judge.',
    );
  });

  it("should return correct title and description for Board of Veterans' - development", () => {
    const { title, description } = getStatusContents(mockAppealData.data[13]);
    const content = description.props.children;
    expect(title).to.equal(
      'The judge is seeking more information before making a decision',
    );
    expect(content).to.include(
      'The Board of Veterans’ Appeals is seeking evidence or an outside opinion from a legal, medical, or other professional in order to make a decision about your appeal.',
    );
  });

  it("should return correct title and description for Board of Veterans' - decision made", () => {
    const { title, description } = getStatusContents(mockAppealData.data[2]);
    const content = description.props.children[0].props.children;
    expect(title).to.equal('The Board made a decision on your appeal');
    expect(content).to.include(
      'The Board of Veterans’ Appeals sent you a decision on your appeal. Here’s an overview:',
    );
  });

  it('should return correct title and description for Board - waiting', () => {
    const { title, description } = getStatusContents(mockAppealData.data[14]);
    const content = description.props.children;
    expect(title).to.equal(
      'The Board is waiting until a higher court makes a decision',
    );
    expect(content).to.include(
      'A higher court has asked the Board of Veterans’ Appeals to hold open a group of appeals awaiting review. Yours is one of the appeals held open. The higher court believes that a decision it will make on a different appeal could affect yours.',
    );
  });

  it('should return correct title and description for Appeal granted', () => {
    const { title, description } = getStatusContents(mockAppealData.data[15]);
    const content = description.props.children.join('');
    expect(title).to.equal(
      'The Agency of Original Jurisdiction granted your appeal',
    );
    expect(content).to.include(
      'The Agency of Original Jurisdiction agreed with you and decided to overturn the original decision. If this decision changes your disability rating or eligibility for VA benefits, you should see this change made in 1 to 2 months.',
    );
  });

  it('should return correct title and description for Withdrawn', () => {
    const { title, description } = getStatusContents(mockAppealData.data[16]);
    const content = description.props.children;
    expect(title).to.equal('You withdrew your appeal');
    expect(content).to.include(
      'You chose not to continue your appeal. If this information is incorrect, please contact your Veterans Service Organization or representative for more information.',
    );
  });

  it('should return correct title and description for Failure to Respond', () => {
    const { title, description } = getStatusContents(mockAppealData.data[17]);
    const content = description.props.children;
    expect(title).to.equal('Your appeal was closed');
    expect(content).to.include(
      'You didn’t take an action VA requested in order to continue your appeal. If this information is incorrect, or if you want to reopen your appeal, please contact your Veterans Service Organization or representative for more information.',
    );
  });

  it('should return correct title and description for Rapid Appeals Modernization Program', () => {
    const { title, description } = getStatusContents(mockAppealData.data[18]);
    const content = description.props.children;
    expect(title).to.equal(
      'You opted in to the Rapid Appeals Modernization Program (RAMP)',
    );
    expect(content).to.include(
      'You chose to participate in the new Supplemental Claim or Higher-Level Review options. This doesn’t mean that your appeal has been closed. If this information is incorrect, please contact your Veterans Service Organization or representative as soon as possible.',
    );
  });

  it('should return correct title and description for Motion for Reconsideration', () => {
    const { title, description } = getStatusContents(mockAppealData.data[19]);
    const content = description.props.children;
    expect(title).to.equal('Your Motion for Reconsideration was denied');
    expect(content).to.include(
      'The Board of Veterans’ Appeals declined to reopen your appeal. Please contact your Veterans Service Organization or representative for more information.',
    );
  });

  it('should return correct title and description for Closed - death', () => {
    const { title, description } = getStatusContents(mockAppealData.data[20]);
    const content = description.props.children.join('');
    expect(title).to.equal('The appeal was closed');
    expect(content).to.include(
      'VA records indicate that  is deceased, so this appeal has been closed. If this information is incorrect, please contact your Veterans Service Organization or representative as soon as possible.',
    );
  });

  it('should return correct title and description for Closed - other', () => {
    const { title, description } = getStatusContents(mockAppealData.data[21]);
    const content = description.props.children;
    expect(title).to.equal('Your appeal was closed');
    expect(content).to.include(
      'Your appeal was dismissed or closed. Please contact your Veterans Service Organization or representative for more information.',
    );
  });

  it('should return correct title and description for Merged', () => {
    const { title, description } = getStatusContents(mockAppealData.data[22]);
    const content = description.props.children[0].props.children;
    expect(title).to.equal('Your appeal was merged');
    expect(content).to.include(
      'Your appeal was merged with another appeal. The Board of Veterans’ Appeals merges appeals so that you can receive a single decision on as many appealed issues as possible. This appeal was merged with an older appeal that was closest to receiving a Board decision.',
    );
  });

  it('should return correct title and description for Appeals Modernization Act opt-in', () => {
    const { title, description } = getStatusContents(mockAppealData.data[23]);
    const content = description.props.children[0].props.children;
    expect(title).to.equal(
      'You requested a decision review under the Appeals Modernization Act',
    );
    expect(content).to.include(
      'A new law, the Veterans Appeals Improvement and Modernization Act, took effect on February 19, 2019. Although your appeal started before the new law took effect, you asked for it to be converted into one of the new decision review options.',
    );
  });

  it('should return correct title and description for New evidentiary period', () => {
    const { title, description } = getStatusContents(mockAppealData.data[24]);
    const content = description.props.children[0].props.children.join('');
    expect(title).to.equal('Your appeals file is open for new evidence');
    expect(content).to.include(
      'Because you requested the  appeal option, the Board of Veterans’ Appeals will hold your case open for new evidence for 90 days.',
    );
  });

  it('should return correct title and description for BVA decision - action needed', () => {
    const { title, description } = getStatusContents(mockAppealData.data[25]);
    const content = description.props.children[0].props.children.join('');
    expect(title).to.equal(
      'The Agency of Original Jurisdiction corrected an error',
    );
    expect(content).to.include(
      'In the February 3, 2021 decision, a judge at the Board of Veterans’ Appeals identified an error that needed to be corrected. A reviewer at the Agency of Original Jurisdiction completed the judge’s instructions and sent you a new decision on February 3, 2022.',
    );
  });

  it('should return correct title and description for BVA decision - change updated', () => {
    const { title, description } = getStatusContents(mockAppealData.data[26]);
    const content = description.props.children[0].props.children.join('');
    expect(title).to.equal(
      'The Agency of Original Jurisdiction corrected an error',
    );
    expect(content).to.include(
      'On February 3, 2021, a judge at the Board of Veterans’ Appeals made a decision that changes your disability rating or eligibility for benefits. On February 3, 2022, the Agency of Original Jurisdiction sent you a new decision that updates your benefits.',
    );
  });

  it('should return correct title and description for Supplemental Claim - received', () => {
    const { title, description } = getStatusContents(mockAppealData.data[27]);
    const content = description.props.children[0].props.children.join('');
    expect(title).to.equal('A reviewer is examining your new evidence');
    expect(content).to.include(
      'A Supplemental Claim allows you to add new and relevant evidence to your case. When you filed a Supplemental Claim, you included new evidence or identified evidence that the Agency of Original Jurisdiction should obtain.',
    );
  });

  it('should return correct title and description for Higher-level review', () => {
    const { title, description } = getStatusContents(mockAppealData.data[28]);
    const content = description.props.children[0].props.children.join('');
    expect(title).to.equal(
      'A higher-level reviewer is taking a new look at your case',
    );
    expect(content).to.include(
      'By requesting a Higher-Level Review, you asked for a higher-level at the Agency of Original Jurisdiction to look at your case and determine whether they can change the decision based on a difference of opinion or because VA made an error.',
    );
  });

  it('should return correct title and description for Supplemental Claim - decision made', () => {
    const { title, description } = getStatusContents(mockAppealData.data[29]);
    const content = description.props.children[0].props.children.join('');
    expect(title).to.equal(
      'The Agency of Original Jurisdiction made a decision',
    );
    expect(content).to.include(
      'The Agency of Original Jurisdiction sent you a decision on your Supplemental Claim.',
    );
  });

  it('should return correct title and description for Higher-level - decision made', () => {
    const { title, description } = getStatusContents(mockAppealData.data[30]);
    const content = description.props.children[0].props.children.join('');
    expect(title).to.equal(
      'The Agency of Original Jurisdiction made a decision',
    );
    expect(content).to.include(
      'The Agency of Original Jurisdiction sent you a decision on your Higher-Level Review.',
    );
  });

  it('should return correct title and description for Higher-level review - error correcting', () => {
    const { title, description } = getStatusContents(mockAppealData.data[4]);
    const content = description.props.children;
    expect(title).to.equal(
      'The Veterans Benefits Administration is correcting an error',
    );
    expect(content).to.include(
      'During their review, the higher-level reviewer identified an error that must be corrected before deciding your case. If needed, VA may contact you to ask for more evidence or to schedule a new medical exam.',
    );
  });

  it('should return correct title and description for Supplemental Claim - closed', () => {
    const { title, description } = getStatusContents(mockAppealData.data[31]);
    const content = description.props.children;
    expect(title).to.equal('Your Supplemental Claim was closed');
    expect(content).to.include(
      'Your Supplemental Claim was closed. Please contact VA or your Veterans Service Organization or representative for more information.',
    );
  });

  it('should return correct title and description for Higher-level Review - closed', () => {
    const { title, description } = getStatusContents(mockAppealData.data[32]);
    const content = description.props.children;
    expect(title).to.equal('Your Higher-Level Review was closed');
    expect(content).to.include(
      'Your Higher-Level Review was closed. Please contact VA or your Veterans Service Organization or representative for more information.',
    );
  });

  it('should return correct title and description for Remand return', () => {
    const { title, description } = getStatusContents(mockAppealData.data[33]);
    const content = description.props.children;
    expect(title).to.equal(
      'Your appeal was returned to the Board of Veterans’ Appeals',
    );
    expect(content).to.include(
      'The Veterans Benefits Administration finished their work on the remand and will return your case to the Board of Veterans’ Appeals.',
    );
  });

  it('should return correct title and description for Unknown Status', () => {
    const { title, description } = getStatusContents({
      id: '',
      type: 'appeal',
      attributes: {
        status: {
          type: 'unknown',
        },
      },
    });
    const content = description.props.children;
    expect(title).to.equal('We don’t know your status');
    expect(content).to.include(
      'We’re sorry, VA.gov will soon be updated to show your status.',
    );
  });
});
