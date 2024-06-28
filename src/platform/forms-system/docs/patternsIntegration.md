# Patterns Integration

## Form

## Pages

## Fields
### Text
#### Parameters

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `title` | The label of the text field | `string` |  |
| `[description]` | The description of the text field. Appears beneath the label. | `string` |  |
| `[hint]` | Hint text for the text field. Appears below the title/description. | `string` |  |
| `[charcount]` | Whether to display character count | `boolean` |  |
| `[width]` | Width of the text field | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` |  |
| `[errorMessages]` | Error messages for the text field | `UIErrorMessages` |  |
| `[messageAriaDescribedby]` | An optional message that will be read by screen readers when the input is focused. | `string` |  |
| `[inputType]` | Input type for the text field | `'number' \| 'text' \| 'email' \| 'search' \| 'tel' \| 'url'` |  |
| `[autocomplete]` | Autocomplete attribute for the text field | `'on' \| 'off' \| 'name' \| 'honorific-prefix' \| 'given-name' \| 'additional-name' \| 'family-name' \| 'honorific-suffix' \| 'nickname' \| 'email' \| 'username' \| 'current-password' \| 'organization-title' \| 'organization' \| 'street-address' \| 'address-line1' \| 'address-line2' \| 'address-line3' \| 'address-level4' \| 'address-level3' \| 'address-level2' \| 'address-level1' \| 'country' \| 'country-name' \| 'postal-code' \| 'cc-name' \| 'cc-given-name' \| 'cc-additional-name' \| 'cc-family-name' \| 'cc-number' \| 'cc-exp' \| 'cc-exp-month' \| 'cc-exp-year' \| 'cc-csc' \| 'cc-type' \| 'transaction-currency' \| 'transaction-amount' \| 'language' \| 'bday' \| 'bday-day' \| 'bday-month' \| 'bday-year' \| 'sex' \| 'tel' \| 'tel-country-code' \| 'tel-national' \| 'tel-area-code' \| 'tel-local' \| 'tel-extension' \| 'impp' \| 'url' \| 'photo'` |  |



## Patterns

### Title
| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `[title]` | The title text or JSX element, or a function returning a title | `string \| JSX.Element \| ({ formData, formContext }) => string \| JSX.Element` |  |
| `[description]` | The description text or JSX element, or a function returning a description | `string \| JSX.Element \| ({ formData, formContext }) => string \| JSX.Element` |  |
| `[headerLevel]` | The level of the header. | `number` | `3` |
| `[classNames]` | Additional CSS class names | `string` |  |

### Array builder pattern

#### ArrayBuilderOptions

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `arrayPath` | The JSON data property in redux for the array e.g. `"employers"` for `formData.employers` | `string` |  |
| `nounSingular` | Used for text in cancel, remove, modals, and screen readers. Used with nounPlural | `string` |  |
| `nounPlural` | Used for text in cancel, remove, modals, and screen readers. Used with nounSingular | `string` |  |
| `required` | This determines the flow type of the array builder. Required starts with an intro page, optional starts with the yes/no question (summary page). | `boolean` |  |
| `[isItemIncomplete]` | Will display error on the cards if item is incomplete. You should include all of your required fields here. e.g. `item => !item?.name` | `(item) => boolean` |  |
| `[maxItems]` | The maximum number of items allowed in the array. Omit or set to null to allow unlimited items. | `number` |  |
| `[reviewPath]` | Defaults to `'review-and-submit'` if not provided. | `string` | `'review-and-submit'` |
| `text` | Define text such as the item name and the contents of the card (cardDescription). Override any default text used in the array builder pattern. | `ArrayBuilderText` |  |

#### ArrayBuilderText

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `[alertItemUpdated]` | Function to generate alert message when an item is updated | `(props: ArrayBuilderTextProps) => string` |  |
| `[alertItemDeleted]` | Function to generate alert message when an item is deleted | `(props: ArrayBuilderTextProps) => string` |  |
| `[alertMaxItems]` | Function to generate alert message when max items are reached | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelAddButtonText]` | Function to generate cancel add button text | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelAddDescription]` | Function to generate description when adding is canceled | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelAddReviewDescription]` | Function to generate review description when adding is canceled | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelAddNo]` | Function to generate "No" button text for cancel add | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelAddTitle]` | Function to generate title when adding is canceled | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelEditButtonText]` | Function to generate cancel edit button text | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelEditDescription]` | Function to generate description when editing is canceled | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelEditReviewDescription]` | Function to generate review description when editing is canceled | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelEditNo]` | Function to generate "No" button text for cancel edit | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelEditTitle]` | Function to generate title when editing is canceled | `(props: ArrayBuilderTextProps) => string` |  |
| `[cancelYes]` | Function to generate "Yes" button text for cancel actions | `(props: ArrayBuilderTextProps) => string` |  |
| `cardDescription` | Function to generate card description | `(itemData: any) => string` | e.g. `item => ` `${formatReviewDate(item?.date)}` |
| `[cardItemMissingInformation]` | Function to generate message when an item is missing information | `(itemData: any) => string` |  |
| `[editSaveButtonText]` | Function to generate save button text during editing | `(props: ArrayBuilderTextProps) => string` |  |
| `getItemName` | Function to get the name of an item | `(itemData: any) => string` | e.g. `item => item.name` |
| `[deleteDescription]` | Function to generate description when deleting an item | `(props: ArrayBuilderTextProps) => string` |  |
| `[deleteNeedAtLeastOneDescription]` | Function to generate description when at least one item is needed | `(props: ArrayBuilderTextProps) => string` |  |
| `[deleteNo]` | Function to generate "No" button text for delete actions | `(props: ArrayBuilderTextProps) => string` |  |
| `[deleteTitle]` | Function to generate title when deleting an item | `(props: ArrayBuilderTextProps) => string` |  |
| `[deleteYes]` | Function to generate "Yes" button text for delete actions | `(props: ArrayBuilderTextProps) => string` |  |
| `[reviewAddButtonText]` | Function to generate add button text in review | `(props: ArrayBuilderTextProps) => string` |  |
| `[summaryTitle]` | Function to generate summary title | `(props: ArrayBuilderTextProps) => string` |  |
| `[yesNoBlankReviewQuestion]` | Function to generate yes/no question in review | `(props: ArrayBuilderTextProps) => string` |  |

