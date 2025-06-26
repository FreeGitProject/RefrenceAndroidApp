declare module 'react-native-syntax-highlighter' {
  import { Component } from 'react';

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any; // Consider replacing 'any' with a more specific type if possible
    customStyle?: any; // Added for customStyle prop
    fontSize?: number;
    fontFamily?: string;
    children: string;
  }

  export const atomOneDark: any; // Added for theme export
  export default class SyntaxHighlighter extends Component<SyntaxHighlighterProps> {}
}