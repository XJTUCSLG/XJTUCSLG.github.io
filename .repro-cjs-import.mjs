// 最小复现体：一个 ESM 文件 import 一个 CJS 依赖（picomatch 4.0.7 是 CJS）。
// 与 astro/dist/content/loaders/glob.js 的 import picomatch from "picomatch" 同构。
import picomatch from 'picomatch';

export const isMatch = typeof picomatch === 'function';
