/* globals __recognizeText */

export const recognizeText = frame => {
  'worklet';
  // eslint-disable-next-line no-undef
  // @ts-expect-error Frame Processors are not typed.
  return __recognizeText(frame);
};
