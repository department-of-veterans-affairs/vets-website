import { expect } from 'chai';

import {
  showForm0781Pages,
  showBehaviorIntroPage,
  showBehaviorIntroCombatPage,
  showBehaviorListPage,
} from '../../utils/form0781';

describe('showForm0781Pages', () => {
  describe('when the flipper is on and a user is claiming a new condition', () => {
    it('should should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
        },
      };
      expect(showForm0781Pages(formData)).to.eq(true);
    });
  });

  describe('when the flipper is off and a user is claiming a new condition', () => {
    it('should should return false', () => {
      const formData = {
        syncModern0781Flow: false,
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
        },
      };
      expect(showForm0781Pages(formData)).to.eq(false);
    });
  });

  describe('when the flipper is on and a user is not claiming a new condition', () => {
    it('should should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealth: {
          conditions: {
            none: true,
          },
        },
      };
      expect(showForm0781Pages(formData)).to.eq(false);
    });

    it('should should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        mentalHealth: {
          conditions: {
            someCondition: false,
          },
        },
      };
      expect(showForm0781Pages(formData)).to.eq(false);
    });
  });
});

// Flipper is on AND user is claiming a new condition AND user opts into completing online form
describe('showBehaviorIntroCombatPage', () => {
  describe('when a user has selected ONLY combat related events', () => {
    it('should should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        'view:mentalHealthWorkflowChoice': 'optForOnlineForm0781',
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
          eventTypes: {
            combat: true,
            nonMst: false,
          },
        },
      };

      expect(showBehaviorIntroCombatPage(formData)).to.eq(true);
    });
  });

  describe('when a user has selected combat related AND non-combat related events', () => {
    it('should should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        'view:mentalHealthWorkflowChoice': 'optForOnlineForm0781',
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
          eventTypes: {
            combat: true,
            nonMst: true,
          },
        },
      };

      expect(showBehaviorIntroCombatPage(formData)).to.eq(false);
    });
  });

  describe('when a user has not selected combat related events', () => {
    it('should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        'view:mentalHealthWorkflowChoice': 'optForOnlineForm0781',
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
          eventTypes: {
            combat: false,
            nonMst: true,
          },
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
        'view:mentalHealthWorkflowChoice': 'optForOnlineForm0781',
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
          eventTypes: {
            combat: true,
            nonMst: true,
          },
        },
      };
      expect(showBehaviorIntroPage(formData)).to.eq(true);
    });
  });

  describe('when a user has selected ONLY combat related events', () => {
    it('should should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        'view:mentalHealthWorkflowChoice': 'optForOnlineForm0781',
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
          eventTypes: {
            combat: true,
            nonMst: false,
          },
        },
      };
      expect(showBehaviorIntroPage(formData)).to.eq(false);
    });
  });
});

describe('showBehaviorListPage', () => {
  describe('when a user has selected ONLY combat related events and opted in', () => {
    it('should should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        'view:mentalHealthWorkflowChoice': 'optForOnlineForm0781',
        'view:answerCombatBehaviorQuestions': 'true',
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
          eventTypes: {
            combat: true,
            nonMst: false,
          },
        },
      };
      expect(showBehaviorListPage(formData)).to.eq(true);
    });
  });

  describe('when a user has selected ONLY combat related events and opted OUT', () => {
    it('should should return false', () => {
      const formData = {
        syncModern0781Flow: true,
        'view:mentalHealthWorkflowChoice': 'optForOnlineForm0781',
        'view:answerCombatBehaviorQuestions': 'false',
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
          eventTypes: {
            combat: true,
            nonMst: false,
          },
        },
      };
      expect(showBehaviorListPage(formData)).to.eq(false);
    });
  });

  describe('when a user has not selected ONLY combat related events', () => {
    it('should should return true', () => {
      const formData = {
        syncModern0781Flow: true,
        'view:mentalHealthWorkflowChoice': 'optForOnlineForm0781',
        mentalHealth: {
          conditions: {
            someCondition: true,
          },
          eventTypes: {
            combat: true,
            nonMst: true,
          },
        },
      };
      expect(showBehaviorListPage(formData)).to.eq(true);
    });
  });
});
