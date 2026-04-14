---
title: "Learn Vue 3 from Scratch"
date: 2026-04-13T14:55:55+08:00
draft: false
categories: ['Learning']
tags: ['Vue', 'Learning', 'Frontend', 'JavaScript', 'TypeScript', '2026']
summary: "Being forced by someone to learn Vue 3"
---

-----
## Preface

Following the official documentation tutorial to learn, and documenting key knowledge points to prevent forgetting after learning. Code examples are directly copied from the official documentation.

This article only covers basic Vue 3 (Composition API). Advanced usage will be added when I encounter them.

-----
## Basic Format

A standard Vue 3 SPA application consists of a root component and child components. The root component uses the `.mount()` method to render inside a Div (the Div itself will not be considered part of Vue).

In single file components, use `<script setup>` first, then `<template>` (for HTML), and finally `<style scoped>`.

-----
## Template Syntax

### Text Interpolation

Use double curly braces, values will all be rendered as text (HTML is not parsed).

```vue
<span>Message: {{ msg }}</span>
```

If you want it to parse HTML, use `v-html`.

```vue
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

### Attribute Binding

Cannot use double curly braces directly; instead use `v-bind`.

```vue
<div v-bind:id="dynamicId"></div>

<!-- or -->

<div :id="dynamicId"></div>

<!-- Shorthand syntax sugar for id=id with same name -->
<div :id></div>
<div v-bind:id></div>
```

The above syntax binds the Div's `id` attribute to `dynamicId`.

If the state variable is of boolean type, the attribute will be dynamically added/removed:

```vue
<button :disabled="isButtonDisabled">Button</button>
```

Here if `isButtonDisabled` is true, the `disabled` attribute will be applied.

If you need multiple bindings, you can create an Object and directly use `v-bind`.

```vue
<script setup lang="ts">
  const objectOfAttrs = {
    id: 'container',
    class: 'wrapper',
    style: 'background-color:green'
  }
</script>
<template>
  <div v-bind="objectOfAttrs"></div>
</template>
```

### JavaScript Expressions

Available in any text interpolation/attribute binding.

```vue
<!-- Text interpolation -->
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<!-- Attribute binding -->
<div :id="`list-${id}`"></div>
```

Inside here, only limited global object lists can be accessed. Others like the `window` object can be added by setting `app.config.globalProperties`.

```js
const GLOBALS_ALLOWED =
  'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
  'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
  'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol'
```

### Directive Arguments

```vue
<a v-bind:href="url"> ... </a>
<a v-on:click="doSomething"> ... </a>

<!-- Shorthand -->
<a :href="url"> ... </a>
<a @click="doSomething"> ... </a>
```

### Dynamic Arguments

You can assign variables directly to attributes, provided the attribute is enclosed in square brackets.

```vue
<a v-bind:[attributeName]="url"> ... </a>
<a v-on:[eventName]="doSomething"> ... </a>

<!-- Shorthand -->
<a :[attributeName]="url"> ... </a>
<a @[eventName]="doSomething"> ... </a>
```

Constraints:
1. The variable can only return String or `null` (meaning remove this attribute), **other non-string values will trigger a warning.**
2. Attributes in square brackets cannot contain spaces or quotes
3. (In DOM directly manipulated by browser, not applicable to Vite/Webpack) Attributes should not contain uppercase letters, which will be converted to lowercase

```vue
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

### Modifiers

Special suffixes starting with a dot, indicating that the directive should be bound in some special way.

```vue
<form @submit.prevent="onSubmit">...</form>
```

-----
## Reactivity

### `ref()`

Use `ref()` to declare reactive variables (when it's just a standalone value, it uses `Object.defineProperty (Getter/Setter)` implementation; when an Object is passed in, it converts to JS Proxy implementation).

At the same time, if you build an Object, modifying its internal properties can also trigger updates.

```vue
<script setup lang="ts">
  import { ref } from 'vue'

  const count = ref<number>(0)
  console.log(count.value)

  function increment() {
    count.value++
  }
</script>

<template>
  <button @click="value++">
    {{ value }}
  </button>
</template>
```

In js/ts logic code, use `.value` to read the value, while in templates it will be automatically unwrapped without needing to add it.

Value changes are not immediate but happen within a Tick. If you want to immediately request an update Tick, you need to use `nextTick()`:

```ts
import { nextTick } from 'vue'

await nextTick()
```

### `reactive()`

Another method to declare reactive variables (implemented using JS Proxy).

{{< alert>}}
Try not to use this method; it's best for a project to uniformly use `ref()` for declarations.
{{< /alert >}}

The advantage of this method is that reading values can be written directly without adding `.value`. The disadvantage is that you cannot use non-Object standalone values (like string, number, boolean) to build.

Also supports deep reactivity.

```ts
import { reactive } from 'vue'

interface State {
  count: number
}

const state: State = reactive({ count: 0 })
```

Small feature: `reactive()` creates a Proxy when passed an Object; if a Proxy is passed in, it returns the passed value. If you want to compare values inside a Proxy, you can use this trick, or perform destructuring:

```ts
import { reactive } from 'vue'

const state = reactive({ count: 0 })

{ count } = state // Here count has been unwrapped to a primitive value and disconnected from the Proxy.
```

### `ref()` Unwrapping Behavior in Templates

Only top-level `ref()` will be unwrapped (no need to use `.value`), other deep `ref()` need to be manually unwrapped.

```vue
<script setup lang="ts">
  import { ref } from "vue"

  const count = ref(0)
  const object = { id: ref(1) }

  const { id } = object // Destructure
</script>

<template>
  <!-- OK -->
  {{ count + 1 }}
  <!-- Not OK -->
  {{ object.id + 1 }}
  <!-- OK after destructuring -->
  {{ id + 1 }}
</template>
```

### `computed()`

Similar to Svelte's `$derive()`, computes values from another `ref()` or `reactive()`, with some caching.

```vue
<script setup>
  import { reactive, computed } from 'vue'

  interface Author {
    name: string
    books: Array<string>
  }

  const author = ref<Author>({
    name: 'John Doe',
    books: [
      'Vue 2 - Advanced Guide',
      'Vue 3 - Basic Guide',
      'Vue 4 - The Mystery'
    ]
  })

  // A computed property ref
  const publishedBooksMessage = computed<'Yes' | 'No'>(() => {
    return author.value.books.length > 0 ? 'Yes' : 'No'
  })
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

1. `computed()` is read-only by default; generally, it should remain read-only. If you insist on making it writable, you need to declare `getter()/setter()` methods yourself:

```js
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // Note: We use destructuring assignment syntax here
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
```

2. In versions 3.4+, `computed()` can obtain the previous value (this is quite nice):

```js
import { ref, computed } from 'vue'

const count = ref(2)

// This computed property returns the value of count when it is less than or equal to 3.
// When count's value is greater than or equal to 4, it will return the last value that met our condition
// until count's value is less than or equal to 3 again.
const alwaysSmall = computed((previous) => {
  if (count.value <= 3) {
    return count.value
  }

  return previous
})
```

3. Getter methods should never have side effects: that is, only value retrieval and computation operations are allowed, and never assignment or value modification behavior!

-----
## Class and Style Binding

### Class Binding

You can control adding and removing Classes by passing an Object.

```vue
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

Or pass computed properties to achieve batch changes:

```vue
<script setup lang="ts">
  import { ref, computed } from 'vue'

  const isActive = ref(true)
  const error = ref(null)

  const classObject = computed(() => ({
    active: isActive.value && !error.value,
    'text-danger': error.value && error.value.type === 'fatal'
  }))
</script>

<template>
  <div :class="classObject"></div>
</template>
```

You can also pass an array:

```vue
<script setup lang="ts">
  import { ref, computed } from 'vue'

  const activeClass = ref('active')
  const errorClass = ref('text-danger')
</script>

<template>
  <div :class="[activeClass, errorClass]"></div>
  <!-- Or use ternary expression -->
  <div :class="[isActive ? activeClass : '', errorClass]"></div>
  <!-- Or use nested expressions in array -->
  <div :class="[{ [activeClass]: isActive }, errorClass]"></div>
</template>
```

### Style Binding

`:style` supports binding inline CSS objects (CSS attribute names use camelCase):

```vue
<script setup lang="ts">
  import { ref } from "vue"

  const activeColor = ref('red')
  const fontSize = ref(30)
</script>

<template>
  <div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
  <!-- Or standard kebab-cased syntax -->
  <div :style="{ 'font-size': fontSize + 'px' }"></div>
</template>
```

Also supports passing arrays:

```vue
<!-- baseStyles and overridingStyles are both CSS objects -->
<div :style="[baseStyles, overridingStyles]"></div>
```

Style multiple values: You can provide multiple values (with different prefixes) for a style property; the array will only render the last value supported by the browser (can be used for compatibility).

```vue
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

-----
## Component Rendering

### `v-if` `v-else` `v-else-if`

```vue
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

`v-else` `v-else-if` must follow a `v-if`, otherwise they won't work.

You can even put `v-if` on a template to achieve multi-element control.

```vue
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### `v-show`

`v-if` will unmount the component, while `v-show` will make the component invisible through CSS. `v-show` cannot be used on template. `v-show` has no else available.

### `v-for`

Enumeration.

```vue
<script setup lang="ts">
  import { ref } from "vue"

  const parentMessage = ref('Parent')
  const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
</script>

<template>
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>

  <!-- Or use of if you prefer -->
  <div v-for="item of items"></div>

  <!-- Can pass three parameters in total, in order: item, key (if any), index -->
  <li v-for="(value, key, index) in myObject">
    {{ index }}. {{ key }}: {{ value }}
  </li>
</template>
```

Passing a number for auto-increment also works:

```vue
<!-- n will auto-increment from 1 to 10 (not starting from 0) -->
<span v-for="n in 10">{{ n }}</span>
```

`v-for` can also directly act on template

```
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

When on the same node, `v-if` has higher rendering priority than `v-for`, although it's not recommended to mix them in one place.

This means `v-if` cannot read the items enumerated by `v-for`.

```vue
<!-- Here v-if cannot read the todo value -->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>

<!-- Need to separate the two -->
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

Also highly recommended to give each enumerated element a key, and the key must be unique.

```vue
<div v-for="item in items" :key="item.id">
  <!-- Content -->
</div>

<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

Also, if you want to use `v-for` with a component, you can use the syntax directly while manually passing to child components (this won't be automatically injected for you):

```vue
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

For enumerating ref variables, you can directly manipulate this array, or (in some cases filter concat slice will only return a new array) need to directly replace the original array; Vue will automatically remove unchanged items and modify changed items.

Can use the following methods for convenient filtering/sorting:

```vue
<script setup lang="ts">
  import { ref } from "vue"
  const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
  ])

  function even(numbers) {
    return numbers.filter((number) => number % 2 === 0)
  }
</script>

<template>
  <ul v-for="numbers in sets">
    <li v-for="n in even(numbers)">{{ n }}</li>
  </ul>
</template>
```

At the same time, when using reverse() and sort(), these two methods will modify the original array, so you need to create a copy of the original array:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```

-----
## Event Handling and Data Binding

### Event Handling

Use `v-on:click="handler"` or shorthand `@click="handler"` to bind events.

```vue
<!-- Inline -->
<button @click="count++">Add 1</button>
<!-- Pass parameter -->
<button @click="greet">Greet</button>
<!-- Inline parameter passing -->
<button @click="say('hello')">Say hello</button>
```

In inline state, you can also use the special `$event` to conveniently access event parameters:

```vue
<button @click="warn('Form cannot be submitted yet.', $event)">Submit</button>
<!-- Or use arrow function -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">Submit</button>
```

Also provides convenient event modifiers to simplify writing (so many, just paste the official examples):
- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue
<!-- Click event propagation will be stopped -->
<a @click.stop="doThis"></a>

<!-- Submit event will no longer reload the page -->
<form @submit.prevent="onSubmit"></form>

<!-- Modifiers can be chained -->
<a @click.stop.prevent="doThat"></a>

<!-- Can also have modifiers only -->
<form @submit.prevent></form>

<!-- Only triggers handler when event.target is the element itself -->
<!-- For example: event handler doesn't come from child element -->
<div @click.self="doThat">...</div>

<!-- Add event listener using `capture` capture mode -->
<!-- For example: events targeting inner elements are handled by outer element first -->
<div @click.capture="doThis">...</div>

<!-- Click event will only be triggered once -->
<a @click.once="doThis"></a>

<!-- Default behavior of scroll event (scrolling) will happen immediately rather than waiting for `onScroll` to complete -->
<!-- In case it contains `event.preventDefault()` -->
<div @scroll.passive="onScroll">...</div>
```

Also has key modifiers for conveniently capturing specific keys:

```vue
<!-- Only calls `submit` when `key` is `Enter` -->
<input @keyup.enter="submit" />

<!-- Or directly use the key name exposed by KeyboardEvent.key as modifier -->
<input @keyup.page-down="onPageDown" />

<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>

<!-- When Ctrl is pressed, it will trigger even if Alt or Shift is also pressed -->
<button @click.ctrl="onClick">A</button>

<!-- Only triggers when Ctrl is pressed and no other keys -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- Only triggers when no system keys are pressed -->
<button @click.exact="onClick">A</button>
```

Common key aliases:
- `.enter`
- `.tab`
- `.delete` (captures both "Delete" and "Backspace" keys)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

System key modifiers:
- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

Mouse button modifiers:
- `.left` primary
- `.right` secondary
- `.middle` middle

### Form Data Binding

Use `v-model` to conveniently bind data to input fields, so you don't need to manually bind values and change events.

```vue
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```

1. If there is IME, the input letter mode will help you not synchronize values. If you need to synchronize values, you need to manually bind `value`.
2. textarea only supports binding `v-model`.
3. Binding one value to multiple checkboxes can achieve array element addition and removal

checkbox has special binding values:

```vue
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />

<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

The `true-value` and `false-value` attributes don't affect the value attribute, because browsers don't include unchecked checkboxes when submitting forms. To ensure one of these two values (e.g., "yes" and "no") is submitted with the form, use radio buttons as an alternative.

### Modifier `.lazy`

By default, `v-model` updates on every input. If you want to update after change, you can use `.lazy`:

```vue
<!-- Sync after "change" event instead of "input" -->
<input v-model.lazy="msg" />
```

### Modifier `.number`

Can automatically convert to number, but if the value cannot be processed by `parseFloat()`, it returns the original value. When input is empty, it returns an empty string. Automatically enabled when input has `type=number`.

### Modifier `.trim`

Removes leading and trailing whitespace from user input.

-----
## Watchers

In addition to `computed()`, there is also `watch()` that can listen to changes in `ref()`, but `watch()` can perform side effects internally:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
const loading = ref(false)

// Can directly watch a ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

Where `watch()` accepts three arguments: the first is the `ref()` being watched (can also be the result of combining multiple `ref()` calculations), the second is the handler function, and the third is optional behavior:

### Optional Behavior `deep`

`watch()` by default listens to a reactive object, automatically creating implicit deep watching. In contrast, a getter function that returns a reactive object will only trigger the callback when it returns a different object. If you still need deep watching, you need to declare `deep: true`.

Here `deep` in versions 3.5+, supports passing a number to specify the maximum watching depth.

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Note: `newValue` here equals `oldValue`
    // *unless* state.someObject is replaced entirely
  },
  { deep: true }
)
```

### Optional Behavior `immediate`

By default, the watcher only triggers when the watched data changes, not when it's created. If you need to trigger once when created, declare `immediate: true`.

### Optional Behavior `once`

In versions 3.4+, you can declare `once: true` to execute only once.

### `watchEffect`

Similar to `watch()`, but no need to declare the variable being watched (will automatically detect used reactive variables), and executes once on first creation.

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

### Cleanup Callback

Execute cleanup actions before re-triggering.

In versions 3.5+, you can directly call `onWatcherCleanup()`:

```js
import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // Callback logic
  })

  onWatcherCleanup(() => {
    // Abort expired request
    controller.abort()
  })
})
```

Or use the returned cleanup function:

```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // Cleanup logic
  })
})

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // Cleanup logic
  })
})
```

### Watcher Trigger Timing

By default, watcher callbacks are called after the parent component updates (if any), before the DOM update of the owning component. This means if you try to access the DOM of the owning component in the watcher callback, the DOM will be in the pre-update state.

### Optional `flush`

Based on the above behavior, if you want to get the updated owning component instance, declare `flush: post`.

Also, if you want to trigger before Vue makes any updates (blocking execution immediately after reactive variable changes), declare `flush: sync`, or use `watchSyncEffect()`.

### Unmounting Watchers

Generally, watchers are bound to their owning component; when the component unmounts, the watcher unmounts with it.

But if you create watchers in asynchronous situations, you need to manually unmount them:

```js
const unwatch = watchEffect(() => {})

// ...when the watcher is no longer needed
unwatch()
```

Try not to create watchers asynchronously unless you know what you're doing.

-----
## Getting Element Instance

Use the special attribute `ref`:

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// First argument must match the ref value in the template
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

You can also get a template instance.

If mounted on a node with `v-for`, it will return an array containing all enumerated child instances.

`ref` can also be passed a function, which will receive its own instance each time the component updates:

```vue
<input :ref="(el) => { /* assign el to a data property or ref variable */ }">
```

Here `ref` is dynamically bound, and when the component unmounts, it will trigger again with value `null`.

-----
## Component Usage

### Component Building and Reference

Create SFC components using `*.vue` files. Import and use them.

### Dynamic Components

You can dynamically load components by passing the imported component to `is`:

```vue
<script setup>
import Home from './Home.vue'
import Posts from './Posts.vue'
import Archive from './Archive.vue'
import { ref } from 'vue'
 
const currentTab = ref('Home')

const tabs = { // An array composed of imported components
  Home,
  Posts,
  Archive
}
</script>

<template>
  <div class="demo">
    <button
       v-for="(_, tab) in tabs"
       :key="tab"
       :class="['tab-button', { active: currentTab === tab }]"
       @click="currentTab = tab"
     >
      {{ tab }}
    </button>
 	  <component :is="tabs[currentTab]" class="tab"></component>
  </div>
</template>
```

Here `is` can be either a component name or a component instance.

### Lifecycle

There are `onMounted()` `onUpdated()` `onUnmounted` etc. available.

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```

### Props

First, the component needs to declare receiving Props:

```vue
<script setup lang="ts">

  interface Props {
    title: string
    likes: number
  }

  const props = defineProps({
    title: { type: String, required: true },
    likes: Number
  })

  // Or another declaration method

  const props = definProps<Props>()

  console.log(props.title)
</script>
```

Props are reactive by default:

```js
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // Only runs once before 3.5
  // Re-executes when "foo" prop changes in 3.5+
  console.log(foo)
})
```

Similarly, destructuring and assigning initial values are supported:

```js
const { foo = 'hello' } = defineProps<{ foo?: string }>()
```

But after destructuring, here `foo` is equivalent to `props.foo` which is a fixed value, not a reactive variable. At this point, it needs to be wrapped in a getter:

```js
watch(() => foo, /* ... */)
```

If you need to pass to external components, you need to continue building:

```js
useComposable(() => foo)
```

1. Props variables are recommended to use camelCase, while template input should use `-` connection
2. Template input props can use `v-bind:` to directly pass a whole object
3. Props default to one-way passing, but because of deep watching, changing values in Object will also trigger updates

Props can use TypeScript for compile-time validation, or runtime validation:

```js
defineProps({
  // Basic type check
  // (Giving `null` and `undefined` values will skip any type checking)
  propA: Number,
  // Multiple possible types
  propB: [String, Number],
  // Required, String type
  propC: {
    type: String,
    required: true
  },
  // Required but nullable string
  propD: {
    type: [String, null],
    required: true
  },
  // Default value for Number type
  propE: {
    type: Number,
    default: 100
  },
  // Default value for Object type
  propF: {
    type: Object,
    // Default value for object or array
    // Must be returned from a factory function.
    // The function receives the original prop passed to the component as parameter.
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // Custom type validator function
  // In 3.4+, the complete props are passed as the second parameter
  propG: {
    validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // Default value for Function type
  propH: {
    type: Function,
    // Unlike object or array default, this is not a
    // factory function. This will be the function used as default value
    default() {
      return 'Default function'
    }
  }
})
```

Among these:
1. All Props are optional by default unless declared required
2. Boolean type values default to `false` when no value is passed, other types default to `undefined`
3. The behavior of default values is: whether because no value was passed or `undefined` was passed, the default value is returned in the end
4. Type checking can pass in class objects; at runtime `typeof Class` will be used to check the type

### Events

You can define an event binding in the parent component, then conveniently call it in the child component below (also note the automatic conversion here):

```vue
<script setup lang="ts">
  function callback(props, config) { // Here $emit passes how many parameters, how many parameters will be received here
    console.log(props)
  }
</script>

<template>
  <MyComponent @some-event="callback" />
    <button @click="$emit('someEvent', props, config)">Click Me 01</button>
    <button @click="$emit('someEvent', props, config)">Click Me 02</button>
  </MyComponent>
</template>
```

There is no bubbling mechanism.

Can be explicitly declared:

```vue
<script setup>
  defineEmits(['inFocus', 'submit']) // Must be placed at the top level of setup scope

  function buttonClick() {
    emit('submit') // Can be used in setup or in template
  }
</script>
```

How to declare types:

```vue
<script setup lang="ts">
// Runtime
const emit = defineEmits(['change', 'update'])

// Options-based
const emit = defineEmits({
  change: (id: number) => {
    // Return `true` or `false`
    // to indicate validation passed or failed
  },
  update: (value: string) => {
    // Return `true` or `false`
    // to indicate validation passed or failed
  }
})

// Type-based
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: Optional, more concise syntax
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

Also supports event validation:

```vue
<script setup>
const emit = defineEmits({
  // No validation
  click: null,

  // Validate submit event
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

### Component's `v-model`

Can achieve two-way data binding, recommended to use `defineModel()`:

`Child.vue`

```vue
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>
```

Then using this component can be like this:

```vue
<Child v-model="countModel" />
```

At this point, both the parent and component will have two-way binding to the `countModel` ref.

Can accept arguments, and can also create multiple `v-model` to receive multiple arguments:

`UserName.vue`

```vue
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

```vue
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

`v-model` also supports modifiers and modifier unpacking in child components:

`UserName.vue`

```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```

```vue
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```

### Component Attribute Fallthrough

Refers to if a template has only a single node, the following types: `class` `style` `id` `v-on` will automatically fall through to this node (if there is merging, it will be merged).

If the component's single node is another component, it will continue to fall through (but not including emit and `v-on`, because they were consumed by the upper layer node).

This behavior can be declared as disabled:

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup logic
</script>
```

Combined with this and `v-bind="$attrs"`, you can prevent upper attributes from falling through to the root node, but instead to a certain node under the root node

```vue
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
```

For a component with multiple root nodes, fallthrough will not be enabled unless using `v-bind="$attr"` for declaration. Or get fallthrough values in js:

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

### Slots

`<slot />` is a special component that will be replaced by the child of the component.

Slots can set default content:

```vue
<button type="submit">
  <slot>
    Submit <!-- Default content -->
  </slot>
</button>
```

Can define multiple slots, and give them names; use `v-slot` when referencing to specify the slot (slots without name default to default):

`BaseLayout.vue`

```vue
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

```vue
<BaseLayout>
  <template v-slot:header>
    <!-- Header slot content goes here -->
  </template>
  <template #footer>
    <!-- Footer slot content goes here (shorthand) -->
  </template>
</BaseLayout>
```

Can use conditional slots for selective slot rendering:

```vue
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

Slots can get data from the referencing side, but cannot get data from within the referencing component. However, data in the component can be passed using Props:

```vue
<!-- Template of <MyComponent> -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

```vue
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

Can also be used in named slots:

```vue
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

### Dependency Injection

Use Provide/Inject to directly pass values without having to pass down layer by layer to the deep layers (somewhat similar to context):

```vue
<script setup>
import { provide } from 'vue'

provide(/* injection key */ 'message', /* value */ 'hello!')
provide('read-only-count', readonly(count)) // Read-only
</script>
```

```vue
<script setup>
import { inject } from 'vue'

const value = inject('message', 'This is the default value')

// Or initialize a class as the default value
const value = inject('key', () => new ExpensiveClass(), true) // Third parameter indicates factory function
</script>
```

In large projects, it's recommended not to use string as the key, but `Symbol` in a separate file:

`keys.ts`

```ts
import type { InjectionKey } from 'vue'

export const myInjectionKey = Symbol() as InjectionKey<string>
```

```ts
// In the provider component
import { provide } from 'vue'
import { myInjectionKey } from './keys'

provide(myInjectionKey, { 
  /* Data to provide, type is string */
})
```

```ts
// In the injector component
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

### Async Components

Load components asynchronously on demand from remote:

```vue
const AsyncComp = defineAsyncComponent({
  // Loader function
  loader: () => import('./Foo.vue'),

  // Component to use while loading the async component
  loadingComponent: LoadingComponent,
  // Delay before showing loading component, default is 200ms
  delay: 200,

  // Component to show if loading fails
  errorComponent: ErrorComponent,
  // If a timeout limit is provided and exceeded
  // will also show the error component configured here, default is: Infinity
  timeout: 3000
})
```

-----
## Logic Reuse

### Composables

Can be used for logic reuse:

`mouse.js`

```js
import { ref, onMounted, onUnmounted } from 'vue'

// By convention, composable function names start with "use"
export function useMouse() {
  // State encapsulated and managed by the composable
  const x = ref(0)
  const y = ref(0)

  // Composables can mutate their state at any time.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // A composable can also hook into the lifecycle of its owner component
  // to start and stop side effects
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // Expose managed state through return value
  return { x, y }
}
```

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

Some [writing conventions](https://vuejs.org/guide/reusability/composables.html#conventions-and-best-practices) won't be included here.

### Custom Directives

When the function name starts with v, it can be used as a custom directive. Custom directives should only be used when the required functionality can only be achieved through direct DOM manipulation.

```vue
<script setup>
// Enable v-highlight in template
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</script>

<template>
  <p v-highlight>This sentence is important!</p>
</template>
```

Supports the following hooks:

```js
const myDirective = {
  // Called before the bound element's attributes
  // or event listeners are applied
  created(el, binding, vnode) {
    // Details on each parameter will be introduced below
  },
  // Called before the element is inserted into the DOM
  beforeMount(el, binding, vnode) {},
  // Called when the bound element's parent component
  // and all its own child nodes are mounted
  mounted(el, binding, vnode) {},
  // Called before the parent component of the bound element updates
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // Called after the parent component of the bound element
  // and all its own child nodes are updated
  updated(el, binding, vnode, prevVnode) {},
  // Called before the parent component of the bound element unmounts
  beforeUnmount(el, binding, vnode) {},
  // Called after the parent component of the bound element unmounts
  unmounted(el, binding, vnode) {}
}
```

- el: The element the directive is bound to. This can be used to directly manipulate the DOM.
- binding: An object containing the following properties:
  - value: The value passed to the directive. For example in v-my-directive="1 + 1", the value is 2.
  - oldValue: The previous value, only available in beforeUpdate and updated. Available regardless of whether the value has changed.
  - arg: The argument passed to the directive (if any). For example in v-my-directive:foo, the argument is "foo".
  - modifiers: An object containing modifiers (if any). For example in v-my-directive.foo.bar, the modifiers object is { foo: true, bar: true }.
  - instance: The component instance that uses the directive.
  - dir: The directive definition object.
- vnode: Represents the underlying VNode of the bound element.
- prevVnode: Represents the VNode of the element the directive was bound to in the previous render. Only available in beforeUpdate and updated hooks.

### Plugins

Don't feel like writing, see [official documentation](https://vuejs.org/guide/reusability/plugins.html) yourself.

-----
## Built-in Components

The article is getting too long, so I'll only provide a brief introduction to some built-in utility components and give an example.

### `<Transition>`

Can be triggered by `v-if`, `v-show`, dynamic component switching, changing special key attributes, etc.:

```vue
<button @click="show = !show">Toggle</button>
<Transition name="slide">
  <p v-if="show">hello</p>
</Transition>

<style>
  /* If not named, use v here */
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
```

Also has event hooks, and can be mixed with animation:

```vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

### `<TransitionGroup>`

Animate a list.

```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>

<style>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
```

### `<KeepAlive>`

When a component is declared to be unmounted, instead of unmounting, it caches the state.

Can specify cached nodes based on the component's name:

```vue
<!-- Comma-separated string -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- Regular expression (requires `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- Array (requires `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>

<!-- Or maximum cache count -->
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

### `<Teleport>`

Move child nodes to another DOM node location. Only changes the rendering order on the DOM, without changing the logical parent-child relationship.

```vue
<template>
  <button @click="open = true">Open Modal</button>

  <Teleport to="body" :disabled="isMobile">
    <div v-if="open" class="modal">
      <p>Hello from the modal!</p>
      <button @click="open = false">Close</button>
    </div>
  </Teleport>
</template>
```

Here the `to` value can be a CSS selector string, or a DOM element object.

Also can use `defer`, to apply after all its child nodes are rendered, suitable for when you want to move to your own child nodes.
