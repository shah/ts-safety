export interface Enhancer<C, T> {
  enhance(ctx: C, instance?: T): Promise<T>;
}

export interface EnhancerSync<C, T> {
  enhance(ctx: C, instance?: T): T;
}

export interface Transformer<C, T> {
  transform(ctx: C, content?: T): Promise<T>;
}

export interface TransformerSync<C, T> {
  transform(ctx: C, content?: T): T;
}

export function enhancementsPipe<C, T>(
  ...enhancers: Enhancer<C, T>[]
): Enhancer<C, T> {
  if (enhancers.length == 0) {
    return new class implements Enhancer<C, T> {
      async enhance(_: C, instance: T): Promise<T> {
        return instance;
      }
    }();
  }
  return new class implements Enhancer<C, T> {
    async enhance(ctx: C, instance: T): Promise<T> {
      let result = instance;
      for (const enhancer of enhancers) {
        result = await enhancer.enhance(ctx, result);
      }
      return result;
    }
  }();
}

export function enhancementsPipeSync<C, T>(
  ...enhancers: EnhancerSync<C, T>[]
): EnhancerSync<C, T> {
  if (enhancers.length == 0) {
    return new class implements EnhancerSync<C, T> {
      enhance(_: C, content: T): T {
        return content;
      }
    }();
  }
  return new class implements EnhancerSync<C, T> {
    enhance(ctx: C, instance: T): T {
      let result = instance;
      for (const enhancer of enhancers) {
        result = enhancer.enhance(ctx, result);
      }
      return result;
    }
  }();
}

export function transformationsPipe<C, T>(
  ...elements: Transformer<C, T>[]
): Transformer<C, T> {
  if (elements.length == 0) {
    return new class implements Transformer<C, T> {
      async transform(_: C, content: T): Promise<T> {
        return content;
      }
    }();
  }
  return new class implements Transformer<C, T> {
    async transform(ctx: C, instance: T): Promise<T> {
      let result = instance;
      for (const enhancer of elements) {
        result = await enhancer.transform(ctx, result);
      }
      return result;
    }
  }();
}

export function transformationsPipeSync<C, T>(
  ...elements: TransformerSync<C, T>[]
): TransformerSync<C, T> {
  if (elements.length == 0) {
    return new class implements TransformerSync<C, T> {
      transform(_: C, content: T): T {
        return content;
      }
    }();
  }
  return new class implements TransformerSync<C, T> {
    transform(ctx: C, instance: T): T {
      let result = instance;
      for (const enhancer of elements) {
        result = enhancer.transform(ctx, result);
      }
      return result;
    }
  }();
}
