import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import YesNoField from 'platform/forms-system/src/js/web-component-fields/YesNoField';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import {
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { incomeRecipientTypeLabels } from '../utils/labels';

const DEFAULT_ASSET_LIMIT =
  'Do you and your dependents have over $25,000 in assets?';
const VERSION_2025_ASSET_LIMIT =
  'Do you and your dependents have over $75,000 in assets?';

const DEFAULT_ASSET_DESCRIPTION =
  'We need to know if you and your dependents have over $25,000 in assets.';
const VERSION_2025_ASSET_DESCRIPTION =
  'We need to know if you and your dependents have over $75,000 in assets.';

const DEFAULT_INCOME_SOURCES =
  'Do you or your dependents have more than 4 sources of income?';
const VERSION_2025_INCOME_SOURCES =
  'How many income sources does your family have?';

export const incomeSourceLabels = {
  NO_INCOME: 'No income',
  ONE_TO_FOUR_SOURCES: '1-4 sources of income',
  MORE_THAN_FIVE_SOURCES: '5+ sources of income',
};

const incomeRecipientTypeLabels2025 = {
  ...incomeRecipientTypeLabels,
  CUSTODIAN: 'Custodian',
  CUSTODIAN_SPOUSE: 'Custodians spouse',
};

const make2025YesNoField = (defaultLabel, updatedLabel) => {
  return props => {
    const {
      TOGGLE_NAMES,
      useToggleLoadingValue,
      useToggleValue,
    } = useFeatureToggle();

    const isLoading = useToggleLoadingValue(
      TOGGLE_NAMES?.survivorsBenefitsForm2025VersionEnabled,
    );
    const is2025Enabled = useToggleValue(
      TOGGLE_NAMES?.survivorsBenefitsForm2025VersionEnabled,
    );

    const label = !isLoading && is2025Enabled ? updatedLabel : defaultLabel;

    return YesNoField({ ...props, label });
  };
};

const TotalNetWorthDescription = () => {
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();

  const isLoading = useToggleLoadingValue(
    TOGGLE_NAMES?.survivorsBenefitsForm2025VersionEnabled,
  );
  const is2025Enabled = useToggleValue(
    TOGGLE_NAMES?.survivorsBenefitsForm2025VersionEnabled,
  );

  const text =
    !isLoading && is2025Enabled
      ? VERSION_2025_ASSET_DESCRIPTION
      : DEFAULT_ASSET_DESCRIPTION;

  return (
    <div>
      <p>{text}</p>
    </div>
  );
};

const TotalNetWorthYesNoField = make2025YesNoField(
  DEFAULT_ASSET_LIMIT,
  VERSION_2025_ASSET_LIMIT,
);

const IncomeSourcesField = props => {
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();
  const isLoading = useToggleLoadingValue(
    TOGGLE_NAMES?.survivorsBenefitsForm2025VersionEnabled,
  );
  const is2025Enabled = useToggleValue(
    TOGGLE_NAMES?.survivorsBenefitsForm2025VersionEnabled,
  );
  const show2025 = !isLoading && !!is2025Enabled;

  if (show2025) {
    return VaRadioField({
      ...props,
      label: VERSION_2025_INCOME_SOURCES,
      uiOptions: {
        ...props.uiOptions,
        labels: incomeSourceLabels,
      },
    });
  }
  return YesNoField({ ...props, label: DEFAULT_INCOME_SOURCES });
};

const MonthlyIncomeRecipientField = props => {
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();
  const isLoading = useToggleLoadingValue(
    TOGGLE_NAMES?.survivorsBenefitsForm2025VersionEnabled,
  );
  const is2025Enabled = useToggleValue(
    TOGGLE_NAMES?.survivorsBenefitsForm2025VersionEnabled,
  );
  const show2025 = !isLoading && !!is2025Enabled;

  if (show2025) {
    return VaRadioField({
      ...props,
      uiOptions: {
        ...props.uiOptions,
        labels: incomeRecipientTypeLabels2025,
      },
    });
  }

  return VaRadioField({
    ...props,
    uiOptions: {
      ...props.uiOptions,
      labels: incomeRecipientTypeLabels,
    },
  });
};

export const apply2025MonthlyIncomeDetailsRecipient = (
  uiSchema = {},
  schema = {},
) => {
  const recipient = uiSchema?.recipient;

  if (!recipient) {
    return { uiSchema, schema };
  }

  return {
    uiSchema: {
      ...uiSchema,
      recipient: {
        ...recipient,
        'ui:widget': 'radio',
        'ui:webComponentField': MonthlyIncomeRecipientField,
      },
    },
    schema: {
      ...schema,
      type: 'object',
      properties: {
        ...schema.properties,
        recipient: radioSchema(Object.keys(incomeRecipientTypeLabels2025)),
      },
    },
  };
};

export const apply2025IncomeAndAssetsTitle = (uiSchema = {}) => {
  const totalNetWorth = uiSchema?.totalNetWorth;

  if (!totalNetWorth) {
    return uiSchema;
  }

  return {
    ...uiSchema,
    ...titleUI('Income and assets', TotalNetWorthDescription),
    totalNetWorth: {
      ...totalNetWorth,
      'ui:webComponentField': TotalNetWorthYesNoField,
    },
  };
};

export const apply2025IncomeSourcesTitle = (uiSchema = {}, schema = {}) => {
  const moreThanFourIncomeSources = uiSchema?.moreThanFourIncomeSources;

  if (!moreThanFourIncomeSources) {
    return { uiSchema, schema };
  }

  return {
    uiSchema: {
      ...uiSchema,
      moreThanFourIncomeSources: {
        ...moreThanFourIncomeSources,
        'ui:widget': 'radio',
        'ui:webComponentField': IncomeSourcesField,
      },
    },
    schema: {
      ...schema,
      properties: {
        ...schema.properties,
        moreThanFourIncomeSources: radioSchema(Object.keys(incomeSourceLabels)),
      },
    },
  };
};

export default apply2025IncomeAndAssetsTitle;
