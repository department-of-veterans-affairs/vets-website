import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('babel-loader', pathToFileURL('./'));
