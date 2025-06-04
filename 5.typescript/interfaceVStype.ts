/**
 * type和interface的区别与使用场景
 * 
 * 1. 相同点：
 * 都可以描述对象或函数
 * 
 * 2. 不同点：
 * - 主要用途：
 *  - type可以声明基本类型别名，联合类型，元组等复杂类型；  更通用
 *  - interface描述对象、类的契约protocal
 * - 声明合并：
 *  - interface可以多次声明同名接口，自动合并 (同名属性也会合并，但其类型必须一致)
 *  - type不支持。同名类型会导致编译错误
 * - 继承/扩展：
 *  - interface使用extends关键字继承其他接口（可多重继承）
 *  - type可以通过交叉类型（&）实现类似对象类型的扩展
 * - 实现（类）接口：
 *  - interface 类使用implements关键字实现接口
 *  - type 不能直接实现，但可以实现其引用的接口和类型
 * - 右侧类型：
 *  - interface 必须是一个对象结构（或可转换为对象结构）
 *  - type可以是任何合法的TS类型
 * - 计算属性名：
 *  - 不直接支持（但可以通过索引签名模拟）
 *  - 支持在类型定义中使用计算属性名
 * - 元祖/函数类型直接定义：
 *  - 不直接顶医院组或具体函数签名（但可以定义函数类型的属性或可调用接口）
 *  - 可以直接定义元祖类型和具体的函数签名类型
 * 
 * 3. 使用场景建议：
 * - 优先使用interface定义公共API的契约，例如对象的形状、类的结构，因为接口的声明合并和继承特性使其更具扩展性，尤其是在库开发中
 * - 当需要定义联合类型、交叉类型、元祖类型、原始类型的别名，或更复杂的非对象结构（如具体的函数签名类型）时，使用type
 * - 当你想利用类型别名的灵活性来为任何类型起一个更易读的名称时，使用type
 * - 如果需要声明合并（如在第三方库的接口添加额外属性），必须使用interface
 * 
 */

// interface Person {
//     age: number;
//     name: string;
// }

// interface Person {
//     age: string; // 编译报错：类型不一致，会报错
//     name: string
// }

// type Person = {
//     age: number;
//     name: string;
// }

// // 报错：同名类型会导致编译错误
// type Person = {
//     age: number
// }

/**
 * 泛型
 */
// 泛型约束与默认类型
// - 泛型约束（extends）：限制类型参数T必须符合某种结构
interface Lengthwise {
    length: number
}
function logLength<T extends Lengthwise>(arg: T): void {
    console.log(arg.length);
}
logLength('hello') // 输出：5
logLength([1, 2]) // 输出：2
// logLength(123) // Error: number 没有 length属性

// - 约束内容也可以是另一个类型参数：
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]
}
let obj = { a: 1, b: 2, c: 3 }
getProperty(obj, 'a') // 输出：1
// getProperty(obj, 'd') // Error: 'd' 不是 'obj' 的属性

// - 默认类型：可以为泛型参数指定一个默认类型，当调用时未提供类型参数且无法推断时，将使用默认类型
interface Container<T = string> {
    value: T
}
let stringContainer: Container = { value: 'hello' }
let numberContainer: Container<number> = { value: 123 }

/** 泛型与联合类型的结合 */
// 泛型可以与联合类型灵活结合，用于创建更复杂的类型结构
function processData<T extends string | number>(data: T): T extends string ? string : number {
    if (typeof data === 'string') {
        return data.toUpperCase() as any // 使用as any 是因为TS此时无法确定返回类型完全匹配
    } else {
        return data * 2 as any
    }
}
const processedString = processData('test') // 推断为string
const processedNumber = processData(123) // 推断为number

type StringOrNumberArray<T extends string | number> = T[]
let stringArray: StringOrNumberArray<string> = ['a', 'b']
let numberArray: StringOrNumberArray<number> = [1, 2]
let mixedArr: StringOrNumberArray<string | number> = [1, 'a'] // OK

/** 多类型参数的泛型函数 */
// 泛型函数或类可以有多个类型参数
function mapPair<K, V, R>(pair: { key: K; value: V }, mapper: (key: K, value: V) => R): R {
    return mapper(pair.key, pair.value)
}
const myPair = { key: 'id', value: 123 }
const mappedResult = mapPair(myPair, (k, v) => `${k}: ${v * 2}`) // string

/** 高级泛型应用： infer，keyof，extends与conditional types */
// 这些是类型体操的核心构建块，keyof和extends（约束）前面已经提及。infer和条件类型是实现复杂类型转换的关键
// - infer：在条件类型的extends子句中，infer关键字可以声明一个类型变量，用于捕获被匹配到的类型的一部分
type UnpackPromise<T> = T extends Promise<infer U> ? U : T
type ResultType1 = UnpackPromise<Promise<string>> // string
type ResultType2 = UnpackPromise<number> // number
// - 这里的infer U 捕获了Promise解析后的类型，将其类型赋到U变量中，此时U的类型就是Promise<string>的类型

/** 类型体操：指在TS的类型系统层面进行编程，以创建新的、复杂的类型或转换现有类型 */

/** 条件类型（T extends U ? X : Y）：根据一个类型 T 是否可赋值给类型 U，类选择类型 X 或 Y */
type IsNumber<T> = T extends number ? 'Yes' : 'No'
type Check1 = IsNumber<123> // 'Yes'
type Check2 = IsNumber<string> // 'No'

// 结合 never 过滤联合类型中的成员
type FilterNumbers<T> = T extends number ? T: never
type MixedTypes = string | number | boolean | number[]
type OnlyNumbers = FilterNumbers<MixedTypes> // number
// 工作原理：(string extends number ? string : never) | (number extends number ? number : never) ...
// -> never | number | never | never -> number

/** 映射类型（[K in keyof T]: T[K]）：基于现有对象类型的键来创建新的对象类型，可以转换属性名或属性类型 */
interface Original {
    name: string;
    age: number
}

// 将所有属性变为可选
type PartialVersion<T> = {
    [P in keyof T]?: T[P]
}
type PartialOriginal = PartialVersion<Original>

// 将所有属性值类型变为 boolean
type BooleanFlags<T> = {
    [P in keyof T]: boolean
}
type OriginalFlags = BooleanFlags<Original>

// 将所有属性变为可写
type Mutable<T> = { -readonly [P in keyof T]: T[P] }
type MutableOriginal = Mutable<Original>

// 将所有属性变为具体类型
type Concrete<T> = { [P in keyof T]-?: T[P] }
type ConcreteOriginal = Concrete<Original>

/** 索引类型与查找类型：T[K] */
// keyof T：获取类型T所有公共属性名组成的联合类型
// T[K]：获取对象类型T中属性K（K必须是keyof T 的子类型）的类型
interface User {
    id: number; 
    name: string; 
    address: {
        street: string;
        city: string
    }
}

type UserPropertyType<K extends keyof User> = User[K]
let propType: UserPropertyType<'id'>

/** 提取类型与排除类型：Extract<T, U> Exclude<T, U> */
// - Extract<T, U>：从联合类型 T 中提取出所有可以赋值给 U 的成员
type AllTypes = string | number | boolean | Date
type StringOrNumber = Extract<AllTypes, string | number> // string | number

// - Exclude<T, U>：从联合类型 T 中排除所有可以赋值给 U 的成员
type PrimitivesAndDate = string | number | boolean | Date
type OnlyPrimitives = Exclude<PrimitivesAndDate, Date | Function>

// 其他还有常用的 NonNullable<T>（排除null和undefined）
// Parameters<T>（获取函数参数类型元祖）
// ReturnType<T>（获取函数返回类型）
// InstanceType<T>（获取构造函数实例类型）

