import { topicTitle } from '../../content/labels';

const formFields = {
  levelOne: 'levelOne',
  levelTwo: 'levelTwo',
  levelThree: 'levelThree',
};

const topicUI = {
  [formFields.levelOne]: {
    'ui:title': topicTitle,
  },
  [formFields.levelTwo]: {
    'ui:title': topicTitle,
  },
  [formFields.levelThree]: {
    'ui:title': topicTitle,
  },
};

export default topicUI;
