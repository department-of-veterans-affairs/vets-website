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

  // Template
  // it('should return correct title and description for ', () => {
  //   const { title, description } = getStatusContents(mockAppealData.data[]);
  //   const content = description.props;
  //   console.log(content)
  //   expect(title).to.equal(
  //   );
  //   expect(content).to.include(
  //   );
  // });
});
