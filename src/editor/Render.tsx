import React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';

import { Box } from '../components/basic';
import { styled } from '../stitches.config';

const Annotation = styled('span', {
  backgroundColor: 'red',
});

const Anchor = styled('a', {
  textDecoration: 'underline',
  cursor: 'pointer',
  color: 'blue',
});

const Paragraph = styled('p', {
  mb: '$4',
});

function AnnotationElement({ attributes, element, children }: RenderElementProps) {
  if (element.type !== 'annotation') throw new Error(`<AnnotationElement /> expects annotation`);

  return <Annotation {...attributes}>{children}</Annotation>;
}

function ChapterElement({ attributes, element, children }: RenderElementProps) {
  if (element.type !== 'chapter') throw new Error(`<ChapterElement /> expects chapter`);

  return (
    <Box css={{ py: '$48', textAlign: 'center' }}>
      <Box as="h2" css={{ pb: '$2' }}>
        {element.title}
      </Box>
      <Box {...attributes}>{children}</Box>
    </Box>
  );
}

export function Element(props: RenderElementProps) {
  const { attributes, children, element } = props;

  switch (element.type) {
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'code':
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      );
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>;
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>;
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'link':
      return (
        <Anchor href={element.url} {...attributes}>
          {children}
        </Anchor>
      );
    case 'image':
      return <ImageElement {...props} />;
    case 'chapter':
      return <ChapterElement {...props} />;
    case 'annotation':
      return <AnnotationElement {...props} />;
    case 'fragment':
      return <div {...attributes}>{children}</div>;
    default:
      return <Paragraph {...attributes}>{children}</Paragraph>;
  }
}

function ImageElement({ attributes, children, element }: RenderElementProps) {
  if (element.type !== 'image') throw new Error(`<ImageElement /> expects image`);

  // const selected = useSelected();
  // const focused = useFocused();

  return (
    <div {...attributes}>
      {children}
      <img
        src={element.url}
        alt="idk"
        // className={css`
        //   display: block;
        //   max-width: 100%;
        //   max-height: 20em;
        //   box-shadow: ${selected && focused ? '0 0 0 2px blue;' : 'none'};
        // `}
      />
    </div>
  );
}

export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  return (
    <Box
      as="span"
      css={{
        bg: leaf.redacted ?? undefined,
        fontWeight: leaf.bold ? '$bold' : undefined,
        fontStyle: leaf.italic ? 'italic' : undefined,
        textDecoration: leaf.strikethrough
          ? 'line-through'
          : leaf.underline
          ? 'underline'
          : undefined,
      }}
      {...attributes}
    >
      {children}
    </Box>
  );
}
