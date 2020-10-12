import * as mod from "./contextual-pipe.ts";
import { testingAsserts as ta } from "./deps-test.ts";

interface TestContext {
  isTestContext: true;
  count: number;
}

interface TestTarget {
  isTestObject: true;
}

interface ChainedTarget
  extends TestTarget, mod.TransformerProvenanceSupplier<TestTarget> {
  isChainedTarget: true;
  previous: TestTarget;
}

class TestPipeStart
  implements
    mod.Transformer<TestContext, TestTarget>,
    mod.Enhancer<TestContext, TestTarget> {
  async transform(ctx: TestContext): Promise<TestTarget> {
    ctx.count++;
    return {
      isTestObject: true,
    };
  }

  async enhance(ctx: TestContext): Promise<TestTarget> {
    ctx.count++;
    return {
      isTestObject: true,
    };
  }
}

class TestPipeUnion
  implements
    mod.Transformer<TestContext, TestTarget>,
    mod.Enhancer<TestContext, TestTarget> {
  async transform(
    ctx: TestContext,
    content: TestTarget,
  ): Promise<ChainedTarget> {
    ctx.count++;
    return {
      isTestObject: true,
      isChainedTarget: true,
      previous: content,
      isTransformed: mod.transformationSource(content),
    };
  }

  async enhance(
    ctx: TestContext,
    content: TestTarget,
  ): Promise<ChainedTarget> {
    ctx.count++;
    return {
      isTestObject: true,
      isChainedTarget: true,
      previous: content,
      isTransformed: mod.transformationSource(content),
    };
  }
}

class TestPipeStartSync
  implements
    mod.TransformerSync<TestContext, TestTarget>,
    mod.EnhancerSync<TestContext, TestTarget> {
  transform(ctx: TestContext): TestTarget {
    ctx.count++;
    return {
      isTestObject: true,
    };
  }

  enhance(ctx: TestContext): TestTarget {
    ctx.count++;
    return {
      isTestObject: true,
    };
  }
}

class TestPipeUnionSync
  implements
    mod.TransformerSync<TestContext, TestTarget>,
    mod.EnhancerSync<TestContext, TestTarget> {
  transform(ctx: TestContext, content: TestTarget): ChainedTarget {
    ctx.count++;
    return {
      isTestObject: true,
      isChainedTarget: true,
      previous: content,
      isTransformed: mod.transformationSource(content),
    };
  }

  enhance(ctx: TestContext, content: TestTarget): ChainedTarget {
    ctx.count++;
    return {
      isTestObject: true,
      isChainedTarget: true,
      previous: content,
      isTransformed: mod.transformationSource(content),
    };
  }
}

Deno.test("async enhancements pipe", async () => {
  const pipe = mod.enhancementsPipe<TestContext, TestTarget>(
    new TestPipeStart(),
    new TestPipeUnion(),
  );
  const ctx: TestContext = { isTestContext: true, count: 0 };
  const result = (await pipe.enhance(ctx)) as ChainedTarget;
  ta.assertEquals(ctx.count, 2);
  ta.assert(result.isChainedTarget);
});

Deno.test("synch enhancements pipe", () => {
  const pipe = mod.enhancementsPipeSync<TestContext, TestTarget>(
    new TestPipeStartSync(),
    new TestPipeUnionSync(),
  );
  const ctx: TestContext = { isTestContext: true, count: 0 };
  const result = pipe.enhance(ctx) as ChainedTarget;
  ta.assertEquals(ctx.count, 2);
  ta.assert(result.isChainedTarget);
});

Deno.test("async transformation pipe", async () => {
  const pipe = mod.transformationsPipe<TestContext, TestTarget>(
    new TestPipeStart(),
    new TestPipeUnion(),
  );
  const ctx: TestContext = { isTestContext: true, count: 0 };
  const result = (await pipe.transform(ctx)) as ChainedTarget;
  ta.assertEquals(ctx.count, 2);
  ta.assert(result.isChainedTarget);
});

Deno.test("synch transformation pipe", () => {
  const pipe = mod.transformationsPipeSync<TestContext, TestTarget>(
    new TestPipeStartSync(),
    new TestPipeUnionSync(),
  );
  const ctx: TestContext = { isTestContext: true, count: 0 };
  const result = pipe.transform(ctx) as ChainedTarget;
  ta.assertEquals(ctx.count, 2);
  ta.assert(result.isChainedTarget);
});
