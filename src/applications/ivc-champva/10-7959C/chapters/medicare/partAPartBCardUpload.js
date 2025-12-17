import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { createCardUploadSchema } from '../../../shared/components/fileUploads/genericCardUpload';
import MedicarePartAPartBDescription from '../../components/FormDescriptions/MedicarePartAPartBDescription';

const { uiSchema, schema } = createCardUploadSchema({
  frontProperty: 'medicarePartAPartBFrontCard',
  backProperty: 'medicarePartAPartBBackCard',
  frontImageSrc: '/img/ivc-champva/part_a_and_b_front_high_res.png',
  backImageSrc: '/img/ivc-champva/medicare_back_high_res.png',
  frontAltText:
    'Red, white, and blue Medicare card. It states “Medicare Health Insurance” and lists the Medicare number and coverage dates for Part A hospital and Part B medical coverage.',
  backAltText:
    'Back of a red, white, and blue Medicare card. Includes card usage instructions and the Medicare phone number and website.',
  cardTitle: 'Sample of Original Medicare card',
  frontLabel: 'Upload front of Original Medicare card',
  backLabel: 'Upload back of Original Medicare card',
  frontAttachmentId: 'Front of Medicare Parts A or B card',
  backAttachmentId: 'Back of Medicare Parts A or B card',
});

export default {
  uiSchema: {
    ...titleUI(
      'Upload Medicare card for Hospital and Medical insurance',
      MedicarePartAPartBDescription,
    ),
    ...uiSchema,
  },
  schema,
};
