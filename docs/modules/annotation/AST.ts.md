---
title: annotation/AST.ts
nav_order: 1
parent: Modules
---

## AST overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Brand (type alias)](#brand-type-alias)
  - [BrandId](#brandid)
  - [Description (type alias)](#description-type-alias)
  - [DescriptionId](#descriptionid)
  - [Documentation (type alias)](#documentation-type-alias)
  - [DocumentationId](#documentationid)
  - [Examples (type alias)](#examples-type-alias)
  - [ExamplesId](#examplesid)
  - [Identifier (type alias)](#identifier-type-alias)
  - [IdentifierId](#identifierid)
  - [JSONSchema (type alias)](#jsonschema-type-alias)
  - [JSONSchemaId](#jsonschemaid)
  - [Message (type alias)](#message-type-alias)
  - [MessageId](#messageid)
  - [Title (type alias)](#title-type-alias)
  - [TitleId](#titleid)
  - [Type (type alias)](#type-type-alias)
  - [TypeId](#typeid)

---

# utils

## Brand (type alias)

**Signature**

```ts
export type Brand = ReadonlyArray<string>
```

Added in v1.0.0

## BrandId

**Signature**

```ts
export declare const BrandId: '@effect/schema/annotation/BrandId'
```

Added in v1.0.0

## Description (type alias)

**Signature**

```ts
export type Description = string
```

Added in v1.0.0

## DescriptionId

**Signature**

```ts
export declare const DescriptionId: '@effect/schema/annotation/DescriptionId'
```

Added in v1.0.0

## Documentation (type alias)

**Signature**

```ts
export type Documentation = string
```

Added in v1.0.0

## DocumentationId

**Signature**

```ts
export declare const DocumentationId: '@effect/schema/annotation/DocumentationId'
```

Added in v1.0.0

## Examples (type alias)

**Signature**

```ts
export type Examples = ReadonlyArray<unknown>
```

Added in v1.0.0

## ExamplesId

**Signature**

```ts
export declare const ExamplesId: '@effect/schema/annotation/ExamplesId'
```

Added in v1.0.0

## Identifier (type alias)

**Signature**

```ts
export type Identifier = string
```

Added in v1.0.0

## IdentifierId

**Signature**

```ts
export declare const IdentifierId: '@effect/schema/annotation/IdentifierId'
```

Added in v1.0.0

## JSONSchema (type alias)

**Signature**

```ts
export type JSONSchema = object
```

Added in v1.0.0

## JSONSchemaId

**Signature**

```ts
export declare const JSONSchemaId: '@effect/schema/annotation/JSONSchemaId'
```

Added in v1.0.0

## Message (type alias)

**Signature**

```ts
export type Message<A> = (a: A) => string
```

Added in v1.0.0

## MessageId

**Signature**

```ts
export declare const MessageId: '@effect/schema/annotation/MessageId'
```

Added in v1.0.0

## Title (type alias)

**Signature**

```ts
export type Title = string
```

Added in v1.0.0

## TitleId

**Signature**

```ts
export declare const TitleId: '@effect/schema/annotation/TitleId'
```

Added in v1.0.0

## Type (type alias)

**Signature**

```ts
export type Type = string | symbol
```

Added in v1.0.0

## TypeId

**Signature**

```ts
export declare const TypeId: '@effect/schema/annotation/TypeId'
```

Added in v1.0.0
