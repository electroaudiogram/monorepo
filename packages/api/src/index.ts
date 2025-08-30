import { User } from '../api-types'

export const helloWorld: string = '@electroaudiogram/api'

export const test = (user?: User): User => {
  if (user) return user
  return {
    id: 0,
    updatedAt: '',
    createdAt: '',
    email: '',
  }
}

console.log(helloWorld)
