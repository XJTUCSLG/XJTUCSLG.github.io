/**
 * 代码高亮主题：xjtucslg-ink
 *
 * 不是现成的主题，是照站点的调色板定的：
 *   底色用 --code-bg (#1b2024)，正文用 --code-fg (#e7ecee)，
 *   强调色只有一族绿（对应 --accent #0e5b43 的亮版），
 *   另加两族低饱和冷色（青蓝、暗金）用来区分字符串与数字。
 * 一共四个色相，全部低饱和——代码块要能长时间看，不是调色盘。
 *
 * 由 astro.config.mjs 的 markdown.shikiConfig 使用。
 */
export const inkTheme = {
  name: 'xjtucslg-ink',
  type: 'dark',
  colors: {
    'editor.background': '#1b2024',
    'editor.foreground': '#e7ecee',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.quoted.docstring'],
      settings: { foreground: '#5c6c73', fontStyle: 'italic' },
    },
    {
      // 控制流、声明：绿族，全主题最显眼的一类
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'storage',
        'storage.type',
        'storage.modifier',
        'keyword.other.unit',
      ],
      settings: { foreground: '#7ecfae' },
    },
    {
      // 运算符、标点：压暗，让它们退出视线
      scope: [
        'keyword.operator',
        'punctuation',
        'punctuation.separator',
        'punctuation.terminator',
        'meta.brace',
        'punctuation.definition.block',
      ],
      settings: { foreground: '#7b8b92' },
    },
    {
      // 字符串：青蓝族
      scope: [
        'string',
        'string.quoted',
        'string.template',
        'string.regexp',
        'constant.other.symbol',
        'punctuation.definition.string',
      ],
      settings: { foreground: '#9ec6d6' },
    },
    {
      // 数字与字面量：暗金族
      scope: [
        'constant.numeric',
        'constant.language',
        'constant.character',
        'constant.character.escape',
        'support.constant',
        'variable.language',
      ],
      settings: { foreground: '#d9c194' },
    },
    {
      // 函数名、方法名：近白，最亮的一类
      scope: [
        'entity.name.function',
        'support.function',
        'meta.function-call.generic',
        'entity.name.tag',
        'entity.other.attribute-name',
      ],
      settings: { foreground: '#e9f2f4' },
    },
    {
      // 类型、类名：绿青之间
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.name.namespace',
        'support.class',
        'support.type',
        'entity.other.inherited-class',
      ],
      settings: { foreground: '#a8ccc0' },
    },
    {
      // 变量、参数、对象键：正文色略暗一档
      scope: [
        'variable',
        'variable.parameter',
        'variable.other',
        'meta.object-literal.key',
        'support.variable',
      ],
      settings: { foreground: '#c6d2d7' },
    },
    {
      scope: ['entity.name.section', 'markup.heading', 'markup.bold'],
      settings: { foreground: '#e9f2f4', fontStyle: 'bold' },
    },
    {
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      scope: ['markup.underline.link', 'string.other.link'],
      settings: { foreground: '#9ec6d6', fontStyle: 'underline' },
    },
    {
      scope: ['markup.inserted', 'meta.diff.header.to-file', 'punctuation.definition.inserted'],
      settings: { foreground: '#86c7a4' },
    },
    {
      scope: ['markup.deleted', 'meta.diff.header.from-file', 'punctuation.definition.deleted'],
      settings: { foreground: '#c98a7a' },
    },
    {
      // 出错时才用暖色：唯一的例外，因为「红」本身就是信息
      scope: ['invalid', 'invalid.illegal', 'message.error'],
      settings: { foreground: '#e08a76' },
    },
  ],
};
