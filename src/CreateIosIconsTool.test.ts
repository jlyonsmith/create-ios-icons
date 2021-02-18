import { CreateIosIconsTool } from "./CreateIosIconsTool"

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
  // Happy path
  const tool = new CreateIosIconsTool(container)

  await expect(tool.run([])).resolves.toBe(0)

  // Version
  await expect(tool.run(["--version"])).resolves.toBe(0)

  // Help
  await expect(tool.run(["--help"])).resolves.toBe(0)
})
