import { db } from "../index.js"
import { NewTodo, todos } from "../schema.js"
import { eq } from "drizzle-orm"

export async function createTodo(todo: NewTodo) {
  const [rows] = await db.insert(todos).values(todo).returning()
  return rows
}

export async function getTodos() {
  return db.select().from(todos)
}

export async function getTodo(id: string) {
  const rows = await db.select().from(todos).where(eq(todos.id, id))
  if (rows.length === 0) {
    return
  }
  return rows[0]
}

export async function deleteTodo(id: string) {
  const rows = await db.delete(todos).where(eq(todos.id, id)).returning()
  return rows.length > 0
}

export async function updateTodo({
  id,
  title,
  description,
}: {
  id: string
  title: string
  description?: string
}) {
  const [result] = await db
    .update(todos)
    .set({
      title,
      description,
    })
    .where(eq(todos.id, id))
    .returning()

  return result
}
