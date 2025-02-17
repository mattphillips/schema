/**
 * @since 1.0.0
 */
import { pipe } from "@effect/data/Function"
import * as O from "@effect/data/Option"
import * as RA from "@effect/data/ReadonlyArray"
import * as H from "@effect/schema/annotation/Hook"
import * as AST from "@effect/schema/AST"
import { formatActual } from "@effect/schema/formatter/Tree"
import * as I from "@effect/schema/internal/common"
import * as P from "@effect/schema/Parser"
import type { Schema } from "@effect/schema/Schema"

/**
 * @category model
 * @since 1.0.0
 */
export interface Pretty<A> extends Schema<A> {
  readonly pretty: (a: A) => string
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const make: <A>(schema: Schema<A>, pretty: Pretty<A>["pretty"]) => Pretty<A> = I.makePretty

const getHook = AST.getAnnotation<H.Hook<Pretty<any>>>(
  H.PrettyHookId
)

const toString = (ast: AST.AST) => make(I.makeSchema(ast), (a) => String(a))

const stringify = (ast: AST.AST) => make(I.makeSchema(ast), (a) => JSON.stringify(a))

const format = (ast: AST.AST) => make(I.makeSchema(ast), formatActual)

/**
 * @since 1.0.0
 */
export const match: AST.Match<Pretty<any>> = {
  "TypeAlias": (ast, go) =>
    pipe(
      getHook(ast),
      O.match(
        () => go(ast.type),
        ({ handler }) => handler(...ast.typeParameters.map(go))
      )
    ),
  "VoidKeyword": (ast) => make(I.makeSchema(ast), () => "void(0)"),
  "NeverKeyword": (ast) =>
    make(I.makeSchema(ast), () => {
      throw new Error("cannot pretty print a `never` value")
    }),
  "Literal": (ast) =>
    make(
      I.makeSchema(ast),
      (literal: AST.LiteralValue): string =>
        typeof literal === "bigint" ?
          `${String(literal)}n` :
          JSON.stringify(literal)
    ),
  "SymbolKeyword": toString,
  "UniqueSymbol": toString,
  "TemplateLiteral": stringify,
  "UndefinedKeyword": toString,
  "UnknownKeyword": format,
  "AnyKeyword": format,
  "ObjectKeyword": format,
  "StringKeyword": stringify,
  "NumberKeyword": toString,
  "BooleanKeyword": toString,
  "BigIntKeyword": (ast: AST.AST) => make(I.makeSchema(ast), (a) => `${String(a)}n`),
  "Enums": stringify,
  "Tuple": (ast, go) => {
    const elements = ast.elements.map((e) => go(e.type))
    const rest = pipe(ast.rest, O.map(RA.mapNonEmpty(go)))
    return make(
      I.makeSchema(ast),
      (input: ReadonlyArray<unknown>) => {
        const output: Array<string> = []
        let i = 0
        // ---------------------------------------------
        // handle elements
        // ---------------------------------------------
        for (; i < elements.length; i++) {
          if (input.length < i + 1) {
            if (ast.elements[i].isOptional) {
              continue
            }
          } else {
            output.push(elements[i].pretty(input[i]))
          }
        }
        // ---------------------------------------------
        // handle rest element
        // ---------------------------------------------
        if (O.isSome(rest)) {
          const head = RA.headNonEmpty(rest.value)
          const tail = RA.tailNonEmpty(rest.value)
          for (; i < input.length - tail.length; i++) {
            output.push(head.pretty(input[i]))
          }
          // ---------------------------------------------
          // handle post rest elements
          // ---------------------------------------------
          for (let j = 0; j < tail.length; j++) {
            i += j
            output.push(tail[j].pretty(input[i]))
          }
        }

        return "[" + output.join(", ") + "]"
      }
    )
  },
  "TypeLiteral": (ast, go) => {
    const propertySignaturesTypes = ast.propertySignatures.map((f) => go(f.type))
    const indexSignatureTypes = ast.indexSignatures.map((is) => go(is.type))
    return make(
      I.makeSchema(ast),
      (input: { readonly [x: PropertyKey]: unknown }) => {
        const output: Array<string> = []
        const expectedKeys: any = {}
        // ---------------------------------------------
        // handle property signatures
        // ---------------------------------------------
        for (let i = 0; i < propertySignaturesTypes.length; i++) {
          const ps = ast.propertySignatures[i]
          const name = ps.name
          if (ps.isOptional && !Object.prototype.hasOwnProperty.call(input, name)) {
            continue
          }
          output.push(
            `${getPrettyPropertyKey(name)}: ${propertySignaturesTypes[i].pretty(input[name])}`
          )
          expectedKeys[name] = null
        }
        // ---------------------------------------------
        // handle index signatures
        // ---------------------------------------------
        if (indexSignatureTypes.length > 0) {
          for (let i = 0; i < indexSignatureTypes.length; i++) {
            const type = indexSignatureTypes[i]
            const keys = I.getKeysForIndexSignature(input, ast.indexSignatures[i].parameter)
            for (const key of keys) {
              if (Object.prototype.hasOwnProperty.call(expectedKeys, key)) {
                continue
              }
              output.push(`${getPrettyPropertyKey(key)}: ${type.pretty(input[key])}`)
            }
          }
        }

        return I.isNonEmptyReadonlyArray(output) ? "{ " + output.join(", ") + " }" : "{}"
      }
    )
  },
  "Union": (ast, go) => {
    const types = ast.types.map((m) => [P.is(I.makeSchema(m)), go(m)] as const)
    return make(I.makeSchema(ast), (a) => {
      const index = types.findIndex(([is]) => is(a))
      return types[index][1].pretty(a)
    })
  },
  "Lazy": (ast, go) => {
    const f = () => go(ast.f())
    const get = I.memoize<void, Pretty<any>>(f)
    const schema = I.lazy(f)
    return make(schema, (a) => get().pretty(a))
  },
  "Refinement": (ast, go) => go(ast.from),
  "Transform": (ast, go) => go(ast.to)
}

const compile = AST.getCompiler(match)

/**
 * @category prettify
 * @since 1.0.0
 */
export const pretty = <A>(schema: Schema<A>) => (a: A): string => compile(schema.ast).pretty(a)

const getPrettyPropertyKey = (name: PropertyKey): string =>
  typeof name === "string" ? JSON.stringify(name) : String(name)
