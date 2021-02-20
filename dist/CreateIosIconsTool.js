"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIosIconsTool = void 0;
const minimist_1 = __importDefault(require("minimist"));
const version_1 = require("./version");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const command_exists_1 = __importDefault(require("command-exists"));
const promisify_child_process_1 = require("promisify-child-process");
class CreateIosIconsTool {
    constructor(options) {
        var _a, _b, _c, _d;
        if (!options || !options.toolName || !options.log) {
            throw new Error("Must supply options argument with toolName and log");
        }
        this.toolName = options.toolName;
        this.log = options.log;
        this.debug = !!options.debug;
        this.path = (_a = options.path) !== null && _a !== void 0 ? _a : path_1.default;
        this.fs = (_b = options.fs) !== null && _b !== void 0 ? _b : fs_extra_1.default;
        this.commandExists = (_c = options.commandExists) !== null && _c !== void 0 ? _c : command_exists_1.default;
        this.spawn = (_d = options.spawn) !== null && _d !== void 0 ? _d : promisify_child_process_1.spawn;
    }
    run(argv) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                string: [],
                boolean: ["help", "version", "debug"],
                alias: {},
                default: {},
            };
            const args = minimist_1.default(argv, options);
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
`);
                return 0;
            }
            this.debug = args.debug;
            if (args.version) {
                this.log.info(`${version_1.fullVersion}`);
                return 0;
            }
            if (args._.length < 2) {
                throw new Error("Please supply one .pdf file and one .xcassets directory");
            }
            const assetsDir = args._[args._.length - 1];
            if (this.path.extname(assetsDir) !== ".xcassets") {
                throw new Error(`Assets directory '${assetsDir}' must end in '.xcassets'`);
            }
            this.fs.ensureDir(assetsDir);
            if (!(yield this.commandExists("convert"))) {
                throw new Error("Executable 'convert' not found in path. Please 'brew install imagemagick'.");
            }
            if (!(yield this.commandExists("gs"))) {
                throw new Error("Executable 'gs' not found in path. Please 'brew install ghostscript'.");
            }
            for (const pdfFile of args._.slice(0, args._.length - 1)) {
                if (this.path.extname(pdfFile) !== ".pdf") {
                    throw new Error(`File ${pdfFile} does not have a '.pdf' extension`);
                }
                const iconSetDir = this.path.join(assetsDir, this.path.basename(pdfFile, ".pdf")) +
                    ".appiconset";
                yield this.fs.emptyDir(iconSetDir);
                this.log.info(`Creating icons from '${pdfFile}' into directory '${iconSetDir}'`);
                yield Promise.all([20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024].map((size) => __awaiter(this, void 0, void 0, function* () {
                    this.log.info(`Creating ${size}px icon`);
                    return this.spawn("convert", [
                        "-density",
                        "400",
                        pdfFile,
                        "-scale",
                        `${size}x${size}`,
                        `${iconSetDir}/appicon_${size}.png`,
                    ], {});
                })));
                const contents = JSON.stringify({
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
                }, null, "  ");
                yield this.fs.writeFile(this.path.join(iconSetDir, "Contents.json"), contents);
            }
            return 0;
        });
    }
}
exports.CreateIosIconsTool = CreateIosIconsTool;
//# sourceMappingURL=CreateIosIconsTool.js.map