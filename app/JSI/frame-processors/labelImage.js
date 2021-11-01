/* globals __labelImage */

import {Frame} from 'react-native-vision-camera';

export const labelImage = frame => {
  'worklet';
  // eslint-disable-next-line no-undef
  // @ts-expect-error Frame Processors are not typed.

  return __labelImage(frame);
};
