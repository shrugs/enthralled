import { Node, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';

import { CustomEditor } from './editor';

// eslint-disable-next-line no-unused-vars
type NodeBuilder = (el: HTMLElement) => Partial<Node> | null;

const ELEMENT_TAGS: Record<string, NodeBuilder> = {
  A: (el) => ({ type: 'link', url: el.getAttribute('href') ?? undefined }),
  IMG: (el) => ({ type: 'image', url: el.getAttribute('src') ?? undefined }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  H1: () => ({ type: 'heading-one' }),
  H2: () => ({ type: 'heading-two' }),
  H3: () => ({ type: 'heading-three' }),
  H4: () => ({ type: 'heading-four' }),
  H5: () => ({ type: 'heading-five' }),
  H6: () => ({ type: 'heading-six' }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'bulleted-list' }),
};

const TEXT_TAGS: Record<string, NodeBuilder> = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  B: () => ({ bold: true }),
  U: () => ({ underline: true }),
  SPAN: (el) => {
    if (el.style.background.startsWith('black')) {
      return { redacted: 'black' };
    }

    if (el.style.background.startsWith('yellow')) {
      return { redacted: 'yellow' };
    }

    if (el.style.background.startsWith('fuchsia')) {
      return { redacted: 'fuchsia' };
    }

    return null;
  },
};

export const deserialize = (el: HTMLElement): any => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = el;
  let parent: HTMLElement = el;

  if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
    parent = el.childNodes[0] as HTMLElement;
  }

  const children = Array.from(parent.childNodes)
    .map((childNode) => deserialize(childNode as HTMLElement))
    .flat();

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    if (attrs !== null) {
      return jsx('element', attrs, children);
    }
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    if (attrs !== null) {
      return children.map((child) => jsx('text', attrs, child));
    }
  }

  return children;
};

export const withHtml = (editor: CustomEditor) => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const fragment = deserialize(parsed.body);
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};
