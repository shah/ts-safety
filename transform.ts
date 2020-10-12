export interface Transformer<C, T> {
  transform(ctx: C, content?: T): Promise<T>;
}

export function transformationPipe<C, T>(
  ...elements: Transformer<C, T>[]
): Transformer<C, T> {
  if (elements.length == 0) {
    return new class implements Transformer<C, T> {
      async transform(_: C, content: T): Promise<T> {
        return content;
      }
    }();
  }
  if (elements.length == 1) {
    return new class implements Transformer<C, T> {
      async transform(ctx: C, content: T): Promise<T> {
        return await elements[0].transform(ctx, content);
      }
    }();
  }
  return new class implements Transformer<C, T> {
    async transform(ctx: C, content: T): Promise<T> {
      let result = await elements[0].transform(ctx, content);
      for (let i = 1; i < elements.length; i++) {
        result = await elements[i].transform(ctx, result);
      }
      return result;
    }
  }();
}

export interface TransformerSync<C, T> {
  transform(ctx: C, content?: T): T;
}

export function transformationPipeSync<C, T>(
  ...elements: TransformerSync<C, T>[]
): TransformerSync<C, T> {
  if (elements.length == 0) {
    return new class implements TransformerSync<C, T> {
      transform(_: C, content: T): T {
        return content;
      }
    }();
  }
  if (elements.length == 1) {
    return new class implements TransformerSync<C, T> {
      transform(ctx: C, content: T): T {
        return elements[0].transform(ctx, content);
      }
    }();
  }
  return new class implements TransformerSync<C, T> {
    transform(ctx: C, content: T): T {
      let result = elements[0].transform(ctx, content);
      for (let i = 1; i < elements.length; i++) {
        result = elements[i].transform(ctx, result);
      }
      return result;
    }
  }();
}
