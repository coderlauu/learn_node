import { z } from 'zod'

// 基本类型模式
const StringSchema = z.string()
const NumberSchema = z.number()
const BooleanSchema = z.boolean()
const DateSchema = z.date()
const CoercedDateSchema = z.coerce.date() // 尝试将输入（如字符串）转为 Date 对象

// 示例验证
// try {
//     StringSchema.parse('hello') // 成功
//     NumberSchema.parse('123') // 成功

//     BooleanSchema.parse(true) // 成功
//     DateSchema.parse('2024-01-01') // 成功
//     CoercedDateSchema.parse('2024-01-01') // 成功

//     StringSchema.parse(123) // 失败
// } catch (error) {
//     if (error instanceof z.ZodError) {
//         console.error('Validation failed:', error.errors);
//     }


// 类型组合与验证
// 对象（z.object）
const UserSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    age: z.number().min(18, 'Must be at least 18').int().positive().optional(), // 可选整数
    email: z.string().email('Invalid email address'),
    isAdmin: z.boolean().default(false)
})

// 数组（z.array）
const TagArraySchema = z.array(z.string().max(10)).nonempty('Tags cannot be empty')

// 聯合類型（z.union或.or）
const StringOrNumberSchema = z.union([z.string(), z.number()])
const StringOrNumberSchema2 = z.string().or(z.number())

// 交叉類型(z.intersection 或 .and)
const IDSchema = z.object({ id: z.string().uuid() })
const TimestampSchema = z.object({ createAt: z.date(), updatedAt: z.date() })
const EntitySchema = z.intersection(IDSchema, TimestampSchema)
// const EntitySchema = IDSchema.and(TimestampSchema)
// .optional() 表示该字段是可选的
// .nullable() 表示该字段可以是 null
// .nullish() 表示该字段可以是 null 或 undefined
// .default(value) 表示该字段默认值为 value
// .describe(description) 表示该字段的描述
// .refine(condition, message) 表示该字段的验证条件和错误信息
// .transform(fn) 表示该字段的转换函数
// .parse(value) 表示该字段的解析函数
// .parseAsync(value) 表示该字段的异步解析函数
// .parseAsync(value) 表示该字段的异步解析函数

// 枚舉（z.enum）
const RoleSchema = z.enum(['admin', 'user', 'guest'])

// 字面量（z.literal）
const SuccessStautsSchema = z.literal('success')

// 推斷類型（z.infer）：從Zod schema 生成Typescript 類型
type User = z.infer<typeof UserSchema>

const validUser: User = UserSchema.parse({ username: '123', age: 18, email: '123@123.com', isAdmin: true })
console.log('validUser', validUser);

// 异步验证
// const asyncUser = await UserSchema.parseAsync({ username: null, email: '123@123.com', isAdmin: true })
// console.log('asyncUser', asyncUser); // 報錯ZodError

// 異常處理：parse()方法與錯誤捕獲
// - schema.parse(data)：如果驗證失敗，會拋出z.ZodError
// - schema.safeParse(data)：不會拋出錯誤，而是返回一個包含success（boolean）和data（成功時）或 error（失敗時，ZodError對象）的結果對象
const dataFromApi: unknown = { username: 'usr', email: 'invaild-email' }

// const result = UserSchema.safeParse(dataFromApi)
// if (!result.success) {
//     console.error('Validation failed:', result.error.errors);
//     console.error('Validation format:', result.error.format());
    
//     // result.error.format() 提供了結構化的錯誤信息
//     for (const fieldError in result.error.format()) {
//         // @ts-ignore
//         if (result.error.format()[fieldError]?._errors) {
//             // @ts-ignore
//             console.error(`Field "${fieldError}" validation failed: ${result.error.format()[fieldError]?._errors}`);
//         }
//     }
// } else {
//     const typeUser: User = result.data
//     console.log('typeUser', typeUser);
// }

// 自定義驗證器 z.string().refine()
// refine 方法允許你添加自定義的同步或異步驗證邏輯
const PasswordSchema = z.string().min(8, 'Password must be at least 8 characters').refine((val) => {
    return val.includes('@')
}, {
    message: 'Password must contain @',
    path: ['passwordStrength'] // 可選，指定錯誤路徑
}).refine((val) => {
    return /\d/.test(val)
}, {
    message: 'Password must contain number'
})

try {
    PasswordSchema.parse('12345678')
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error('Validation failed:', error.flatten().fieldErrors);
        // output=> { passwordStrength: [ 'Password must contain @' ] }
    }
}

/**
 * Zod 與 Typescript配合使用的優勢
 * 1、單一數據源：Schema定義即用于運行時驗證，也用於生成靜態Typescript類型（z.infer），確保兩者同步
 * 2、類型安全：驗證通過後的數據是完全類型安全的
 * 3、聲明式API：易於閱讀和編寫複雜的驗證規則
 */