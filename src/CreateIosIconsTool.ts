import parseArgs from "minimist"
import { fullVersion } from "./version"
import path from "path"
import fs from "fs-extra"
import commandExists from "command-exists"
import { spawn } from "promisify-child-process"

export class CreateIosIconsTool {
  toolName: string
  log: any
  debug: boolean
  fs: any
  path: any
  commandExists: any
  spawn: any

  constructor(options: any) {
    if (!options || !options.toolName || !options.log) {
      throw new Error("Must supply options argument with toolName and log")
    }

    this.toolName = options.toolName
    this.log = options.log
    this.debug = !!options.debug
    this.path = options.path ?? path
    this.fs = options.fs ?? fs
    this.commandExists = options.commandExists ?? commandExists
    this.spawn = options.spawn ?? spawn
  }

  async run(argv: string[]): Promise<number> {
    const options = {
      string: [],
      boolean: ["help", "version", "debug"],
      alias: {},
      default: {},
    }
    const args = parseArgs(argv, options)

    if (args.help) {
      this.log.info(`Create iOS icons from PDF

Usage:
  ${this.toolName} [--debug] <pdf-file> [...<pdf-file>] <assets-dir>
  ${this.toolName} --help | --version

Generates Xcode compatible icon assets from one or more PDF's.

Options:

  --help            Displays this help
  --version         Displays tool version
  --debug           Give additional debugging information
`)
      return 0
    }

    this.debug = args.debug

    if (args.version) {
      this.log.info(`${fullVersion}`)
      return 0
    }

    if (args._.length < 2) {
      throw new Error("Please supply one .pdf file and one .xcassets directory")
    }

    const assetsDir = args._[args._.length - 1]

    if (this.path.extname(assetsDir) !== ".xcassets") {
      throw new Error(`Assets directory '${assetsDir}' must end in '.xcassets'`)
    }

    this.fs.ensureDir(assetsDir)

    if (!(await this.commandExists("convert"))) {
      throw new Error(
        "Executable 'convert' not found in path. Please 'brew install imagemagick'."
      )
    }

    if (!(await this.commandExists("gs"))) {
      throw new Error(
        "Executable 'gs' not found in path. Please 'brew install ghostscript'."
      )
    }

    for (const pdfFile of args._.slice(0, args._.length - 1)) {
      if (this.path.extname(pdfFile) !== ".pdf") {
        throw new Error(`File ${pdfFile} does not have a '.pdf' extension`)
      }

      const iconSetDir =
        this.path.join(assetsDir, this.path.basename(pdfFile, ".pdf")) +
        ".appiconset"

      await this.fs.emptyDir(iconSetDir)

      this.log.info(
        `Creating icons from '${pdfFile}' into directory '${iconSetDir}'`
      )
      await Promise.all(
        [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024].map(
          async (size) => {
            this.log.info(`Creating ${size}px icon`)
            return this.spawn(
              "convert",
              [
                "-density",
                "400",
                pdfFile,
                "-scale",
                `${size}x${size}`,
                `${iconSetDir}/appicon_${size}.png`,
              ],
              {}
            )
          }
        )
      )
      const contents = JSON.stringify(
        {
          images: [
            {
              size: "20x20",
              idiom: "iphone",
              filename: "appicon_40.png",
              scale: "2x",
            },
            {
              size: "20x20",
              idiom: "iphone",
              filename: "appicon_60.png",
              scale: "3x",
            },
            {
              size: "29x29",
              idiom: "iphone",
              filename: "appicon_58.png",
              scale: "2x",
            },
            {
              size: "29x29",
              idiom: "iphone",
              filename: "appicon_87.png",
              scale: "3x",
            },
            {
              size: "40x40",
              idiom: "iphone",
              filename: "appicon_80.png",
              scale: "2x",
            },
            {
              size: "40x40",
              idiom: "iphone",
              filename: "appicon_120.png",
              scale: "3x",
            },
            {
              size: "60x60",
              idiom: "iphone",
              filename: "appicon_120.png",
              scale: "2x",
            },
            {
              size: "60x60",
              idiom: "iphone",
              filename: "appicon_180.png",
              scale: "3x",
            },
            {
              size: "20x20",
              idiom: "ipad",
              filename: "appicon_20.png",
              scale: "1x",
            },
            {
              size: "20x20",
              idiom: "ipad",
              filename: "appicon_40.png",
              scale: "2x",
            },
            {
              size: "29x29",
              idiom: "ipad",
              filename: "appicon_29.png",
              scale: "1x",
            },
            {
              size: "29x29",
              idiom: "ipad",
              filename: "appicon_58.png",
              scale: "2x",
            },
            {
              size: "40x40",
              idiom: "ipad",
              filename: "appicon_40.png",
              scale: "1x",
            },
            {
              size: "40x40",
              idiom: "ipad",
              filename: "appicon_80.png",
              scale: "2x",
            },
            {
              size: "76x76",
              idiom: "ipad",
              filename: "appicon_76.png",
              scale: "1x",
            },
            {
              size: "76x76",
              idiom: "ipad",
              filename: "appicon_152.png",
              scale: "2x",
            },
            {
              size: "83.5x83.5",
              idiom: "ipad",
              filename: "appicon_167.png",
              scale: "2x",
            },
            {
              size: "1024x1024",
              idiom: "ios-marketing",
              filename: "appicon_1024.png",
              scale: "1x",
            },
          ],
          info: {
            version: 1,
            author: "xcode",
          },
        },
        null,
        "  "
      )
      await this.fs.writeFile(
        this.path.join(iconSetDir, "Contents.json"),
        contents
      )
    }

    return 0
  }
}
