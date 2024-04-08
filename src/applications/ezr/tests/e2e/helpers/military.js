import { goToNextPage, selectYesNoWebComponent } from '.';

export const advanceThroughToxicExposure = () => {
  goToNextPage('/military-service/radiation-cleanup-efforts');
  selectYesNoWebComponent('radiationCleanupEfforts', false);

  goToNextPage('/military-service/gulf-war-service');
  selectYesNoWebComponent('gulfWarService', false);

  goToNextPage('/military-service/operation-support');
  selectYesNoWebComponent('combatOperationService', false);

  goToNextPage('/military-service/agent-orange-exposure');
  selectYesNoWebComponent('exposedToAgentOrange', false);

  goToNextPage('/military-service/other-toxic-exposure');
};
