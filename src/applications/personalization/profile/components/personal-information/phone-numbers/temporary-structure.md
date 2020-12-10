ProfileInfoTable
↓
PhoneField
↓
ContactInformationField
↓
PhoneEditView (or jsx when not editing)
↓
ContactInformationEditView
↓
ContactInfoForm
↓
SchemaForm


We should aim to consolidate some of these components so that this hierarchy is not so layered

1) Consolidate PhoneField and ContactInformationField
2) Consolidate PhoneEditView and ContactInformationEditView

RESULT:

ProfileInfoTable
↓
ContactInformationField
↓
ContactInformationEditView (or jsx when not editing)
↓
ContactInfoForm
↓
SchemaForm
