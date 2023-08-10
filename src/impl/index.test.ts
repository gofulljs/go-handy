import {test, expect} from 'vitest'
import { ImplUtil } from './ImplUtil'

test('init', () => {
  expect(true).toBe(true)
})

test('parse0', () => {
  const recv = ImplUtil.parse("type Obj[T any] struct{}")
  console.log(recv)
})

test('parse1', () => {
  const recv = ImplUtil.parse("type Obj[T, V any] struct{}")
  console.log(recv)
})

test('parse2', () => {
  const recv = ImplUtil.parse("type Obj[T, V any, W   any] struct{}")
  console.log(recv)
})

test('parse3', () => {
  const recv = ImplUtil.parse("type Obj[T, V any, W   any]struct{}")
  console.log(recv)
})