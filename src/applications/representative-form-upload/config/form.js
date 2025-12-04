import { getFormContent } from '../helpers';
import form210966 from './form-21-0966';
import form21686C from './form-21-686-c';
import form21526Ez from './form-21-526-ez';

const formConfig = (pathname = null) => {
  const { formNumber } = getFormContent(pathname);

  if (formNumber === '21-526EZ') {
    return form21526Ez(pathname);
  }
  if (formNumber === '21-0966') {
    return form210966(pathname);
  }
  if (formNumber === '21-686c') {
    return form21686C(pathname);
  }
  return null;
};

export default formConfig;
