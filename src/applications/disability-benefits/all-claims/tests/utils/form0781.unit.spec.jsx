import { expect } from 'chai';

import {
  showForm0781Pages,
  showBehaviorIntroPage,
  showBehaviorIntroCombatPage,
  showBehaviorListPage,
  showBehaviorSummaryPage,
  isCompletingForm0781,
  isRelatedToMST,
  showUnlistedDescriptionPage,
  showBehaviorDescriptionsPage,
} from '../../utils/form0781';
import { form0781WorkflowChoices } from '../../content/form0781/workflowChoices';

describe('showForm0781Pages', () => {
  describe('when the flipper is on and a user is claiming a new condition', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        'view:claimType': {
          'view:claimingNew': true,
        },
      };
      expect(showForm0781Pages(formData)).to.eq(true);
    });
  });

  describe('when the flipper is off and a user is claiming a new condition', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: false,
        'view:claimType': {
          'view:claimingNew': true,
        },
      };
      expect(showForm0781Pages(formData)).to.eq(false);
    });
  });

  describe('when the flipper is on and a user is claiming an increase for an existing condition', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        ratedDisabilities: [
          {
            diagnosticCode: 5420,
            decisionCode: 'SVCCONNCTED',
            name: 'Post traumatic stress disorder',
            ratedDisabilityId: '9459392',
            ratingDecisionId: '63655',
            ratingPercentage: 40,
            maximumRatingPercentage: 40,
            specialIssues: ['PTSD/1'],
            disabilityActionType: 'NONE',
          },
        ],
        'view:claimType': {
          'view:claimingIncrease': true,
        },
      };
      expect(showForm0781Pages(formData)).to.eq(false);
    });
  });

  describe('when the flipper is off and a user is claiming an increase for an existing condition', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: false,
        'view:claimType': {
          'view:claimingIncrease': true,
        },
      };
      expect(showForm0781Pages(formData)).to.eq(false);
    });
  });
});

describe('isCompletingForm0781', () => {
  describe('when the user selects to optIn to completing the form online', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        'view:claimType': {
          'view:claimingNew': true,
        },
      };
      expect(isCompletingForm0781(formData)).to.eq(true);
    });
  });
  describe('when the user selects to submit a paper form', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice: form0781WorkflowChoices.SUBMIT_PAPER_FORM,
        'view:claimType': {
          'view:claimingNew': true,
        },
      };
      expect(isCompletingForm0781(formData)).to.eq(false);
    });
  });
  describe('when the user selects to opt out', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice: form0781WorkflowChoices.OPT_OUT_OF_FORM0781,
        'view:claimType': {
          'view:claimingNew': true,
        },
      };
      expect(isCompletingForm0781(formData)).to.eq(false);
    });
  });
});

// Flipper is on AND user is claiming a new condition AND user opts into completing online form
describe('isRelatedToMST', () => {
  describe('when a user has selected MST', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        eventTypes: {
          combat: true,
          mst: true,
        },
      };
      expect(isRelatedToMST(formData)).to.eq(true);
    });
  });
  describe('when a user has NOT selected MST', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        eventTypes: {
          combat: true,
          mst: false,
        },
      };
      expect(isRelatedToMST(formData)).to.eq(false);
    });
  });
});

// Flipper is on AND user is claiming a new condition AND user opts into completing online form
describe('showBehaviorIntroCombatPage', () => {
  describe('when a user has selected ONLY combat related events', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        eventTypes: {
          combat: true,
          nonMst: false,
        },
      };
      expect(showBehaviorIntroCombatPage(formData)).to.eq(true);
    });
  });

  describe('when a user has selected combat related AND non-combat related events', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        eventTypes: {
          combat: true,
          nonMst: true,
        },
      };
      expect(showBehaviorIntroCombatPage(formData)).to.eq(false);
    });
  });

  describe('when a user has not selected combat related events', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        eventTypes: {
          combat: false,
          nonMst: true,
        },
      };
      expect(showBehaviorIntroCombatPage(formData)).to.eq(false);
    });
  });
});

describe('showBehaviorIntroPage', () => {
  describe('when a user has not selected ONLY combat related events', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        eventTypes: {
          combat: true,
          nonMst: true,
        },
      };
      expect(showBehaviorIntroPage(formData)).to.eq(true);
    });
  });

  describe('when a user has selected ONLY combat related events', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        eventTypes: {
          combat: true,
          nonMst: false,
        },
      };
      expect(showBehaviorIntroPage(formData)).to.eq(false);
    });
  });
});

describe('showBehaviorListPage', () => {
  describe('when a user has selected ONLY combat related events', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        answerCombatBehaviorQuestions: 'true',
        eventTypes: {
          combat: true,
          nonMst: false,
        },
      };
      expect(showBehaviorListPage(formData)).to.eq(true);
    });
  });

  describe('when a user has not selected ONLY combat related events', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        eventTypes: {
          combat: true,
          nonMst: true,
        },
      };
      expect(showBehaviorListPage(formData)).to.eq(true);
    });
  });
});

describe('showBehaviorDescriptionPages', () => {
  /* All 14 behavior pages are similarly setup to show dynamically, this tests a few combinations.
  */
  describe('when a user has selected "reassignment"', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          reassignment: true,
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          misconduct: false,
          unlisted: true,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(
        showBehaviorDescriptionsPage(formData, 'workBehaviors', 'reassignment'),
      ).to.eq(true);
    });
  });
  describe('when a user has not selected "reassignment"', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          misconduct: false,
          unlisted: true,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(
        showBehaviorDescriptionsPage(formData, 'workBehaviors', 'reassignment'),
      ).to.eq(false);
    });
  });
  describe('when a user has unselected "reassignment" (reassignment: false)', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          reassignment: false,
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          misconduct: false,
          unlisted: true,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(
        showBehaviorDescriptionsPage(formData, 'workBehaviors', 'reassignment'),
      ).to.eq(false);
    });
  });
  describe('when a user has selected "misconduct"', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          reassignment: true,
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          misconduct: true,
          unlisted: true,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(
        showBehaviorDescriptionsPage(formData, 'otherBehaviors', 'misconduct'),
      ).to.eq(true);
    });
  });
  describe('when a user has not selected "misconduct"', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          unlisted: true,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(
        showBehaviorDescriptionsPage(formData, 'otherBehaviors', 'misconduct'),
      ).to.eq(false);
    });
  });
  describe('when a user has unselected "misconduct" (misconduct: false)', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          reassignment: false,
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          misconduct: false,
          unlisted: true,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(
        showBehaviorDescriptionsPage(formData, 'otherBehaviors', 'misconduct'),
      ).to.eq(false);
    });
  });
});

describe('showUnlistedDescriptionPage', () => {
  describe('when a user has selected "unlisted"', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          reassignment: true,
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          misconduct: false,
          unlisted: true,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(showUnlistedDescriptionPage(formData)).to.eq(true);
    });
  });
  describe('when a user has not selected "unlisted"', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          misconduct: false,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(showUnlistedDescriptionPage(formData)).to.eq(false);
    });
  });
  describe('when a user has unselected "unlisted" (unlisted: false)', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          misconduct: false,
          unlisted: false,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(showUnlistedDescriptionPage(formData)).to.eq(false);
    });
  });
});

describe('showBehaviorSummaryPage', () => {
  describe('when a user has selected behavior changes', () => {
    it('should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          reassignment: false,
          absences: true,
          performance: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: true,
          misconduct: false,
          unlisted: true,
        },
        noBehavioralChange: { noChange: false },
      };
      expect(showBehaviorSummaryPage(formData)).to.eq(true);
    });
  });

  describe('when a user has skipped the page, not selecting any behavior changes', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
      };
      expect(showBehaviorSummaryPage(formData)).to.eq(false);
    });
  });

  describe('when a user has unselected any behavior changes that were previously selected', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        workBehaviors: {
          reassignment: false,
          absences: false,
          performance: false,
        },
        healthBehaviors: {
          consultations: false,
          episodes: false,
        },
        otherBehaviors: {
          socialEconomic: false,
          relationships: false,
          misconduct: false,
          unlisted: false,
        },
        noBehavioralChange: { noChange: false },
      };

      expect(showBehaviorSummaryPage(formData)).to.eq(false);
    });
  });

  describe('when a user has selected "none" for behavior changes', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealthWorkflowChoice:
          form0781WorkflowChoices.COMPLETE_ONLINE_FORM,
        noBehavioralChange: { noChange: true },
      };
      expect(showBehaviorSummaryPage(formData)).to.eq(false);
    });
  });
});
