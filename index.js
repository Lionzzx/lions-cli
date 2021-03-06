/*
 * @Descripttion:
 * @Author: xiaozm
 * @Date: 2019-11-15 15:21:26
 * @LastEditors: xiaozm
 * @LastEditTime: 2019-11-15 15:25:09
 */

console.log('小泽玛工具')

var program = require('commander')
var download = require('download-git-repo')
var handlebars = require('handlebars')
var inquirer = require('inquirer')
var fs = require('fs')
var ora = require('ora')
var chalk = require('chalk')
var logSymbols = require('log-symbols')

program.version('1.0')
const templates = {
  block: {
    url: 'git@39.100.245.58:xiaozm/block.git',
    downloadUrl: 'git@39.100.245.58:xiaozm/block.git'
  }
}
program
  .command('init <template> <project>')
  .description('初始化项目模板')
  .action((template, project) => {
    const { downloadUrl } = templates[template]
    const spinner = ora('loading 正在下载模板').start()
    download(downloadUrl, project, { clone: true }, err => {
      if (err) {
        console.log(logSymbols.warning, chalk.yellow('初始化失败'))
        return spinner.fail()
      }
      spinner.succeed()
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: '请输入项目名称'
          },
          {
            type: 'input',
            name: 'description',
            message: '请输入项目简介'
          },
          {
            type: 'input',
            name: 'author',
            message: '请输入作者名称'
          }
        ])
        .then(answers => {
          const packagePath = `./${project}/package.json`
          const packageContent = fs.readFileSync(packagePath, 'utf8')

          const packageResult = handlebars.compile(packageContent)(answers)
          fs.writeFileSync(packagePath, packageResult)
          chalk.yellow('初始化成功')
        })
    })
  })

program
  .command('list')
  .description('查看所有可用模板')
  .action(() => {
    console.log('haha')
  })
// must be before .parse() since
// node's emit() is immediate

program.on('--help', function() {
  console.log('')
  console.log('Examples:')
  console.log('  $ custom-help --help')
  console.log('  $ custom-help -h')
})

program.parse(process.argv)

console.log('stuff')
