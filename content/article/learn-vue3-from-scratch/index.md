---
title: "从头开始学 Vue 3"
date: 2026-04-13T14:55:55+08:00
draft: false
categories: ['Learning']
tags: ['Vue', 'Learning', 'Frontend', 'JavaScript', 'TypeScript', '2026']
summary: "被绑架了你就眨眨眼"
---

-----
## 写在前面

跟着官方的文档教程（中文）在学，然后记录一下关键的知识点防止学完就忘记了。示例直接复制的官方代码。

本文章只涉及基础的 Vue 3 （组合式 API），高级用法等我遇到了再补充。

~~疯狂眨眼~~

-----
## 基础格式
标准的 Vue 3 SPA 应用，都由一个根组件和子组件组成。根组件使用 `.mount()` 方法渲染在一个 Div 中（该 Div 本身不会被视为 Vue 的一部分）。

在单文件组件中，先 `<script setup>`，后`<template>`（里面放 html），最后放`<style scoped>`。

-----
## 模板语法

### 文本插值
用的是双大括号，值将全部使用文本渲染（不解析 HTML）。

```vue
<span>Message: {{ msg }}</span>
```

如果想要它去解析 HTML，需要使用 `v-html`。

```vue
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

### Attribute 绑定
不能直接使用双大括号，而是 `v-bind`。

```vue
<div v-bind:id="dynamicId"></div>

<!-- or -->

<div :id="dynamicId"></div>

<!-- id=id 的同名简写语法糖 -->
<div :id></div>
<div v-bind:id></div>
```

以上写法会将该 Div 的 `id` 属性与 `dynamicID` 绑定。

如果状态变量为布尔类型，会动态添加/删除该 Attribute：

```vue
<button :disabled="isButtonDisabled">Button</button>
```

这里如果 `isButtonDisabled` 为真，`disabled` 这个 Attribute 会被应用。

如果需要多绑定，可以创建一个 Object 然后直接 `v-bind`。

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

### JavaScript 表达式
在任何文本插值/Attribute 绑定中可用。

```vue
<!-- 文本插值 -->
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<!-- Attribute 绑定 -->
<div :id="`list-${id}`"></div>
```

在这里面仅能够访问到有限的全局对象列表，其他的比如 `window` 对象可以通过设置 `app.config.globalProperties` 来新增。

```js
const GLOBALS_ALLOWED =
  'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
  'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
  'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol'
```

### 指令传参

```vue
<a v-bind:href="url"> ... </a>
<a v-on:click="doSomething"> ... </a>

<!-- 简写 -->
<a :href="url"> ... </a>
<a @click="doSomething"> ... </a>
```

### 动态参数
可以把变量直接赋值给 Attribute，前提是这个 Attribute 要用方括号括起来。

```vue
<a v-bind:[attributeName]="url"> ... </a>
<a v-on:[eventName]="doSomething"> ... </a>

<!-- 简写 -->
<a :[attributeName]="url"> ... </a>
<a @[eventName]="doSomething"> ... </a>
```

约束：
1. 变量只能返回 String 或者 `null`（意为移除这个 Attribute），**其他非字符串的值会触发警告。**
2. Attribute 在方括号里，不能有空格和引号
3. （在由浏览器直接操作的 DOM 中，Vite/Webpack 不适用）Attribute 里面不要有大写，大写也会被转换为小写

```vue
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

### 修饰符
以点开头的特殊后缀，表明指令需要以一些特殊的方式被绑定。

```vue
<form @submit.prevent="onSubmit">...</form>
```

-----
## 响应式

### `ref()`
使用 `ref()` 声明响应变量（当只是独立值时使用 `Object.defineProperty (Getter/Setter)` 实现，当是传入 Object 会转为 JS Proxy 实现）。

同时如果构建了一个 Object，对其内部进行修改也可以触发更新。

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

在 js/ts 的逻辑代码中，使用 `.value` 读取值，而在模板中会自动解包不需要加。

值的更改并非立刻，而是在 Tick 内进行。如果想要立马申请更新 Tick，需要使用 `nextTick()`：

```ts
import { nextTick } from 'vue'

await nextTick()
```

### `reactive()`
另外一种声明响应变量的方法（使用 JS Proxy 实现）。

{{< alert>}}
尽量不要使用这种方式，一个项目最好是统一使用 `ref()` 声明。
{{< /alert >}}

这个方法优势在于读值可以直接写不用加 `.value`，缺点是不能使用非 Object 的独立值（比如 string number boolean）来进行构建。

同样支持深层响应。

```ts
import { reactive } from 'vue'

interface State {
  count: number
}

const state: State = reactive({ count: 0 })
```

小功能：`reactive()` 传入 Object 会创建 Proxy，如果传入的是 Proxy 会返回传入值。如果你想比较 Proxy 内的值可以使用这个邪门方法，或者进行解包：

```ts
import { reactive } from 'vue'

const state = reactive({ count: 0 })

{ count } = state // 这里 count 已经被解包为原始值，并且与 Proxy 断开连接。
```

### `ref()` 模板中解包行为
只有最顶层的 `ref()` 会被解包）（不需要使用 `.value`），其他的深层 `ref()` 需要手动解包。

```vue
<script setup lang="ts">
  import { ref } from "vue"

  const count = ref(0)
  const object = { id: ref(1) }

  const { id } = object // 进行解包
</script>

<template>
  <!-- 可 -->
  {{ count + 1 }}
  <!-- 不可 -->
  {{ object.id + 1 }}
  <!-- 解包后可 -->
  {{ id + 1 }}
</template>
```
### `computed()`
类似于 Svelte 的 `$derive()`，从另外一个 `ref()` 或者 `reactive()` 中计算值，可以进行一定的缓存。

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

  // 一个计算属性 ref
  const publishedBooksMessage = computed<'Yes' | 'No'>(() => {
    return author.value.books.length > 0 ? 'Yes' : 'No'
  })
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

1. `computed()` 默认只读，一般情况下也应该保持只读。如果你就是头铁想要让它可写，要自己声明 `getter()/setter()` 方法：

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
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
```

2. 3.4+ 的版本，`computed()` 可以获取上一个值（这个有点好啊）：

```js
import { ref, computed } from 'vue'

const count = ref(2)

// 这个计算属性在 count 的值小于或等于 3 时，将返回 count 的值。
// 当 count 的值大于等于 4 时，将会返回满足我们条件的最后一个值
// 直到 count 的值再次小于或等于 3 为止。
const alwaysSmall = computed((previous) => {
  if (count.value <= 3) {
    return count.value
  }

  return previous
})
```

3. Getter 方法应该永远不要有副作用：也就是说，只能进行值获取和计算操作，而永远不能有赋值或值更改行为！

-----
## 类与样式绑定

### Class 的绑定
可以通过传入 Object 来控制 Class 的添加和移除。

```vue
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

或者传入计算属性实现批量更改：

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

也可以传入数组：

```vue
<script setup lang="ts">
  import { ref, computed } from 'vue'

  const activeClass = ref('active')
  const errorClass = ref('text-danger')
</script>

<template>
  <div :class="[activeClass, errorClass]"></div>
  <!-- 或者使用三元表达式 -->
  <div :class="[isActive ? activeClass : '', errorClass]"></div>
  <!-- 或者在数组中使用内嵌表达式 -->
  <div :class="[{ [activeClass]: isActive }, errorClass]"></div>
</template>
```

### Style 的绑定
`:style` 支持绑定 inline css object（css atrribute 名使用驼峰命名）：

```vue
<script setup lang="ts">
  import { ref } from "vue"

  const activeColor = ref('red')
  const fontSize = ref(30)
</script>

<template>
  <div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
  <!-- 或者 kebab-cased 标准写法 -->
  <div :style="{ 'font-size': fontSize + 'px' }"></div>
</template>
```

同样也支持传入数组：

```vue
<!-- baseStyles 和 overridingStyles 都是 css object -->
<div :style="[baseStyles, overridingStyles]"></div>
```

样式多值：可以对一个样式属性提供多个 (不同前缀的) 值，数组仅会渲染浏览器支持的最后一个值（可以用来做兼容性）。

```vue
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

-----
## 组件渲染

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
`v-else` `v-else-if` 必须跟在一个 `v-if` 后，否则不起作用。

甚至 `v-if` 可以放在一个 template 上实现多元素操控。

```vue
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

### `v-show`
`v-if` 会让组件卸载，而 `v-show` 会通过 css 操控组件不可见。`v-show` 不可用于 template。`v-show` 没有 else 可以用。

### `v-for`
枚举。

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

  <!-- 或者使用 of 如果你喜欢的话 -->
  <div v-for="item of items"></div>

  <!-- 一共可以传三个参，按顺序：子项、键值（如有）、序号 -->
  <li v-for="(value, key, index) in myObject">
    {{ index }}. {{ key }}: {{ value }}
  </li>
</template>
```

同时传入数字进行自增也是可以的：
```vue
<!-- n 会从 1 自增到 10 （并非从 0 开始） -->
<span v-for="n in 10">{{ n }}</span>
```

`v-for` 也可以直接作用于 template

```
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

在同一个节点上时，`v-if` 比 `v-for` 的渲染优先级要更高，虽然并不推荐在一个地方混合使用它们。

这也就意味着，`v-if` 无法读取 `v-for` 枚举出来的子项。

```vue
<!-- 这里 v-if 无法读取到 todo 值 -->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>

<!-- 需要将其两个分离开来 -->
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

同时也非常推荐给每个枚举出来的元素赋予一个 key，同时 key 必须唯一。
```vue
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>

<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

同时这里如果想要将组件使用 `v-for` ，可以直接使用语法的同时，还要手动赋值给子组件（这里并不会自动帮你注入）：
```vue
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

对于枚举 ref 的变量，可以直接操作这个数组，或者（某些情况下 filter concat slice 只会返回新数组）需要直接替换原数组，vue 会自动去除未变化项，并更改变化项。

可以使用以下方法便捷筛选/排序：
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

同时使用 reverse() 和 sort() 的时候，这两个方法将变更原始数组，需要创建原数组的副本：
```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```

-----
## 事件处理和数据绑定
### 事件处理
使用 `v-on:click="handler"` 或者简写 `@click="handler"`来绑定事件。
```vue
<!-- 内联 -->
<button @click="count++">Add 1</button>
<!-- 传参 -->
<button @click="greet">Greet</button>
<!-- 内联传参 -->
<button @click="say('hello')">Say hello</button>
```

内联状态下，也可以使用特殊 `$event` 来便携访问事件参数：
```vue
<button @click="warn('Form cannot be submitted yet.', $event)">Submit</button>
<!-- 或者使用箭头函数 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">Submit</button>
```

同时也提供了方便的事件修饰符来简化书写（好tm多啊直接贴官方例子了）：
- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`
```vue
<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
<!-- 例如：事件处理器不来自子元素 -->
<div @click.self="doThat">...</div>

<!-- 添加事件监听器时，使用 `capture` 捕获模式 -->
<!-- 例如：指向内部元素的事件，在被内部元素处理前，先被外部处理 -->
<div @click.capture="doThis">...</div>

<!-- 点击事件最多被触发一次 -->
<a @click.once="doThis"></a>

<!-- 滚动事件的默认行为 (scrolling) 将立即发生而非等待 `onScroll` 完成 -->
<!-- 以防其中包含 `event.preventDefault()` -->
<div @scroll.passive="onScroll">...</div>
```

还有按键修饰符，方便只捕获特定按键：
```vue
<!-- 仅在 `key` 为 `Enter` 时调用 `submit` -->
<input @keyup.enter="submit" />

<!-- 或者直接使用 KeyboardEvent.key 暴露的按键名称作为修饰符  -->
<input @keyup.page-down="onPageDown" />

<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>

<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```

常见按键别名：
- `.enter`
- `.tab`
- `.delete` (捕获“Delete”和“Backspace”两个按键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

系统按键修饰符：
- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

鼠标按键修饰符：
- `.left` 主
- `.right` 次
- `.middle` 中

### 表单数据绑定
使用 `v-model` 方便绑定数据到输入框，就不用手动绑定值和更改事件了。

```vue
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```

1. 其中如果有 IME，输入字母模式会帮助你不同步值。如果需要同步值则需要自行绑定 `value`。
2. textarea 只支持绑定 `v-model`。
3. 一个值绑定到多个多选框，可以实现数组元素增减

checkbox 有特殊绑定值：
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

`true-value` 和 `false-value` attributes 不会影响 value attribute，因为浏览器在表单提交时，并不会包含未选择的复选框。为了保证这两个值 (例如：“yes”和“no”) 的其中之一被表单提交，请使用单选按钮（radio）作为替代。

### 修饰符 `.lazy`
默认情况下，`v-model` 会在每次 input 后更新。如果想要在 change 后再更新，可以使用 `.lazy`：
```vue
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
```

### 修饰符 `.number`
可以自动转换为数字，但是如果值无法被 `parseFloat()` 处理，则返回原始值。当输入为空时则会返回空字符串。当 input 拥有 `type=number` 时会自动启用。

### 修饰符 `.trim`
删除用户输入首尾的空格。

-----
## 侦听器
除了有 `computed()` 外，还有一个 `watch()` 可以监听 `ref()` 的变化，只是 `watch()` 内部可以进行副作用操作：
```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
const loading = ref(false)

// 可以直接侦听一个 ref
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
其中 `watch()` 接受三个传参，第一个为被监听的 `ref()`（也可以是多个 `ref()` 组合计算后的结果），第二个为处理函数，第三个为可选行为：

### 可选行为 `deep`
`watch()` 默认监听一个响应式对象，会自动创建隐式的深度监听。相比之下，一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调。此时如果仍然需要升读监听需要声明 `deep: true`。

这里 `deep` 在 3.5+ 版本中，支持传入数字来指定最深监听深度。
```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
)
```

### 可选行为 `immediate`
默认情况下，监听器只有监听数据改变时才会触发，创建时并非会触发。如果需要创建时触发一次，可声明 `immediate: true`。

### 可选行为 `once`
在 3.4+ 版本中，可以声明 `once: true` 来只执行一次。

### `watchEffect`
与 `watch()` 类似，但是无需声明监听变量（会自动检测使用了的响应变量），同时首次创建会执行一次。
```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

### 清理回调
在重新触发前执行清理动作。

3.5+ 版本中，可以直接调用 `onWatcherCleanup()`：
```js
import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // 回调逻辑
  })

  onWatcherCleanup(() => {
    // 终止过期请求
    controller.abort()
  })
})
```

或者使用返回的清理函数：
```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // 清理逻辑
  })
})

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // 清理逻辑
  })
})
```

### 侦测器触发时机
默认情况下，侦听器回调会在父组件更新 (如有) 之后、所属组件的 DOM 更新之前被调用。这意味着如果你尝试在侦听器回调中访问所属组件的 DOM，那么 DOM 将处于更新前的状态。

### 可选项 `flush`
在以上行为的基础上，如果你想获取更新后的所属组件实例，应该声明 `flush: post`。

同时如果你想在 Vue 进行任何更新之前触发（在响应变量变化之后立马进行阻塞执行），应该声明 `flush: sync`，或者使用 `watchSyncEffect()`。

### 卸载侦测器
一般来说，侦测器会绑定在所属组件上，组件卸载侦测器也会一起卸载。

但是如果你在异步情况下创建侦测器，则你需要手动卸载：
```js
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```

尽量不要异步创建侦测器，除非你知道你自己在做什么。

-----
## 获取节点实例
使用特殊 attribute `type`：
```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// 第一个参数必须与模板中的 ref 值匹配
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

同样也可以获取一个 template 的实例。

如果挂载了一个有 `v-for` 的节点上，会返回一个包括所有枚举子实例的数组。

`type` 也可以传入函数，会在该组件每次更新的时候传自身实例给该函数：
```vue
<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">
```
这里的 `ref` 是动态绑定，并且该组件卸载的时候，会再触发一次并且值为 `null`。

-----
## 组件的使用
### 组件构建和引用
使用 `*.vue` 文件创建 SFC 组件。import 并且使用它。

### 动态组件
可以通过把导入的组件传给 `is` 实现动态加载组件：
```vue
<script setup>
import Home from './Home.vue'
import Posts from './Posts.vue'
import Archive from './Archive.vue'
import { ref } from 'vue'
 
const currentTab = ref('Home')

const tabs = { // 一个又导入组件组成的数组
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

这里的 `is` 既可以传入组件的名称，也可以是组件这个实例。

### 生命周期
有 `onMounted()` `onUpdated()` `onUnomunted` 等可以用。
```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```

### Props
首先需要组件声明接收 Props：
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

  // 或者另外一种声明方法

  const props = definProps<Props>()

  console.log(props.title)
</script>
```

Props 默认响应式：
```js
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // 在 3.5 之前只运行一次
  // 在 3.5+ 中在 "foo" prop 变化时重新执行
  console.log(foo)
})
```

同样，解包、赋初始值都是支持的：
```js
const { foo = 'hello' } = defineProps<{ foo?: string }>()
```
但是解包后，这里的 `foo` 相当于 `props.foo` 是一个固定值，而不是响应式变量。此时需要包装在一个 getter 中：
```js
watch(() => foo, /* ... */)
```

如果需要传递给外部组件，需要继续构建：
```js
useComposable(() => foo)
```

1. Props 变量推荐用驼峰写法，template 中传入建议使用 `-` 连接
2. template 传入 props 可以 `v-bind:` 直接传入一整个 object
3. Props 默认单向传递，但是因为深度监听的原因，更改 Object 中的值也会触发更新

Props 除了可以使用 typescript 在编译时校验，也可以在运行时校验：
```js
defineProps({
  // 基础类型检查
  // (给出 `null` 和 `undefined` 值则会跳过任何类型检查)
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // 必传但可为 null 的字符串
  propD: {
    type: [String, null],
    required: true
  },
  // Number 类型的默认值
  propE: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propF: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  // 在 3.4+ 中完整的 props 作为第二个参数传入
  propG: {
    validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propH: {
    type: Function,
    // 不像对象或数组的默认，这不是一个
    // 工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
})
```

在这其中：
1. 所有 Props 默认可选，除非声明 required
2. Boolean 类型值在未传递值时默认为  `false`，其他类型为 `undefined`
3. default 值的行为是：无论是因为未传值还是传入 `undefined`，最终都会返回默认值
4. 类型检查可以传入 class object，运行时会使用 `typeof Class` 来检查类型

### 事件
可以在父组件中定义一个事件绑定，然后在下面子组件中方便调用（这里同样注意写法自动转换）：

```vue
<script setup lang="ts">
  function callback(props, config) { // 这里 $emit 传多少个参，这里就会接收到多少个参
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

没有冒泡机制。

可以显式声明：
```vue
<script setup>
  defineEmits(['inFocus', 'submit']) // 必须放在 setup 顶级作用域下

  function buttonClick() {
    emit('submit') // 可以在 setup 中使用，也可以在 template 中使用
  }
</script>
```

如何声明类型：
```vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])

// 基于选项
const emit = defineEmits({
  change: (id: number) => {
    // 返回 `true` 或 `false`
    // 表明验证通过或失败
  },
  update: (value: string) => {
    // 返回 `true` 或 `false`
    // 表明验证通过或失败
  }
})

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: 可选的、更简洁的语法
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

同样支持事件校验：
```vue
<script setup>
const emit = defineEmits({
  // 没有校验
  click: null,

  // 校验 submit 事件
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

### 组件的 `v-model`
可以实现数据的双向绑定，建议使用 `defineModel()`：

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

然后使用这个组件可以这样：
```vue
<Child v-model="countModel" />
```

此时引用者和组件都会双向绑定 `countModel` 这个 ref。

可以接受参数，也可以创建多个 `v-model` 来接收多个参数：

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

`v-model` 同样支持修饰符，和修饰符在子组件中的解包：

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

### 组件的 attribute 透传
指的是如果一个 template 只有一个单节点，以下类型：`class` `style` `id` `v-on` 会自动透传给这个节点（如果有合并就会进行合并）。

如果这个组件的单节点是另外一个组件，会继续往下透传（但是不包括 emit 和 `v-on`，因为被上一层节点消费了）。

这个行为可以声明禁用：
```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>
```

搭配这个和 `v-bind="$attrs"`，可以将上部分的 attribute 不透传到根节点，而是根节点下的某一个节点

```vue
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
```

对于一个有多根节点的组件，透传不会启用，除非使用 `v-bind="$attr"` 进行声明。或者在 js 中获取透传值：
```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

### 插槽
`<slot />` 是一个特殊的组件，会被组件下面的 child 替换。

插槽可以设定默认内容：
```vue
<button type="submit">
  <slot>
    Submit <!-- 默认内容 -->
  </slot>
</button>
```

可以定义多个插槽，并且赋予名称，在引用时使用 `v-slot` 指定插槽（没有名称的 slot 默认名称为 default）：

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
    <!-- header 插槽的内容放这里 -->
  </template>
  <template #footer>
    <!-- footer 插槽的内容放这里（简写） -->
  </template>
</BaseLayout>
```

可以使用条件插槽进行选择性插槽渲染：
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

插槽可以获取引用方的数据，而不能获取引用组件内的数据。但是组件中的数据可以使用 Props 传递：
```vue
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

```vue
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

在具名插槽里也可以用：
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

### 依赖注入
使用 Provide/Inject 来直接传递值，而不需要层层向下传递到深层（有点类似于 context）：

```vue
<script setup>
import { provide } from 'vue'

provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
provide('read-only-count', readonly(count)) // 只读
</script>
```

```vue
<script setup>
import { inject } from 'vue'

const value = inject('message', '这是默认值')

// 或者初始化一个类来作为默认值
const value = inject('key', () => new ExpensiveClass(), true) // 第三个传参表示为工厂函数
</script>
```

大型项目中，推荐不使用 string 作为 key，而是独立文件中的 `Symbol`：

`keys.ts`
```ts
import type { InjectionKey } from 'vue'

export const myInjectionKey = Symbol() as InjectionKey<string>
```

```ts
// 在供给方组件中
import { provide } from 'vue'
import { myInjectionKey } from './keys'

provide(myInjectionKey, { 
  /* 要提供的数据，类型为 string */
})
```

```ts
// 注入方组件
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

### 异步组件
从远程按需异步加载组件：
```vue
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```

-----
## 逻辑复用
### 组合式函数
可以进行逻辑的复用：

`mouse.js`
```js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const x = ref(0)
  const y = ref(0)

  // 组合式函数可以随时更改其状态。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 通过返回值暴露所管理的状态
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

一些 [编写约定](https://cn.vuejs.org/guide/reusability/composables.html#conventions-and-best-practices) 就不放上来了。

### 自定义指令
当函数名由 v 开头时，可以作为自定义指令。只有当所需功能只能通过直接的 DOM 操作来实现时，才应该使用自定义指令。

```vue
<script setup>
// 在模板中启用 v-highlight
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

支持以下钩子：
```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {}
}
```
- el：指令绑定到的元素。这可以用于直接操作 DOM。
- binding：一个对象，包含以下属性：
  - value：传递给指令的值。例如在 v-my-directive="1 + 1" 中，值是 2。
  - oldValue：之前的值，仅在 beforeUpdate 和 updated 中可用。无论值是否更改，它都可用。
  - arg：传递给指令的参数 (如果有的话)。例如在 v-my-directive:foo 中，参数是 "foo"。
  - modifiers：一个包含修饰符的对象 (如果有的话)。例如在 v-my-directive.foo.bar 中，修饰符对象是 { foo: true, bar: true }。
  - instance：使用该指令的组件实例。
  - dir：指令的定义对象。
- vnode：代表绑定元素的底层 VNode。
- prevVnode：代表之前的渲染中指令所绑定元素的 VNode。仅在 beforeUpdate 和 updated 钩子中可用。

### 插件
不想写了，自己看 [官方文档](https://cn.vuejs.org/guide/reusability/plugins.html) 吧。

-----
## 内置组件
篇幅拉太长了，只对内置的一些工具组件进行一些简单的介绍和给出一个例子。

### `<Transition>`
可以被 `v-if`、`v-show`、动态渲染组件切换、改变特殊 key 属性等触发：
```vue
<button @click="show = !show">Toggle</button>
<Transition name="slide">
  <p v-if="show">hello</p>
</Transition>

<style>
  /* 如果没有命名，这里的 fade 使用 v */
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

也有事件钩子，和 animation 混用：
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
对一个 list 进行动画。
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
组件将声明被卸载时，不卸载而是缓存状态。

可以根据组件的 name 来指定缓存节点：
```vue
<!-- 以英文逗号分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式 (需使用 `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组 (需使用 `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>

<!-- 或者最大缓存数 -->
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

### `<Teleport>`
将子节点移动到其他 DOM 节点处。只会改变 DOM 上的渲染顺序，而不会改变逻辑上的父子关系。

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

这里的 `to` 的值可以是一个 CSS 选择器字符串，也可以是一个 DOM 元素对象。

同时也可以使用 `defer` ，让其子节点全部渲染完成后再应用，适用于想要移动到自身子节点中。