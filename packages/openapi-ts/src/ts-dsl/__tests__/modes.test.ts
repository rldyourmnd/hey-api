import type { ts } from '../../ts-compiler';
import { $ } from '../index';
import type { ForTsDsl } from '../stmt/for';

describe('function and loop AST modes', () => {
  it('keeps arrow AST types', () => {
    const node = $.func().toAst();
    expectTypeOf(node).toEqualTypeOf<ts.ArrowFunction>();
    expect(node.kind).toBe('ArrowFunction');
  });

  it('keeps declaration AST types', () => {
    const node = $.func('example').toAst();
    expectTypeOf(node).toEqualTypeOf<ts.FunctionDeclaration>();
    expect(node.kind).toBe('FunctionDeclaration');
  });

  it('keeps expression AST types', () => {
    const node = $.func('example').expr().toAst();
    expectTypeOf(node).toEqualTypeOf<ts.FunctionExpression>();
    expect(node.kind).toBe('FunctionExpression');
  });

  it('supports assertions on function expressions', () => {
    expect($.func().as('unknown').toAst().kind).toBe('AsExpression');
    expect($.func('example').expr().as('unknown').toAst().kind).toBe('AsExpression');
  });

  it('keeps each loop mode in its public return type', () => {
    expectTypeOf<ReturnType<ForTsDsl<'for'>['toAst']>>().toEqualTypeOf<ts.ForStatement>();
    expectTypeOf<ReturnType<ForTsDsl<'of'>['toAst']>>().toEqualTypeOf<ts.ForOfStatement>();
    expectTypeOf<ReturnType<ForTsDsl<'in'>['toAst']>>().toEqualTypeOf<ts.ForInStatement>();
  });
});
