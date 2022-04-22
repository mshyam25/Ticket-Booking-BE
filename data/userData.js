import bcrypt from 'bcryptjs'

export const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    isVerified: true,
    securityQuestion: 'Who is favourite cricketer ?',
    securityQuestionAnswer: 'Tewatia',
  },
  {
    name: 'Shyam',
    email: 'shyam@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isVerified: true,
    securityQuestion: 'Who is favourite cricketer ?',
    securityQuestionAnswer: 'Pollard',
  },
  {
    name: 'Kalli',
    email: 'kalli@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isVerified: false,
    securityQuestion: 'Who is favourite cricketer ?',
    securityQuestionAnswer: 'Dhoni',
  },
]
