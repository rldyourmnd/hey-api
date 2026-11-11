import ts from 'typescript';

import { $ } from '../index';
import type { ForTsDsl } from '../stmt/for';

describe('function and loop AST modes', () => {
  it('keeps arrow AST types', () => {
    const node = $.func().toAst();
    expectTypeOf(node).toEqualTypeOf<ts.ArrowFunction>();
    expect(ts.isArrowFunction(node)).toBe(true);
  });

  it('keeps declaration AST types', () => {
    const node = $.func('example').toAst();
    expectTypeOf(node).toEqualTypeOf<ts.FunctionDeclaration>();
    expect(ts.isFunctionDeclaration(node)).toBe(true);
  });

  it('keeps expression AST types', () => {
    const node = $.func('example').expr().toAst();
    expectTypeOf(node).toEqualTypeOf<ts.FunctionExpression>();
    expect(ts.isFunctionExpression(node)).toBe(true);
  });

  it('supports assertions on function expressions', () => {
    expect(ts.isAsExpression($.func().as('unknown').toAst())).toBe(true);
    expect(ts.isAsExpression($.func('example').expr().as('unknown').toAst())).toBe(true);
  });

  it('keeps each loop mode in its public return type', () => {
    expectTypeOf<ReturnType<ForTsDsl<'for'>['toAst']>>().toEqualTypeOf<ts.ForStatement>();
    expectTypeOf<ReturnType<ForTsDsl<'of'>['toAst']>>().toEqualTypeOf<ts.ForOfStatement>();
    expectTypeOf<ReturnType<ForTsDsl<'in'>['toAst']>>().toEqualTypeOf<ts.ForInStatement>();
  });
});
