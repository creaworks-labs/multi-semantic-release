#!/usr/bin/env node

const meow = require("meow");
const { toPairs, set } = require("lodash");
const runner = require("./runner");
const cli = meow(
	`
  Usage
    $ multi-semantic-release

  Options
    --dry-run Dry run mode.
    --debug Output debugging information.
    --sequential-init  Avoid hypothetical concurrent initialization collisions.
    --sequential-prepare  Avoid hypothetical concurrent preparation collisions. Do not use if your project have cyclic dependencies.
    --first-parent Apply commit filtering to current branch only.
    --deps.bump Define deps version updating rule. Allowed: override, satisfy, inherit.
    --deps.release Define release type for dependent package if any of its deps changes. Supported values: patch, minor, major, inherit.
    --ignore-packages  Packages' list to be ignored on bumping process
    --only-affected Releases the affected packages. Available for Nx.dev only. (default: true)
    --help Help info.

  Examples
    $ multi-semantic-release --debug
    $ multi-semantic-release --deps.bump=satisfy --deps.release=patch
    $ multi-semantic-release --ignore-packages=packages/a/**,packages/b/**
`,
	{
		flags: {
			sequentialInit: {
				type: "boolean",
			},
			sequentialPrepare: {
				type: "boolean",
			},
			firstParent: {
				type: "boolean",
			},
			debug: {
				type: "boolean",
			},
			"deps.bump": {
				type: "string",
				default: "override",
			},
			"deps.release": {
				type: "string",
				default: "patch",
			},
			ignorePackages: {
				type: "string",
			},
			onlyAffected: {
				type: "boolean",
			},
			dryRun: {
				type: "boolean",
			},
		},
	}
);

const processFlags = (flags) => {
	return toPairs(flags).reduce((m, [k, v]) => {
		if (k === "ignorePackages" && v) return set(m, k, v.split(","));
		return set(m, k, v);
	}, {});
};

runner(processFlags(cli.flags));
