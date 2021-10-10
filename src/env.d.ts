/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'xmp-js';


// declare module '@wizpanda/super-gif';

// interface Options {
//     [key: string]: any,
//  }
// // declare module '*.js' {
// //     export default function SuperGif(options: Options): void;
// // }

// declare function SuperGif(options: Options): void;
// declare namespace SuperGif{}
// export = SuperGif; // 这样写兼容性更好