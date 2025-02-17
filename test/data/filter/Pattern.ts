import { pipe } from "@effect/data/Function"
import * as S from "@effect/schema"

describe.concurrent("pattern", () => {
  it("Guard", () => {
    const schema = pipe(S.string, S.pattern(/^abb+$/))
    const is = S.is(schema)
    expect(is("abb")).toEqual(true)
    expect(is("abbb")).toEqual(true)

    expect(is("ab")).toEqual(false)
    expect(is("a")).toEqual(false)
  })

  it("should reset lastIndex to 0 before each `test` call (#88)", () => {
    const regex = /^(A|B)$/g
    const schema: S.Schema<string> = pipe(
      S.string,
      S.pattern(regex)
    )
    expect(S.decodeOrThrow(schema)("A")).toEqual("A")
    expect(S.decodeOrThrow(schema)("A")).toEqual("A")
  })
})
