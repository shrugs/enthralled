import { BaseEditor, Descendant } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type FragmentElement = {
  type: 'fragment';
  children: Descendant[];
};

export type ParagraphElement = {
  type: 'paragraph';
  children: Descendant[];
};

export type HeadingElement = {
  type: 'heading';
  level: number;
  children: CustomText[];
};

export type LinkElement = {
  type: 'link';
  url: string;
};

export type ImageElement = {
  type: 'image';
  url: string;
};

export type QuoteElement = {
  type: 'quote';
  children: CustomText[];
};

export type CodeElement = {
  type: 'code';
  children: CustomText[];
};

export type BulletedListElement = {
  type: 'bulleted-list';
  children: CustomText[];
};

export type HeadingOneElement = {
  type: 'heading-one';
  children: CustomText[];
};

export type HeadingTwoElement = {
  type: 'heading-two';
  children: CustomText[];
};

export type HeadingThreeElement = {
  type: 'heading-three';
  children: CustomText[];
};

export type HeadingFourElement = {
  type: 'heading-four';
  children: CustomText[];
};

export type HeadingFiveElement = {
  type: 'heading-five';
  children: CustomText[];
};

export type HeadingSixElement = {
  type: 'heading-six';
  children: CustomText[];
};

export type ListItemElement = {
  type: 'list-item';
  children: CustomText[];
};

export type NumberedListElement = {
  type: 'numbered-list';
  children: CustomText[];
};

export type ChapterElement = {
  type: 'chapter';
  title: string;
  children: Descendant[];
};

// an annotation wraps some children elements and contains content
export type AnnotationElement = {
  type: 'annotation';
  id: string;
  children: Descendant[];
  content: Descendant[];
};

export type CustomElement =
  | FragmentElement
  | ParagraphElement
  | HeadingElement
  | ImageElement
  | LinkElement
  | QuoteElement
  | CodeElement
  | BulletedListElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | ListItemElement
  | NumberedListElement
  | ChapterElement
  | AnnotationElement;

export type RedactionColor = 'black' | 'yellow' | 'fuchsia';

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  redacted?: RedactionColor;
};

declare module 'slate' {
  // eslint-disable-next-line no-unused-vars
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
