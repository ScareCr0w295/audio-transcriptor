import { constants } from './constants';
import { environment } from './environment';

// Export a combined configuration object
export const config = {
  ...environment,
  constants
};