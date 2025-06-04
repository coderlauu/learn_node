import { z } from 'zod'

// 基本类型模式
const StringSchema = z.string()
const NumberSchema = z.number()
const BooleanSchema = z.boolean()
const DateSchema = z.date()
const CoercedDateSchema = z.coerce.date() // 尝试将输入（如字符串）转为 Date 对象

// 示例验证
try {
    StringSchema.parse('hello') // 成功
    NumberSchema.parse('123') // 成功

    BooleanSchema.parse(true) // 成功
    DateSchema.parse('2024-01-01') // 成功
    CoercedDateSchema.parse('2024-01-01') // 成功

    StringSchema.parse(123) // 失败
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error('Validation failed:', error.errors);
    }
}

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

