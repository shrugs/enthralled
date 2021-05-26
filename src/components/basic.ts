import * as RadixSeparator from '@radix-ui/react-separator';

import { styled } from '../stitches.config';

export const Box = styled('div', {});

export const Separator = styled(RadixSeparator.Root, {
  backgroundColor: 'gainsboro',
  height: '$px',
  my: '$4',
});
