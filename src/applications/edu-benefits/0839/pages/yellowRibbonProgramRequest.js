import YellowRibbonProgramDescription from '../components/YellowRibbonProgramDescription';
import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';

const uiSchema = {
  'ui:title': YellowRibbonProgramTitle,
  'ui:description': YellowRibbonProgramDescription,
};

const schema = {
  type: 'object',
  properties: {},
};

export { uiSchema, schema };
