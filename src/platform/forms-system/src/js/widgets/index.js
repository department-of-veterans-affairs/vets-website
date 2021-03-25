import TextWidget from './TextWidget';
import SelectWidget from './SelectWidget';
import DateWidget from './DateWidget';
import EmailWidget from './EmailWidget';
import RadioWidget from './RadioWidget';
import CheckboxWidget from './CheckboxWidget';
import YesNoWidget from './YesNoWidget';
import DynamicCheckboxWidget from '~/applications/covid-vaccine/config/va-location/DynamicCheckboxWidget';

const widgets = {
  TextWidget,
  SelectWidget,
  DateWidget,
  EmailWidget,
  RadioWidget,
  CheckboxWidget,
  yesNo: YesNoWidget,
  dynamicCheckbox: DynamicCheckboxWidget,
};

export default widgets;
