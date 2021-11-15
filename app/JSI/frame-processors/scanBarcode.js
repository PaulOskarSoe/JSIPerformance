/* globals __scanBarcode */

export const scanBarcode = frame => {
  'worklet';
  // eslint-disable-next-line no-undef
  // @ts-expect-error Frame Processors are not typed.
  return __scanBarcode(frame);
};
