#!/usr/bin/env node

import { program } from 'commander'
import fs from 'fs/promises'
import inquirer from 'inquirer'
import ora from 'ora'
import path from 'path'
import url from 'url'

import { execute } from '../src/index.js'

program
	.name('create-buttonize')
	.description('CLI to create Buttonize example apps')
	.option('--template <template>', 'Use a specific template')
	.argument('[name]', 'The name of your project')
	.action(async (argumentName, opts) => {
		const cwd = process.cwd()
		const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
		process.chdir(__dirname)

		const [preset, name, destination, parameters] =
			await (async function (): Promise<
				[string, string, string, Record<string, string>]
			> {
				// Eventually we can have here drop-in presets in future

				const answers = await inquirer.prompt([
					{
						name: 'name',
						type: 'input',
						default: 'my-buttonize-app',
						when: !argumentName,
						message: 'Project name'
					}
				])
				answers.name = answers.name || argumentName
				const destination = path.join(cwd, answers.name)
				if (opts.template) {
					return [
						`../presets/${opts.template}`,
						answers.name,
						destination,
						answers
					]
				}
				return [
					'../presets/examples/discount-code-generator',
					answers.name,
					destination,
					answers
				]
			})()

		const spinner = ora()

		try {
			await fs.access(preset)
		} catch {
			spinner.fail(
				`Template not found for ` + preset.replace('../presets/', '')
			)
			return
		}
		spinner.start('Creating project')
		try {
			await execute({
				source: preset,
				destination,
				parameters: parameters ?? {}
			})
			spinner.succeed('Copied template files')
			console.log()
			console.log(`Next steps:`)
			if (destination !== cwd) {
				console.log(`- cd ${name}`)
			}
			console.log(`- npm install (or pnpm install, or yarn)`)
			console.log(`- npm run dev`)
		} catch (e) {
			spinner.fail('Failed')
			console.error(e)
		}
	})

program.parse()
