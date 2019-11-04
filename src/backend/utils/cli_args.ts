import yargs from 'yargs'

export type CliOptions = {
    config: string
}

export default function parseCliArguments(): CliOptions {
    return yargs
    .option('config', {
        alias: 'c',
        type: 'string',
        default: './config.json5',
        normalize: true
    })
    .help().argv
}