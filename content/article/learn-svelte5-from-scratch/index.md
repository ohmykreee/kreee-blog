---
title: "从头开始学 Svelte 5"
date: 2026-02-14T22:21:00+08:00
draft: false
categories: ['Learning']
tags: ['Svelte', 'Learning', 'Frontend', 'JavaScript', 'TypeScript', '2026']
summary: "Life is short, I use svelte btw."
---

-----
## 写在前面

跟着官方的互动教程在学，然后记录一下关键的知识点防止学完就忘记了。示例直接复制的官方代码。

过完教程就要来重写我的个人主页。

本文章只涉及基础的 Svelte 5，高级用法等我边写边发掘（但是我觉得好像不咋用得到）。

~~学完才发现我之前写 React 过的都是些什么苦日子~~

-----
## 基础格式
官方给的示例是先 `<script>`，后`<html>`，最后放`<style>`。

- 语法糖 #1：如果你的变量名和想要传参的名一致，可以直接传这个变量而不需要声明参数名（比如 `<img>` 的 `src`，如果你有个变量叫 `src` 并且同时存储了资源地址，在传给 `<img>` 的时候无需写 `src={src}` 而是可以直接传 `{src}`。

## Rune & State

### `$state`
作用是声明这个变量是可变的状态，让 Svelte 能够管理变量状态和组件更新。底层原理为 js 的 Proxy。

### `$derived`
也是声明可变变量，只是它是由 `$state` 计算过来的，作用是方便管理调用链，并且 `$derived` 也能做缓存（在原始 `$state` 没有更改的情况下）

### `$state.snapshot` 和 `$inspect`
`$state.snapshot` 是从 `$state` 获取原始值，并且传给其他非 Svelte 组件，并且只是当前状态。

如果你想用 `console.log`，官方给你封装好了一个 `$inspect`，相当于帮你 snapshot 后再 console.log，也可以指定函数。更方便的是在 production build 中这些代码会自动清除。

```svelte
<script lang='ts'>
  let numbers = $state<Array<number>>([1, 2, 3, 4])
  let total = $derived<Array<number>>(numbers.reduce((t, n) => t + n, 0))

  function addNumber() {
    numbers.push(numbers.length + 1)
    console.log($state.snapshot(numbers)) // Look this
  }

  // OR
  $inspect(numbers).with(console.trace)
</script>
```

### `$effect`
自己写状态更新逻辑。如果官方的 DOM event 无法满足的情况下最后使用这个方法。直接修改 `$state` 或者引用的 `$state` 有修改，Svelte 会帮你监测更改并更新组件/自动运行 `$effect`。

`Return()` 可以帮你做一些清理工作，会在这个 effect 再次执行前执行。

如果这个 effect 不依赖任何 `$state`，将只会在这个组件加载的时候运行一次。

`$effect` 不能在 server side rendering 中运行。

```svelte
<script lang='ts'>
  let elapsed = $state<number>(0)
  let interval = $state<number>(1000)
  $effect(() => {  // 如果 interval 被修改会触发
    const id = setInterval(() => {
      elapsed += 1
    }, interval)

    return () => {  // 在这个 effect 重新运行前会执行，为了清理不需要的 setInterval
      clearInterval(id)
    }
})
</script>

<button onclick={() => interval /= 2}>speed up</button>
<button onclick={() => interval *= 2}>slow down</button>

<p>elapsed: {elapsed}</p>
```

### `$state` outside Components
你可以把 `$state` 放在外部文件作为一个共享状态。注意的是 export 的变量必须为 const （即 immutable），并且修改时不能直接替换整个变量。能够修改这个 const Object中的内容物。

同时注意这个 js/ts 文件必须声明为 Svelte 内容物。

shared.svelte.js
```ts
interface Counter {
  count: number
}

export const counter = $state<Counter>({ // 这里使用了 state
  count: 0
})
```
Button.svelte
```svelte
<script lang='ts'>
  import { counter } from './shared.svelte.js';
</script>

<button onclick={() => counter.count += 1}>
  clicks: {counter.count}
</button>

```

### `$props`
在子组件中声明传参。可以传很多个参。

可以解压并且设置默认值。

Child.svelte
```svelte
<script lang='ts'>
  interface Props {
    answer: number
    writer: string
  }

  let {answer, writer = 'kyree'}: Props = $props() // 设置 writer 的默认值为 'Kyree'
</script>

<p>The answer is {answer}, written by {writer}.</p>

```
App.svelte
```svelte
<script lang='ts'>
  import Nested from './Child.svelte'
</script>

<Child answer={42}/>
```

如果你很懒也可以把一个对应好的 Object 解压后全部一股脑传给子组件。
```svelte
<script lang='ts'>
  import PackageInfo from './PackageInfo.svelte';

  const pkg = {
    name: 'svelte',
    version: 5,
    description: 'blazing fast',
    website: 'https://svelte.dev'
  };
</script>

<PackageInfo
 {...pkg}
/>
```

-----
## Template
### if & else if & else
```svelte
{#if count > 10}
  <p>{count} is greater than 10</p>
{:else if count < 5}
  <p>{count} is less than 5</p>
{:else}
  <p>{count} is between 5 and 10</p>
{/if}
```

### each
其中第二个参数 `i` 可以作为 index。
```svelte
{#each colors as color, i (color.id)}
  <button
    style="background: {color}"
    aria-label={color}
    aria-current={selected === color}
    onclick={() => selected = color}
  >{i + 1}</button>
{/each}
```
最好给每个生成的元素赋予唯一 id（即在 each template 最后使用括号包含你想作为 id 的变量）。**注意不要使用自增变量 i 作为 id，因为这和没有使用没有任何区别。**

（最好是对于会产生变化的列表都赋予 id，能够避免很多非预期行为）

### await
可以在等待 Promise 时做一些操作
```svelte
{#await promise}
  <p>...rolling</p>
{:then number}
  <p>you rolled a {number}!</p>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
```
await 后面的 `promise` 存获取到的 Promise，then 里面的 `number` 存放 Promise fulfilled 的结果。如果你不想要等待元素，可以直接精简：
```svelte
{#await promise then number}
  <p>you rolled a {number}!</p>
{/await}
```

### DOM event
可以这样简写直接绑定：`on<name>`
```svelte
<div onpointermove={onpointermove}>
  The pointer is at {Math.round(m.x)} x {Math.round(m.y)}
</div>
```
或者更暴力可以直接 inline：
```svelte
<div
  onpointermove={(event) => {
    m.x = event.clientX;
    m.y = event.clientY;
  }}
>
  The pointer is at {m.x} x {m.y}
</div>
```

### DOM event capture & bubbling
在 HTML 的层级中，DOM 的事件是先在 Capture 阶段从外到内传递事件，到达触发的节点后，再在 Bubbling 阶段把事件从内往外传递。Svelte 默认行为是监听 Bubbling 阶段，如果需要指定监听 Capture 阶段，需要加关键字 `on<name>capture`：
```svelte
<div onkeydowncapture={(e) => alert(`<div> ${e.key}`)} role="presentation">
  <input onkeydowncapture={(e) => alert(`<input> ${e.key}`)} />
</div>
```
如果混合了 Capture 阶段和 Bubbling 阶段，根据之前阐述的 DOM 事件传递顺序，Capture 组的事件永远会提前发生。

### DOM event passing & spreading
可以将 Function 当作参数传给子组件，如果你传了个叫 `onclick` 的函数，在子组件中甚至可以直接从 `props` 中解压出来就可以用：

Stepper.svelte
```svelte
<script lang='ts'>
  interface Props {
    increment: number
    decrement: number
  }

  let { increment, decrement }: Props = $props();
</script>

<button onclick={decrement}>-1</button>
<button onclick={increment}>+1</button>
```

App.svelte
```svelte
<script lang='ts'>
  import Stepper from './Stepper.svelte';

  let value = $state<number>(0);
</script>

<p>The current value is {value}</p>

<Stepper
  increment={() => value += 1}
  decrement={() => value -= 1}
/>
```

-----
## Binding
Svelte 中数据流向默认是从父组件通过 `props` / 直接设置子组件属性来向子组件传。如果在某些情况下子组件需要传数据给父组件（尤其是涉及到表单等 HTML 组件），则需要使用Binding：
```svelte
<script lang='ts'>
  let name = $state<string>('world');
</script>

<input bind:value={name} />

<h1>Hello {name}!</h1>
```
后记：如果你想要一个 `$state` 在父组件和子组件间相互绑定（因为默认情况下数据是单项传递的），你需要在两边都声明这个状态双向绑定：
```svelte
// 在父组件中
<Child bind:index={currIndex}/>
// 在子组件中
let { index = $bindable() } = $props()
```
后记 #2：如果使用 `$state` outside components 的方法，就相当于一个简易的 Global state，任意地方修改变量都能触发所有引用的状态变化。

### input
这里 `<input>` 的 bind 是必须的，即使你使用了 `$state` outside components 这种方式。将 `$state` 和表单组件绑定的话，相当一个语法糖会自动监控更改，并且必要时回写给父组件的状态。

同时如果 `<input>` 的类型为 range/number 时，使用 `bind:value` 会自动帮你转换值为预期格式（数字）。

对于 checkbox 格式的 `<input>`，需要使用 `bind:checked`（~~好坏啊~~），会自动帮你转换值为布尔值。

### select
对于 `<select>`，又需要用回 `bind:value`，同时**需要注意**：
- 在示例中的 `selected` 变量（没有赋予初始值），虽然进行了 `bind:value`，但是 binding 只会在 `<select>` 组件加载后才会赋值。所以在 `selected` 没有赋予初始值、加载时还是 undefined 的情况下，不能直接使用，必须要判断一下这个变量是不是未初始化（或者在已知初始值的情况下直接提前赋予初始值）；
- 如果使用了 `<select multiple>`（即可以使用 ctrl 键选中多个），返回的 `selected` 会是一个数组；
- 语法糖 #2：如果 `<option>` 的显示的值和 `value` 值一致，可以只传入显示值，Svelte 会自动帮你赋 `value`（示例中没有体现）。
```html
<script lang='ts'>

  interface Item {
    id: number
    text: string
  }

  let questions: Array<Item> = [
    {
      id: 1,
      text: `Where did you go to school?`
    },
    {
      id: 2,
      text: `What is your mother's name?`
    },
    {
      id: 3,
      text: `What is another personal fact that an attacker could easily find with Google?`
    }
  ];

  let selected = $state<Item>();

  let answer = $state<string>('');

  function handleSubmit(e) {
    e.preventDefault();

    alert(
      `answered question ${selected.id} (${selected.text}) with "${answer}"`
    );
  }
</script>

<h2>Insecurity questions</h2>

<form onsubmit={handleSubmit}>
  <select
    bind:value={selected}
    onchange={() => (answer = '')}
  >
    {#each questions as question}
      <option value={question}>
        {question.text}
      </option>
    {/each}
  </select>

  <input bind:value={answer} />

  <button disabled={!answer} type="submit">
    Submit
  </button>
</form>

<p>
  selected question {selected
    ? selected.id
    : '[waiting...]'}
</p>
```

### Group
如果你有用 each 生成多个单选项/多选项，可以使用 `bind:group` 把这些同组的分类在一起，并且返回到同一个传入的 `$state` 中。（对成组的多选很友好，多选的值能够以数组的形式进入 `$state`）。
```svelte
{#each ['cookies and cream', 'mint choc chip', 'raspberry ripple'] as flavour}
  <label>
    <input
      type="checkbox"
      name="flavours"
      value={flavour}
      bind:group={flavours}
    />

    {flavour}
  </label>
{/each}
```

-----
## Classes & Styles
Class 能够使用可变变量来控制，也可以使用数组（利用自带的 [clsx](https://github.com/lukeed/clsx)）来构建。

`style:` 也可以使用可变变量控制，也可以存在多个 `style:` 来美观。
```svelte
<button
  class="card"
  style:transform={flipped ? 'rotateY(0)' : ''}
  style:--bg-1="palegoldenrod"
  style:--bg-2="black"
  style:--bg-3="goldenrod"
  onclick={() => flipped = !flipped}
>
```
推荐修改子组件的样式通过 CSS 变量：直接传递给子组件 `--color="red"`，并在子组件中的样式中使用这个 CSS 变量：`background-color: var(--color, #ddd);`。Svelte 会自动生成一个 wrapper div 防止出现奇怪问题。

-----
## Attachments
`@attach` 的作用是修改被附着的元素：一个被 attach 的元素会将自身（类型为 `Element`）作为参数传给 attach function，然后这个 function 可以对这个元素进行一定的修改。这个最适合用在想要用一个别人写好的轮子，但是别人没有提供 Svelte 的 wrapper，这个时候你就可以使用轮子提供的 api，不论是对已有元素挂载轮子，还是插入元素都可以。

以下是 `embla-carousel` 的一个示例：
```svelte
<script lang='ts'>
  import EmblaCarousel from 'embla-carousel'
  import type { Attachment } from 'svelte/attachments'

  let emblaApi: EmblaCarouselType | undefined // 反正哪里引用了这个类型进来，就不去撑篇幅了

  const loadEmbla: Attachment = (element) => { // 这里的 element 的类型为 Element，不是 HTMLElement（父集）
    emblaApi = EmblaCarousel(element as HTMLElement, { loop: true }) // 这里就通过获取到被附着的元素，来进行挂载
    // 其他对 emblaApi 的操作，这里省略
    return () => {
      emblaApi?.destroy() // 这里进行销毁
    }
  }
</script>

<div class="embla__viewport" {@attach loadEmbla}></div>
```
这里对元素的操作都是原生 js 操作，其中有一点关注的是 `element` 的类型是 `Element`，而不是 `HTMLElement`，因为被附着的元素不一定是 HTML 节点。虽然在自己写的项目中可以 hack 一下强制作为 HTMLElement，但是在编写大型项目的时候还是要重点关注。

如果你想传参也是可以的，比如以下这个官方例子：
```svelte
<script lang='ts'>
  let content = $state<string>('Hello!')

  function tooltip(content) {
    return (node) => {
      const tooltip = tippy(node, { content }) // 这里 tippy 是外部方法，简单来说就是创建一个浮框
      return tooltip.destroy
    }
  }
</script>

<input bind:value={content} />

<button {@attach tooltip(content)}>
  Hover me
</button>
```

-----
## Transitions
### Use built-in
Svelte 内置了一些预设方便的过渡动画，比如这个简单的 `fade` 例子，从 `svelte/transition` 导入了 `fade` 后，直接在 `<p>` 里面声明 `transition:fade`，让它在加入和移除 DOM 的时候添加动画：
```svelte
<script lang='ts'>
  import {fade} from 'svelte/transition'
  let visible = $state<boolean>(true);
</script>

<label>
  <input type="checkbox" bind:checked={visible} />
  visible
</label>

{#if visible}
  <p transition:fade>
    Fades in and out
  </p>
{/if}
```
过渡动画可以设置表现：
```svelte
<p transition:fly={{ y: 200, duration: 2000 }}>
  Flies in and out
</p>
```
使用 `transition` 时过渡动画是有打断动画的，这个好评。如果指定 `in` 和 `out`，即进入和退出为不同的动画，那么就没有打断动画了：
```svelte
<p in:fly={{ y: 200, duration: 2000 }} out:fade>
  Flies in, fades out
</p>
```

### Use my-own
你也可以自己写过渡动画。但是看了一下很复杂，就贴官方示例吧：
```js
// css transision
function spin(node, { duration }) {
  return {
    duration,
    css: (t, u) => {
      const eased = elasticOut(t);

      return `
        transform: scale(${eased}) rotate(${eased * 1080}deg);
        color: hsl(
          ${Math.trunc(t * 360)},
          ${Math.min(100, 1000 * u)}%,
          ${Math.min(50, 500 * u)}%
        );`
    }
  };
}

// js transision
function typewriter(node, { speed = 1 }) {
  const valid = node.childNodes.length === 1 & node.childNodes[0].nodeType === Node.TEXT_NODE;

  if (!valid) {
    throw new Error(`This transition only works on elements with a single text node child`);
  }

  const text = node.textContent;
  const duration = text.length / (speed * 0.01);

  return {
    duration,
    tick: (t) => {
      const i = Math.trunc(text.length * t);
      node.textContent = text.slice(0, i);
    }
  };
}
```

### Transition events
Svelte 还给你留了进入/退出动画的开始/结束 event handler，快说谢谢 Svelte：
```svelte
<p
  transition:fly={{ y: 200, duration: 2000 }}
  onintrostart={() => status = 'intro started'}
  onoutrostart={() => status = 'outro started'}
  onintroend={() => status = 'intro ended'}
  onoutroend={() => status = 'outro ended'}
>
  Flies in and out
</p>
```

### Global transitions
默认情况下，组件的过渡动画只在自身销毁/加载时会有，如果希望同等级组件在任意组件销毁/加载时一起动，那么就需要使用`|global`修饰符：`transition:slide|global`

### Key blocks
Svelte 的动画只对组件的销毁/加载有作用。如果在某些时候组件只是内容有更改，但是我也想让它有动画，可以使用 `{#key}` 包裹起来，这样 Svelte 会监控比如例子中 `i` 的更改，并且自动帮你“销毁和重建”组件，并执行动画：
```svelte
<script lang='ts'>
  // 这里的 i 也是状态
  // 没有贴完整的 typewriter 代码，只作最简单示例
  let i = $state<number>(-1)
</script>

{#key i}
  <p in:typewriter={{ speed: 10 }}>
    {messages[i] || ''}
  </p>
{/key}
```

## 高级用法
选了几个我认为有用/有意思的高级用法，可以作为启发/参考。

### `$state.raw()`
和 `$state()` 同用法，只是普通 state 创建的是一个拥有深层监听的状态变量，而 raw state 是浅层监听，不会对构建时 object 里面数值的更改被触发。

如果需要触发这个 raw state，需要重新赋新值。

适合当这个 state 结构体非常复杂（比如 Three.js 对象）时，进行性能优化。

### getter & setter
可以针对 state 重新编写赋值和读取行为
```svelte
<script>
  const MAX_SIZE = 200;

  class Box {
    #width = $state(0); // 通过给变量前面加 # 使其变为这个 class 的私有变量
    #height = $state(0);
    area = $derived(this.#width * this.#height);

    constructor(width, height) {
      this.#width = width;
      this.#height = height;
    }

    get width() {
      return this.#width;
    }

    get height() {
      return this.#height;
    }

    set width(value) {
      this.#width = Math.max(0, Math.min(MAX_SIZE, value));
    }

    set height(value) {
      this.#height = Math.max(0, Math.min(MAX_SIZE, value));
    }

    embiggen(amount) {
      this.width += amount;
      this.height += amount;
    }
  }

  const box = new Box(100, 100);
</script>

<label>
  <input type="range" bind:value={box.width} min={0} max={MAX_SIZE} />
  {box.width}
</label>
<label>
  <input type="range" bind:value={box.height} min={0} max={MAX_SIZE} />
  {box.height}
</label>
<button onclick={() => box.embiggen(10)}>embiggen</button>
<div
  class="box"
  style:width="{box.width}px"
  style:height="{box.height}px"
>
  {box.area}
</div>
```

### 内置方法
在 [svelte/reactivity](https://svelte.dev/docs/svelte/svelte-reactivity) 包中，可以直接创建对应 `$state()`。

比如直接创建 `cosnt large = new MediaQuery('min-width: 800px')`，会返回一个响应变量，可以在 `large.current` 读取，并且变化会自动触发更新。

### Store
有了 `$state() outside components` 方法后，为什么还要 Store：Store 可以方便在订阅者订阅/销毁时进行生命周期期间的操作。而 `$state()` 固然方便，但是只能进行值变更的同步。

shared.js
```js
import { writable } from 'svelte/store'

export const count = writable(0)
```

Counter.svelte
```svelte
<script>
  import { count } from './shared.js'
</script>

<!-- $count += 1 是以下方式的简写：count.update((n) => n + 1) -->
<button onclick={() => $count += 1}>
  clicks: {$count}
</button>
```

一些更多的使用方法：
```ts
import { writable } from 'svelte/store'

const count = writable<number>(0, () => {
  console.log('got a subscriber') // 有第一个新订阅者时触发 
  return () => console.log('no more subscribers') // 订阅者全部清空后触发
})

count.set(1) // 无动作

const unsubscribe = count.subscribe((value) => {
  console.log(value);
}) // 打印日志：got a subscriber，然后 1

count.set(2) // 打印日志：2

count.update((n) => n + 1) // 打印日志：3

unsubscribe() // 打印日志：no more subscribers
```

`readable` 可以设置首个订阅的时候初始化，并且自身调用自身完成一些值的更改（无法从外部更改值），并且最后一个订阅者离开时清理：
```ts
import { readabel } from 'svelte/store'

const ticktock = readable<string>('tick', (set, update) => {
  const interval = setInterval(() => {
    update((sound) => (sound === 'tick' ? 'tock' : 'tick')) // 自身回调函数，可以更改自身值
  }, 1000)

  return () => clearInterval(interval)
})
```

`derive` 可以从其他 Store 计算出值，并且在第一个订阅者出现、引用值更改时触发 callback：
```ts
import { derived } from 'svelte/store';

const delayedIncrement = derived(a, ($a, set, update) => {
  set($a);
  setTimeout(() => update((x) => x + 1), 1000);
  // every time $a produces a value, this produces two
  // values, $a immediately and then $a + 1 a second later

  return () => {
    // 最后一个订阅者离开后触发
  }
})
```

`readonly` 可以将一个 `writable` 转换为只读（）
```ts
import { readonly, writable } from 'svelte/store'

const writableStore = writable(1)
const readableStore = readonly(writableStore)
```

如果你想在未订阅的情况下读取值，并且不触发事件，可以使用 `get`：
```ts
import { get } from 'svelte/store'

const value = get(store)
```

### 进行插值
如果你想更改值，同时实现更改过程中进行插值，可以使用 `Tween()` 和 `Spring()`:
```svelte
<script lang="ts">
  import { Tween } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing' // 可以从这个库里面引用插值方式

  let progress = new Tween(0, {
    duration: 400,
    easing: cubicOut
  })
</script>

<!-- 读取值 -->
<progress value={progress.current}></progress>

<!-- 设置值 -->
<button onclick={() => (progress.target = 50)}>
  50%
</button>

<!-- 或者使用 progress.set(value, options) 也可以，会返回一个 Promise 当插值完成 -->
```

`Spring()` 类似，也可以完成插值。它更像一个弹簧，运动具有物理属性：`stiffness`刚度、 `damping`阻尼。

### 高级动画行为
使用 `crossfade` 或者 `flip` 实现（其中 `flip` 指的是“First Last Invert Play”）。

### Context
使用 Context API 实现上下文统一的状态共享。
```ts
// in a parent component
import { setContext } from 'svelte';

let context = $state({...});
setContext('my-context', context);

// in a child component
import { getContext } from 'svelte';

const context = getContext('my-context');
```

1. 这里 Context 的标识符（key）可以是任何东西，同时也可以存任何东西进去；
2. Context 的存储和读取必须在组件初始化时执行。