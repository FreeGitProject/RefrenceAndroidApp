   declare module 'react-native-syntax-highlighter' {
       import { Component } from 'react';

       export interface SyntaxHighlighterProps {
           language?: string;
           style?: any;
           children: string;
       }

       export default class SyntaxHighlighter extends Component<SyntaxHighlighterProps> {}
   }
   