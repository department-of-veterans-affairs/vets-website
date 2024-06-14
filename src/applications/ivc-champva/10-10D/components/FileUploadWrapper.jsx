import FileFieldCustom from '../../shared/components/fileUploads/FileUpload';
import { requiredFiles } from '../config/requiredUploads';

// Wrap shared fileFieldCustom so we can pass the form-specific
// list of required uploads (for use with MissingFileOverview)
export default function FileFieldWrapped(props) {
  return FileFieldCustom({ ...props, requiredFiles });
}
