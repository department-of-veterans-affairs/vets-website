import FileFieldCustom from '../../shared/components/fileUploads/FileUpload';
import { REQUIRED_FILES } from '../config/constants';

// Wrap shared fileFieldCustom so we can pass the form-specific
// list of required uploads (for use with MissingFileOverview)
export default function FileFieldWrapped(props) {
  return FileFieldCustom({ ...props, requiredFiles: REQUIRED_FILES });
}
