#!/usr/bin/env node

const jsdotmd = require('../lib')
const program = require('commander')
const path = require('path')

program
  .usage('[options] <source> <destination>')
  .option(
    '-l, --langCodes <items>',
    'List of language codes that are compiled into the destination, separated by commas. Default: js,javascript,node',
    (string) => string.split(',')
  )
  .parse(process.argv)

if (program.args.length !== 2) {
  program.help()
}

const {langCodes, args: [source, destination]} = program

const currentPath = process.cwd()
const sourcePath = path.join(currentPath, source)
const destinationPath = path.join(currentPath, destination)

jsdotmd.compile(sourcePath, destinationPath, {langCodes})
  .catch((err) => console.log('Something went wrong!', err))
