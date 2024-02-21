import { execSync } from 'child_process'
import type { Operation } from 'fast-json-patch'
import * as fastJsonPath from 'fast-json-patch'
import fs from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import { pathToFileURL } from 'url'

const { applyOperation } = fastJsonPath.default

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function extract() {
	return {
		type: 'extract'
	} as const
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function remove(path: string) {
	return {
		type: 'remove',
		path
	} as const
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function patch(opts: { file: string; operations: Operation[] }) {
	return {
		type: 'patch',
		...opts
	} as const
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function str_replace(opts: {
	file: string
	pattern: string
	replacement: string
}) {
	return {
		type: 'str_replace',
		...opts
	} as const
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function append(opts: { file: string; string: string }) {
	return {
		type: 'append',
		...opts
	} as const
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function install(opts: {
	packages: string[]
	path?: string
	dev?: boolean
}) {
	return {
		type: 'install',
		...opts
	} as const
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function cmd(opts: { cmd: string; cwd?: string }) {
	return {
		type: 'cmd',
		...opts
	} as const
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function extend(path: string) {
	return {
		type: 'extend',
		path: path
	} as const
}

type Step =
	| ReturnType<typeof remove>
	| ReturnType<typeof patch>
	| ReturnType<typeof str_replace>
	| ReturnType<typeof append>
	| ReturnType<typeof install>
	| ReturnType<typeof extract>
	| ReturnType<typeof extend>
	| ReturnType<typeof cmd>

export async function execute(opts: {
	source: string
	destination: string
	extended?: boolean
	parameters: Record<string, string>
}) {
	const source = path.resolve(opts.source)
	const result = await import(
		pathToFileURL(path.join(source, 'preset.mjs')).href
	)

	const steps: Step[] = result.default

	for (const step of steps) {
		switch (step.type) {
			case 'extract': {
				const templates = path.join(source, 'templates')
				const files = await listFiles(templates)
				for (const file of files) {
					const relative = path.relative(
						templates,
						file.replace('gitignore', '.gitignore')
					)
					const destination = path.join(opts.destination, relative)
					await fs.mkdir(path.dirname(destination), { recursive: true })
					await fs.copyFile(file, destination)
				}
				break
			}
			case 'extend': {
				await execute({
					source: path.join('../', step.path),
					destination: opts.destination,
					parameters: opts.parameters,
					extended: true
				})
				break
			}
			case 'remove': {
				await fs.rm(path.join(opts.destination, step.path), {
					recursive: true,
					force: true
				})
				break
			}
			case 'patch': {
				const file = path.join(opts.destination, step.file)
				const contents = JSON.parse(await fs.readFile(file, 'utf8'))
				for (const operation of step.operations) {
					applyOperation(contents, operation)
				}
				await fs.writeFile(file, JSON.stringify(contents, null, 2))
				break
			}
			case 'str_replace': {
				const file = path.join(opts.destination, step.file)
				const contents = await fs.readFile(file, 'utf8')
				await fs.writeFile(
					file,
					contents.replace(step.pattern, step.replacement)
				)
				break
			}
			case 'append': {
				const file = path.join(opts.destination, step.file)
				try {
					const contents = await fs.readFile(file, 'utf8')
					await fs.writeFile(file, `${contents.trimEnd()}${step.string}`)
				} catch (e) {
					if ((e as Error & { code: string }).code !== 'ENOENT') throw e
				}
				break
			}
			case 'cmd': {
				execSync(step.cmd, {
					cwd: path.join(opts.destination, step.cwd || '')
				})
				break
			}
			case 'install': {
				const jsonPath = path.join(
					opts.destination,
					step.path || '.',
					'package.json'
				)
				const json = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
				const key = step.dev ? 'devDependencies' : 'dependencies'
				json[key] = json[key] || {}
				const results = await Promise.all(
					step.packages.map(async (pkg) => {
						let [, version] = pkg.substring(1).split('@')
						if (!version) version = '^' + (await getLatestPackageVersion(pkg))
						return [pkg.replace('@' + version, ''), version]
					})
				)
				for (const [name, value] of results) {
					json[key][name] = value
				}
				await fs.writeFile(jsonPath, JSON.stringify(json, null, 2))
				break
			}
		}
	}

	if (!opts.extended) {
		// App name will be used in CloudFormation stack names,
		// so we need to make sure it's valid.
		const app = path
			.basename(opts.destination)
			// replace _ with -
			.replace(/_/g, '-')
			// remove non-alpha numeric dash characters
			.replace(/[^A-Za-z0-9-]/g, '')
		const appAlpha = app.replace(/[^a-zA-Z0-9]/g, '')

		for (const file of await listFiles(opts.destination)) {
			if (file.includes('.git')) continue
			if (
				!['.ts', '.js', '.tsx', '.jsx', '.json'].some((ext) =>
					file.endsWith(ext)
				)
			)
				continue
			try {
				let contents = await fs.readFile(file, 'utf8')
				contents = contents.replace(/\@\@app/g, app)
				contents = contents.replace(/\@\@normalizedapp/g, appAlpha)
				Object.entries(opts.parameters).forEach(([key, value]) => {
					const regex = new RegExp(`\\@\\@${key}`, 'g')
					contents = contents.replace(regex, value)
				})
				await fs.writeFile(file, contents)
			} catch (ex) {
				continue
			}
		}
	}
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function listFiles(dir: string) {
	if (dir.endsWith('node_modules')) return []
	const results: string[] = []
	for (const file of await fs.readdir(dir)) {
		const p = path.join(dir, file)
		const stat = await fs.stat(p)
		if (stat.isDirectory()) {
			results.push(...(await listFiles(p)))
			continue
		}
		results.push(p)
	}
	return results
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function getLatestPackageVersion(pkg: string) {
	return fetch(`https://registry.npmjs.org/${pkg}/latest`)
		.then((res) => res.json())
		.then((res) => (res as { version: string }).version)
}
