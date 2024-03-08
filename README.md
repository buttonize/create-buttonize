
<p align="center">
  <a href="https://buttonize.io">
    <img width="350" alt="Buttonize.io" src="https://user-images.githubusercontent.com/6282843/212024942-9fd50774-ea26-48ba-b2cf-ca2584498c9a.png">
  </a>
</p>

---

<p align="center">
  <a href="https://discord.buttonize.io"><img alt="Discord" src="https://img.shields.io/discord/1038752242238496779?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/create-buttonize"><img alt="npm" src="https://img.shields.io/npm/v/create-buttonize?style=flat-square" /></a>
  <a href="https://github.com/buttonize/create-buttonize/actions/workflows/release.yml?query=branch%3Amaster"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/buttonize/create-buttonize/release.yml?branch=master&style=flat-square&logo=github" /></a>
</p>

# `create-buttonize`

Simple CLI for creating Buttonize example apps.

## What is Buttonize

Buttonize enables you to build internals tools with [AWS CDK](https://aws.amazon.com/cdk/).

Hook-up UI components directly to AWS Lambda functions. Just install Buttonize and deploy your CDK. That's it.

## Usage

There's no need install this CLI. Just use it directly to create your projects.

With npx

```bash
npx create-buttonize
```

Or with npm 6+

```bash
npm init buttonize
```

Or with Yarn 0.25+

```bash
yarn create buttonize
```

Or with PNPM 

```bash
pnpm create buttonize
```

This will prompt you for a folder name and bootstrap the application in that directory.

## Options

Pass in the following (optional) options.

### `--template`

Instead of the standard starter, you can choose from multiple examples.

```bash
npx create-buttonize --template=examples/discount-code-generator
```

### `--api-key`

API Key to be pre-filled in the project.

```bash
npx create-buttonize --api-key=btnz_mybuttonizekey1234567
```

---

## Arguments

### `<destination>`

Specify a project name, instead of typing it into the interactive prompt.

```bash
npx create-buttonize my-buttonize-app
```

---

## Buttonize Docs

Learn more at [docs.buttonize.io](https://docs.buttonize.io)

---

**Join our community** [Discord](https://discord.buttonize.io) | [Twitter](https://twitter.com/Buttonizeio)
