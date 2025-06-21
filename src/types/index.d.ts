import { ReactElement, ReactNode } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export type FCWithChildren<P = {}> = {
  (props: P & { children?: ReactNode }): ReactElement | null;
};
