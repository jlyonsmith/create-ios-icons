import { CreateIosIconsTool } from "./CreateIosIconsTool"
import path from "path"

let container = null

beforeEach(() => {
  container = {
    toolName: "stampver",
    debug: false,
    log: {
      info: () => undefined,
      warning: () => undefined,
      error: () => undefined,
    },
  }
})

test("constructor", () => {
  const tool = new CreateIosIconsTool(container)

  // Happy path
  expect(tool).not.toBeNull()

  // Missing options
  expect(() => new CreateIosIconsTool({})).toThrowError("Must supply")
})

test("run", async () => {
  Object.assign(container, {
    fs: {
      ensureDir: async () => undefined,
      emptyDir: async () => undefined,
      writeFile: async () => undefined,
    },
    path: {
      join: path.join,
      basename: path.basename,
      extname: path.extname,
    },
    commandExists: async () => true,
    "promisify-child-process": {
      spawn: async () => undefined,
    },
    spawn: async () => ({}),
  })
  // Happy path
  let tool = new CreateIosIconsTool(container)

  await expect(tool.run(["some.pdf", "/a/b/c/Assets.xcassets"])).resolves.toBe(
    0
  )

  // Version
  await expect(tool.run(["--version"])).resolves.toBe(0)

  // Help
  await expect(tool.run(["--help"])).resolves.toBe(0)

  // Missing args
  await expect(() => tool.run([])).rejects.toThrowError()

  // Bad asset dir name
  await expect(() => tool.run(["some.pdf", "/a/b/c"])).rejects.toThrowError()

  // Bad pdf name
  await expect(() =>
    tool.run(["some", "/a/b/c.xcassets"])
  ).rejects.toThrowError()

  // Missing convert
  container.commandExists = async (cmd) => (cmd === "convert" ? false : true)

  tool = new CreateIosIconsTool(container)

  await expect(() =>
    tool.run(["some.pdf", "/a/b/c.xcassets"])
  ).rejects.toThrowError()

  // Missing gs
  container.commandExists = async (cmd) => (cmd === "gs" ? false : true)

  tool = new CreateIosIconsTool(container)

  await expect(() =>
    tool.run(["some.pdf", "/a/b/c.xcassets"])
  ).rejects.toThrowError()
})
