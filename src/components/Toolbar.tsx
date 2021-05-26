import * as Toolbar from '@radix-ui/react-toolbar';

import { styled } from '../stitches.config';

export const ToolbarRoot = styled(Toolbar.Root, {
  display: 'flex',
});

export const ToolbarButton = styled(Toolbar.Button, {
  appearance: 'none',
  backgroundColor: 'transparent',
  border: 'none',
  padding: '5px 10px',
  margin: '0 1px',
  boxShadow: 'inset 0 0 0 1px gainsboro',
  overflow: 'hidden',
  borderRadius: 3,
  fontSize: 13,

  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 0 0 1px dodgerblue, 0 0 0 1px dodgerblue',
  },
});
