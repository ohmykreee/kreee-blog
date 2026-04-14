---
title: "Learn Svelte 5 From Scratch"
date: 2026-02-14T22:21:00+08:00
draft: false
categories: ['Learning']
tags: ['Svelte', 'Learning', 'Frontend', 'JavaScript', 'TypeScript', '2026']
summary: "Life is short, I use svelte btw."
---

-----
## Preface

I'm following the official interactive tutorial and recording the key points to prevent forgetting them right after finishing. The examples are copied directly from the official code.

After finishing the tutorial, I'm going to rewrite my personal homepage.

This article only covers basic Svelte 5; I'll discover advanced usage as I write (though I feel like I might not need much of it).

~~Only after finishing this did I realize what kind of hard days I was living through when writing React before.~~

-----
## Basic Format
The official example puts `<script>` first, then `<html>`, and finally `<style>`.

- Syntax Sugar #1: If your variable name is the same as the attribute name you want to pass, you can pass the variable directly without declaring the attribute name (for example, the `src` of an `<img>`. If you have a variable called `src` that stores the resource address, you don't need to write `src={src}` when passing it to `<img>`; you can just write `{src}`).

## Rune & State

### `$state`
Its role is to declare that a variable is a reactive state, allowing Svelte to manage variable states and component updates. The underlying principle is a JS Proxy.

### `$derived`
This also declares a reactive variable, but it is calculated from `$state`. Its purpose is to facilitate the management of the call chain, and `$derived` can also perform caching (when the original `$state` has not changed).

### `$state.snapshot` and `$inspect`
`$state.snapshot` retrieves the raw value from `$state` to pass to other non-Svelte components, capturing only the current state.

If you want to use `console.log`, the official team has wrapped a `$inspect` for you. It's equivalent to helping you perform a snapshot before `console.log`, and you can also specify a function. More conveniently, this code is automatically removed in production builds.

```svelte
<script lang='ts'>
  let numbers = $state<Array<number>>([1, 2, 3, 4])
  let total = $derived<Array<number>>(numbers.reduce((t, n) => t + n, 0))

  function addNumber() {
    numbers.push(numbers.length + 1)
    console.log($state.snapshot(numbers)) // Look at this
  }

  // OR
  $inspect(numbers).with(console.trace)
</script>
```

### `$effect`

Used for writing your own state update logic. Use this method as a last resort if the official DOM events cannot meet your needs. If you directly modify `$state` or a referenced `$state` is modified, Svelte will help you monitor the change and update the component/run `$effect` automatically.

`return()` can help you perform cleanup work; it will execute before the effect runs again.

If the effect does not depend on any `$state`, it will only run once when the component mounts.

`$effect` cannot run during server-side rendering (SSR).

```svelte
<script lang='ts'>
  let elapsed = $state<number>(0)
  let interval = $state<number>(1000)
  $effect(() => {  // Triggered if interval is modified
  const id = setInterval(() => {
    elapsed += 1
  }, interval)

  return () => {  // Executes before this effect re-runs to clean up the unneeded setInterval
    clearInterval(id)
  }
})
</script>

<button onclick={() => interval /= 2}>speed up</button>
<button onclick={() => interval *= 2}>slow down</button>

<p>elapsed: {elapsed}</p>

```

### `$state` outside Components

You can place `$state` in an external file to act as a shared state. Note that exported variables must be `const` (i.e., immutable in reference), and you cannot directly replace the entire variable when modifying it. You can, however, modify the contents within that `const` Object.

Also, note that this js/ts file must be declared as Svelte content (using the `.svelte.js` or `.svelte.ts` extension).

shared.svelte.js
```ts
interface Counter {
  count: number
}

export const counter = $state<Counter>({ // state is used here
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

Declares parameters in child components. You can pass many parameters.

They can be destructured and assigned default values.

Child.svelte
```svelte
<script lang='ts'>
  interface Props {
    answer: number
    writer: string
  }

  let {answer, writer = 'kyree'}: Props = $props() // Sets default value of writer to 'kyree'
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

If you are lazy, you can also destructure a matching Object and pass it all at once to the child component.

```svelte
<script>
  import PackageInfo from './PackageInfo.svelte';

  const pkg = {
    name: 'svelte',
    version: 5,
    description: 'blazing fast',
    website: '[https://svelte.dev](https://svelte.dev)'
  };
</script>

<PackageInfo
 {...pkg}
/>

```

---

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

The second parameter `i` can be used as an index.

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

It is best to give each generated element a unique ID (i.e., use parentheses at the end of the `each` template to contain the variable you want to use as an ID). **Note: do not use the auto-incrementing variable `i` as an ID, as it is no different from not using one at all.**

(It's best to assign IDs to all lists that may change to avoid many unexpected behaviors.)

### await

You can perform operations while waiting for a Promise.

```svelte
{#await promise}
  <p>...rolling</p>
{:then number}
  <p>you rolled a {number}!</p>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

```

The `promise` following `await` stores the fetched Promise, and the `number` inside `then` stores the fulfilled result of the Promise. If you don't want a "waiting" element, you can simplify it:

```svelte
{#await promise then number}
  <p>you rolled a {number}!</p>
{/await}

```

### DOM event

You can use this shorthand for direct binding: `on<name>`

```svelte
<div onpointermove={onpointermove}>
  The pointer is at {Math.round(m.x)} x {Math.round(m.y)}
</div>

```

Or more aggressively, you can go inline:

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

In the HTML hierarchy, DOM events first pass from the outside in during the Capture phase; after reaching the triggered node, they pass from the inside out during the Bubbling phase. Svelte's default behavior is to listen to the Bubbling phase. If you need to specify listening to the Capture phase, you need to add the keyword `on<name>capture`:

```svelte
<div onkeydowncapture={(e) => alert(`<div> ${e.key}`)} role="presentation">
  <input onkeydowncapture={(e) => alert(`<input> ${e.key}`)} />
</div>

```

If Capture and Bubbling phases are mixed, Capture group events will always occur first according to the previously explained DOM event propagation order.

### DOM event passing & spreading

Functions can be passed as parameters to child components. If you pass a function called `onclick`, it can even be destructured directly from `props` in the child component for use:

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

---

## Binding

In Svelte, data flow defaults to passing from the parent component to the child component via `props` or by setting child component attributes directly. If a child component needs to pass data to the parent component (especially regarding form elements and other HTML components), Binding must be used:

```svelte
<script lang='ts'>
  let name = $state<string>('world');
</script>

<input bind:value={name} />

<h1>Hello {name}!</h1>

```

Postscript: If you want a `$state` to be mutually bound between a parent and child component (since data is one-way by default), you need to declare this two-way state binding on both sides:

```svelte
// In the parent component
<Child bind:index={currIndex}/>

// In the child component
let { index = $bindable() } = $props()

```

Postscript #2: Using the `$state` outside components method is equivalent to a simple Global state, anywhere you change the value of the state can trigger all the state it referred.

### input

Binding for `<input>` is necessary here, even if you use the `$state` outside components method. Binding `$state` with a form component acts as syntax sugar that automatically monitors changes and writes back to the parent component's state when necessary.

Additionally, when the `<input>` type is `range` or `number`, using `bind:value` will automatically convert the value to the expected format (number).

For checkbox type `<input>`, you need to use `bind:checked` (~~how mean~~), which will automatically convert the value to a boolean.

### select

For `<select>`, you need to use `bind:value` again, while **noting**:

* In the example, the `selected` variable (without an initial value), although bound with `bind:value`, will only be assigned a value after the `<select>` component mounts. Therefore, if `selected` is not given an initial value and is still undefined at load time, it cannot be used directly; you must check if the variable is uninitialized (or assign an initial value in advance if it is known).
* If `<select multiple>` is used (allowing multiple selections with the ctrl key), the returned `selected` will be an array.
* Syntax Sugar #2: If the displayed value of an `<option>` is the same as the `value` attribute, you can just pass the displayed value; Svelte will automatically assign it to `value` (not shown in the example).

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
    alert(`answered question ${selected.id} (${selected.text}) with "${answer}"`);
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

If you use `each` to generate multiple radio buttons or checkboxes, you can use `bind:group` to categorize those in the same group together and return them to the same passed-in `$state`. (Very friendly for grouped checkboxes; multiple selected values can enter `$state` in the form of an array).

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

---

## Classes & Styles

Classes can be controlled using reactive variables or built using arrays (utilizing the built-in [clsx]()).

`style:` can also be controlled with reactive variables, and multiple `style:` entries can exist for better aesthetics.

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

It is recommended to modify child component styles via CSS variables: pass `--color="red"` directly to the child component and use this CSS variable in the child component's style: `background-color: var(--color, #ddd);`. Svelte automatically generates a wrapper div to prevent strange issues.

---
## Attachments
The role of `{@attach}` is to modify the element it is attached to: an attached element passes itself (of type `Element`) as an argument to the attach function, which can then perform certain modifications on that element. This is best suited for situations where you want to use a third-party library that doesn't provide a Svelte wrapper. In such cases, you can use the library's native API, whether it's for mounting the library onto an existing element or inserting new elements.

Here is an example using `embla-carousel`:
```svelte
<script lang='ts'>
  import EmblaCarousel from 'embla-carousel'
  import type { Attachment } from 'svelte/attachments'

  let emblaApi: EmblaCarouselType | undefined // This type is imported from somewhere; I won't waste space on the import here.

  const loadEmbla: Attachment = (element) => { // The type of 'element' here is Element, not HTMLElement (the superclass)
    emblaApi = EmblaCarousel(element as HTMLElement, { loop: true }) // Here, mounting is performed by obtaining the attached element
    // Other operations on emblaApi are omitted here
    return () => {
      emblaApi?.destroy() // Destroying it here
    }
  }
</script>

<div class="embla__viewport" {@attach loadEmbla}></div>
```
Operations on the element here are all native JS operations. One point to note is that the type of `element` is `Element`, not `HTMLElement`, because the attached element is not necessarily an HTML node. While you can "hack" it by force-casting it as an `HTMLElement` in personal projects, it's something to focus on when writing large-scale projects.

Passing parameters is also possible, as seen in this official example:
```svelte
<script lang='ts'>
  let content = $state<string>('Hello!')

  function tooltip(content) {
    return (node) => {
      const tooltip = tippy(node, { content }) // tippy is an external method; simply put, it creates a tooltip/popup
      return tooltip.destroy
    }
  }
</script>

<input bind:value={content} />

<button {@attach tooltip(content)}>
  Hover me
</button>
```

---

## Transitions

### Use built-in

Svelte has some built-in preset transition animations for convenience. For example, in this simple `fade` example, after importing `fade` from `svelte/transition`, you declare `transition:fade` directly inside the `<p>` to add animation when it joins or leaves the DOM:

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

Transition animations can have their performance configured:

```svelte
<p transition:fly={{ y: 200, duration: 2000 }}>
  Flies in and out
</p>

```

When using `transition`, the animation is interruptible, which is great. If you specify `in` and `out` separately (different animations for entering and exiting), then there is no interrupt animation:

```svelte
<p in:fly={{ y: 200, duration: 2000 }} out:fade>
  Flies in, fades out
</p>

```

### Use my-own

You can also write your own transition animations. However, looking at them, they seem complex, so I'll just paste the official examples:

```js
// css transition
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

Svelte also provides event handlers for the start/end of entry/exit animations. Say thank you, Svelte:

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

By default, component transition animations only occur when the component itself is destroyed or loaded. If you want sibling components to move together when any component is destroyed or loaded, you need to use the `|global` modifier: `transition:slide|global`

### Key blocks

Svelte's animations only work on component destruction/loading. If sometimes only the content of a component changes but I still want it to have an animation, I can wrap it in `{#key}`. This way, Svelte will monitor changes (like `i` in the example) and automatically "destroy and rebuild" the component for you, executing the animation:

```svelte
<script lang='ts'>
  // i here is also state
  // Full typewriter code not pasted, only shown as a simple example
  let i = $state<number>(-1)
</script>

{#key i}
  <p in:typewriter={{ speed: 10 }}>
    {messages[i] || ''}
  </p>
{/key}

```

## Advanced Usage

I've selected a few advanced techniques that I find useful/interesting; they can serve as inspiration/references.

### `$state.raw()`

Same usage as `$state()`, except that regular state creates a state variable with deep reactivity, while raw state has shallow reactivity and won't trigger on changes to values inside the object at construction time.

If you need to trigger this raw state, you need to reassign a new value.

Suitable for performance optimization when the state structure is very complex (such as Three.js objects).

### getter & setter

You can rewrite the assignment and reading behavior for state:

```svelte
<script>
  const MAX_SIZE = 200;

  class Box {
    #width = $state(0); // Make it a private variable of this class by adding # before the variable
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

### Built-in Methods

In the [svelte/reactivity](https://svelte.dev/docs/svelte/svelte-reactivity) package, you can directly create corresponding `$state()` objects.

For example, directly creating `const large = new MediaQuery('min-width: 800px')` will return a reactive variable that can be read at `large.current`, and changes will automatically trigger updates.

### Store

Why still use Store when we have `$state() outside components`: Store allows for lifecycle operations when subscribers subscribe/unsubscribe. While `$state()` is convenient, it can only synchronize value changes.

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

<!-- $count += 1 is shorthand for: count.update((n) => n + 1) -->
<button onclick={() => $count += 1}>
  clicks: {$count}
</button>
```

Some more usage methods:
```ts
import { writable } from 'svelte/store'

const count = writable<number>(0, () => {
  console.log('got a subscriber') // Triggered when there's a first new subscriber
  return () => console.log('no more subscribers') // Triggered after all subscribers are cleared
})

count.set(1) // No action

const unsubscribe = count.subscribe((value) => {
  console.log(value);
}) // Logs: got a subscriber, then 1

count.set(2) // Logs: 2

count.update((n) => n + 1) // Logs: 3

unsubscribe() // Logs: no more subscribers
```

`readable` can be initialized when the first subscription occurs, and can call itself to complete some value changes (value cannot be changed from outside), and clean up when the last subscriber leaves:
```ts
import { readable } from 'svelte/store'

const ticktock = readable<string>('tick', (set, update) => {
  const interval = setInterval(() => {
    update((sound) => (sound === 'tick' ? 'tock' : 'tick')) // Self-callback function, can change its own value
  }, 1000)

  return () => clearInterval(interval)
})
```

`derived` can calculate values from other Stores and trigger callbacks when the first subscriber appears or referenced values change:
```ts
import { derived } from 'svelte/store';

const delayedIncrement = derived(a, ($a, set, update) => {
  set($a);
  setTimeout(() => update((x) => x + 1), 1000);
  // every time $a produces a value, this produces two
  // values, $a immediately and then $a + 1 a second later

  return () => {
    // Triggered after the last subscriber leaves
  }
})
```

`readonly` can convert a `writable` to read-only:
```ts
import { readonly, writable } from 'svelte/store'

const writableStore = writable(1)
const readableStore = readonly(writableStore)
```

If you want to read the value without subscribing and without triggering events, you can use `get`:
```ts
import { get } from 'svelte/store'

const value = get(store)
```

### Interpolation

If you want to change values while achieving interpolation during the change process, you can use `Tween()` and `Spring()`:
```svelte
<script lang="ts">
  import { Tween } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing' // You can reference interpolation methods from this library

  let progress = new Tween(0, {
    duration: 400,
    easing: cubicOut
  })
</script>

<!-- Read value -->
<progress value={progress.current}></progress>

<!-- Set value -->
<button onclick={() => (progress.target = 50)}>
  50%
</button>

<!-- Or you can use progress.set(value, options), which returns a Promise when interpolation is complete -->
```

`Spring()` is similar and can also complete interpolation. It's more like a spring, with physical properties to its motion: `stiffness` and `damping`.

### Advanced Animation Behaviors

Use `crossfade` or `flip` to implement (where `flip` refers to "First Last Invert Play").

### Context

Use the Context API to achieve context-unified state sharing.
```ts
// in a parent component
import { setContext } from 'svelte';

let context = $state({...});
setContext('my-context', context);

// in a child component
import { getContext } from 'svelte';

const context = getContext('my-context');
```

1. The Context identifier (key) can be anything, and you can store anything in it;
2. Context storage and retrieval must be executed during component initialization.