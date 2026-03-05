/**
 * Bootstrap: wires up the va-forms-system adapter with
 * vets-website platform implementations.
 *
 * Import this module once at startup before any form renders:
 *
 *   import 'platform/forms-system/configure-forms-adapter';
 */
import { configureAdapter } from '@department-of-veterans-affairs/va-forms-system';
import * as impl from './adapter-impl';

configureAdapter(impl);
