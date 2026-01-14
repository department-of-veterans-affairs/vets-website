/**
 * Type fix for @department-of-veterans-affairs/component-library
 * 
 * This file resolves React type conflicts between the component library
 * and the main React types. The component library uses react-redux which
 * has nested @types/react that creates incompatible ReactPortal types.
 * 
 * The error: Overlay.render() returns ReactPortal from nested @types/react,
 * which TypeScript sees as incompatible with React.ReactPortal from main
 * @types/react, even though both are assignable to ReactNode.
 * 
 * Solution: Use type compatibility at the structural level to make
 * ReactPortal from any @types/react version compatible with ReactNode.
 */

// Ensure this file is treated as a module
export {};

// Make ReactPortal compatible by ensuring it's structurally compatible with ReactNode
// This is done by making ReactPortal's children accept both ReactNode types
declare global {
  namespace React {
    // Augment ReactPortal to make it compatible with both ReactNode versions
    // The key is making the children property accept both types
    interface ReactPortal {
      // Make children accept both the main ReactNode and nested ReactNode
      // This makes ReactPortal from nested @types/react assignable to ReactNode
      children: 
        | ReactNode 
        | import('react-redux/node_modules/@types/react').ReactNode
        | import('react-redux/node_modules/@types/react').ReactPortal;
    }
  }
}

// Override the component library's createOverlayComponent module
// This ensures the Overlay class returns ReactNode instead of ReactPortal
declare module '@department-of-veterans-affairs/component-library/dist/react-bindings/react-component-lib/createOverlayComponent' {
  import { Component, ComponentType, ReactNode } from 'react';
  
  export interface OverlayProps {
    [key: string]: any;
  }
  
  // Override: Make render() return ReactNode
  // This is the primary fix - ensures compatibility with Component's render signature
  export class Overlay extends Component<OverlayProps, any, any> {
    render(): ReactNode;
  }
  
  export default function createOverlayComponent(
    componentName: string,
    elementName: string
  ): ComponentType<OverlayProps>;
}
