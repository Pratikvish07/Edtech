/// <reference types="nativewind/types" />

declare module 'nativewind' {
  export function cssInterop<T extends React.ComponentType<any>>(component: T, options: { className?: string }): T;
  export function styled<T extends React.ComponentType<any>>(component: T): T;
}
