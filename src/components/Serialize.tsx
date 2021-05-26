import Observer from '@researchgate/react-intersection-observer';
import React from 'react';
import { Descendant, Text } from 'slate';
import { RenderElementProps, RenderLeafProps } from 'slate-react';

import { NavigationStack } from '../lib/NavigationStack';
import { styled } from '../stitches.config';
import { Box } from './basic';

type PlainElementProps = Pick<RenderElementProps, 'element' | 'children'>;

const Annotation = styled('span', {
  cursor: 'pointer',
});

const AnnotationText = styled('span', {
  px: '$px',
  '&:hover': {
    bg: '$slate300',
  },
  variants: {
    focused: {
      true: {
        bg: '$slate500',
        '&:hover': {
          bg: '$slate700',
        },
      },
    },
  },
});

const AnnotationTag = styled('span', {
  display: 'inline-block',
  verticalAlign: 'top',
  fontSize: '$xs',
  textIndent: 0,
});

const AnnotationTagInner = styled('span', {
  br: '$full',
  mx: '$1',
  bg: 'rgba(110, 110, 110, 0.5)',
  color: 'white',
  px: '$2',
});

const Anchor = styled('a', {
  textDecoration: 'underline',
  cursor: 'pointer',
  color: 'blue',
});

const Paragraph = styled('p', {
  mb: '$4',
});

function AnnotationElement({ element, children, ...rest }: PlainElementProps) {
  if (element.type !== 'annotation') throw new Error(`<AnnotationElement /> expects annotation`);

  const nav = NavigationStack.useContainer();
  const focused = nav.focusedAnnotationId === element.id;

  return (
    <Observer
      rootMargin="48% 0% -48% 0%"
      threshold={1}
      onChange={({ isIntersecting }) => {
        if (isIntersecting) {
          nav.focus(element.id);
        } else {
          nav.defocus(element.id);
        }
      }}
    >
      <Annotation {...rest} onClick={() => nav.push(element.id)}>
        <AnnotationText focused={focused}>{children}</AnnotationText>
        <AnnotationTag>
          <AnnotationTagInner>{element.id}</AnnotationTagInner>
        </AnnotationTag>
      </Annotation>
    </Observer>
  );
}

function ChapterElement({ element, children, ...rest }: PlainElementProps) {
  if (element.type !== 'chapter') throw new Error(`<ChapterElement /> expects chapter`);

  return (
    <Box css={{ py: '$48', textAlign: 'center' }}>
      <Box as="h2" css={{ pb: '$2' }}>
        {element.title}
      </Box>
      <Box {...rest}>{children}</Box>
    </Box>
  );
}

function ImageElement({ children, element, ...rest }: PlainElementProps) {
  if (element.type !== 'image') throw new Error(`<ImageElement /> expects image`);

  return (
    <div {...rest}>
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

export function PlainElement(props: PlainElementProps) {
  const { children, element, ...rest } = props;

  switch (element.type) {
    case 'quote':
      return <blockquote {...rest}>{children}</blockquote>;
    case 'code':
      return (
        <pre>
          <code {...rest}>{children}</code>
        </pre>
      );
    case 'bulleted-list':
      return <ul {...rest}>{children}</ul>;
    case 'heading-one':
      return <h1 {...rest}>{children}</h1>;
    case 'heading-two':
      return <h2 {...rest}>{children}</h2>;
    case 'heading-three':
      return <h3 {...rest}>{children}</h3>;
    case 'heading-four':
      return <h4 {...rest}>{children}</h4>;
    case 'heading-five':
      return <h5 {...rest}>{children}</h5>;
    case 'heading-six':
      return <h6 {...rest}>{children}</h6>;
    case 'list-item':
      return <li {...rest}>{children}</li>;
    case 'numbered-list':
      return <ol {...rest}>{children}</ol>;
    case 'link':
      return (
        <Anchor href={element.url} {...rest}>
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
      return <div {...rest}>{children}</div>;
    default:
      return <Paragraph {...rest}>{children}</Paragraph>;
  }
}

export function PlainLeaf({ children, leaf, ...rest }: Pick<RenderLeafProps, 'leaf' | 'children'>) {
  const Element = leaf.bold
    ? 'strong'
    : leaf.code
    ? 'code'
    : leaf.italic
    ? 'em'
    : leaf.underline
    ? 'u'
    : leaf.strikethrough
    ? 'del'
    : 'span';

  return (
    <Element
      style={{
        backgroundColor: leaf.redacted ?? undefined,
      }}
      {...rest}
    >
      {children}
    </Element>
  );
}

export function Serialize({ node }: { node: Descendant }) {
  if (Text.isText(node)) {
    return <PlainLeaf leaf={node}>{node.text}</PlainLeaf>;
  }

  return (
    <PlainElement element={node}>
      {node.children?.map((child, i) => (
        <Serialize key={i} node={child} />
      ))}
    </PlainElement>
  );
}
