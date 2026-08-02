import dotenv from 'dotenv'
dotenv.config()
export interface User {
  username: string
  password: string
}

export const adminUser = {
  username: process.env.ADMIN_USERNAME!,
  password: process.env.ADMIN_PASSWORD!,
}
