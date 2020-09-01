import fhirHandlers from './fhir/handlers';
import varHandlers from './var/handlers';

export default [...fhirHandlers, ...varHandlers];
