import React, { useCallback, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

import { Box } from '../components/basic';
import { Element, Leaf } from '../editor/Render';
import { withHtml } from '../editor/withHtml';

// const HOTKEYS = {
//   'mod+b': 'bold',
//   'mod+i': 'italic',
//   'mod+u': 'underline',
//   'mod+`': 'code',
// }

const EMPTY_VALUE: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];

export function Dashboard() {
  const [value, setValue] = useState<Descendant[]>(EMPTY_VALUE);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const [editor] = useState(() => withHtml(withHistory(withReact(createEditor() as any))));

  return (
    <Box css={{ height: '$screen', display: 'flex', fd: 'row' }}>
      <Box css={{ w: '$half', p: '$2' }}>
        <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
          <Editable
            style={{ height: '100%' }}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Paste in some HTML..."
            spellCheck
            autoFocus
            // onKeyDown={(event) => {
            //   for (const hotkey in HOTKEYS) {
            //     if (isHotkey(hotkey, event as any)) {
            //       event.preventDefault();
            //       const mark = HOTKEYS[hotkey];
            //       toggleMark(editor, mark);
            //     }
            //   }
            // }}
          />
        </Slate>
      </Box>
      <Box css={{ w: '$half', p: '$2' }}>
        <Box as="pre" css={{ fontSize: '$xs' }}>
          {JSON.stringify(value, null, 2)}
        </Box>
      </Box>
    </Box>
  );
}
