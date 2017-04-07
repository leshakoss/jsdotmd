const {lexer} = require('marked')

const fs = require('fs-promise')

const defaultLangCodes = ['javascript', 'js', 'node']

function parse (source, options) {
  options = options || {}

  const langCodes = options.langCodes || defaultLangCodes
  const separator = options.separator || '\n\n'

  const tokens = lexer(source)

  const code = tokens
    .filter(({type, lang}) => type === 'code' && langCodes.includes(lang))
    .map(({text}) => text)
    .join(separator)

  return code
}

function compile (sourcePath, destinationPath, options) {
  options = options || {}

  const encoding = options.encoding || 'utf-8'

  return fs.readFile(sourcePath, {encoding})
    .then((contents) => parse(contents, options))
    .then((code) => fs.writeFile(destinationPath, code, {encoding}))
}

module.exports = {parse, compile}