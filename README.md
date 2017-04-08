# jsdotmd

## What is it?

**jsdotmd** takes all JavaScript inline code tags from
[Github Flavored Markdown](https://help.github.com/categories/writing-on-github/) file
and compiles them into JavaScript file.

## Why would I use it?

You can use it if you want to write extensive code documentation.
See [Literate programming](https://en.wikipedia.org/wiki/Literate_programming)

## Why did you do that?

I wanted to make a language, whose compiler is written on itself
and is also its [`README`](https://raw.githubusercontent.com/leshakoss/jsdotmd/master/README.md).
Just for fun.

## How to use the CLI?

Install the package globally:

```sh
npm install --global jsdotmd
# or
yarn global add jsdotmd
```

After installing, use the following syntax:

```sh
jsdotmd [source file] [destination file]
```

## How to use the parser in my code?

Install the package locally:

```sh
npm install jsdotmd
# or
yarn add jsdotmd
```

```
import {parse} from 'jsdotmd'

const src = []
  .concat('# Hello, Markdown!')
  .concat('```javascript')
  .concat('console.log("Hello, JavaScript!")')
  .concat('```')
  .join('\n')

const result = parse(source)
//=> 'console.log("Hello, JavaScript!")'
```

Since working with JavaScript code in Markdown code tags in JavaScript strings is a bit messy,
you can also use file-to-file compiler:

```
import path from 'path'
import {compile} from 'jsdotmd'

const sourcePath = path.join(__dirname, 'index.js.md')
const destinationPath = path.join(__dirname, 'index.js')

compile(sourcePath, destinationPath)
  .catch((err) => console.log('Something went wrong!', err))
```

## How does the parser work?

The code is very simple.

It uses only two dependencies:

- [`marked`](https://www.npmjs.com/package/marked) for parsing Markdown source file.
  We don't need the HTML output, so we use only lexer.

  ```javascript
  const {lexer} = require('marked')
  ```

- [`fs-promise`](https://www.npmjs.com/package/fs-promise) to work with the file system easier.

  ```javascript
  const fs = require('fs-promise')
  ```

By default, *jsdotmd* compiles into JavaScript code only those Markdown inline code tags,
which are marked `javascript`, `js` or `node`.

```javascript
const defaultLangCodes = ['javascript', 'js', 'node']
```

From CLI, you can specify tags like this:

```sh
jsdotmd [source file] [destination file] -l js,javascript,node,jsx,typescript
```

### `parse` function

```javascript
function parse (source, options) {
  options = options || {}

  const langCodes = options.langCodes || defaultLangCodes
  const separator = options.separator || '\n\n'
```

`parse` function joins code blocks using `separator`
specified in the second argments `options` which is two line breaks by default.

```javascript
  const tokens = lexer(source)
```

Lexer returns an array of tokens. We are only interested in tokens with type `'code'`.
They look like this:

```
{
  type: 'code',
  lang: 'javascript',
  text: '  const tokens = lexer(source)'
}
```

Next we filter only the tokens we need, retrieve text from them and join them with a separator.

```javascript
  const code = tokens
    .filter(({type, lang}) => type === 'code' && langCodes.includes(lang))
    .map(({text}) => text)
    .join(separator)

  return code
}
```

### `compile` function

Compile function is even simpler. It just reads file, specified in the first argument,
parses it with `parse` and writes it to file, specified in the second argument. Done!

```javascript
function compile (sourcePath, destinationPath, options) {
  options = options || {}

  const encoding = options.encoding || 'utf-8'

  return fs.readFile(sourcePath, {encoding})
    .then((contents) => parse(contents, options))
    .then((code) => fs.writeFile(destinationPath, code, {encoding}))
}
```

*jsdotmd* exports both `parse` and `compile` functions for you to use.

```javascript
module.exports = {parse, compile}
```

## How does the CLI work?

It uses [`commander`](https://www.npmjs.com/package/commander).
Check [`bin/jsdotmd.js`](https://github.com/leshakoss/jsdotmd/blob/master/bin/jsdotmd.js).
I haven't written it in *jsdotmd* for simplicity.

## I've made changes to the code. How to recompile the compiler?

Run `npm run build`. It compiles [`README.md`](https://github.com/leshakoss/jsdotmd/blob/master/README.md)
into [`lib/index.js`](https://github.com/leshakoss/jsdotmd/blob/master/lib/index.js).

## How to test if the code works?

Run `npm test`. It runs `npm run build` two times. If the compiler compiles itself after the recompiling,
it probably works. If not, well, no luck.

## Should I use it in the real project?

Probably not.

## That's super weird.

Thank you.
