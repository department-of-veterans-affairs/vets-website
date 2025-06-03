import commonFieldMapping from './commonFieldMapping';
import { createBaseFieldMapping } from '../utilities/field-mapping';

/** @param {WebComponentFieldProps} props */
export default function vaSelectFieldMapping(props) {
  const baseFieldMapping = createBaseFieldMapping(props, {
    eventName: 'onVaSelect',
    emptyAsUndefined: false, // Keep original behavior for selects
  });

  return {
    ...commonFieldMapping(props),
    ...baseFieldMapping,
  };
}
