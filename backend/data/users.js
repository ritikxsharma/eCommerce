const bcrypt = require('bcryptjs')
const users = [
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'User1',
        email: 'user1@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false
    },
    {
        name: 'User2',
        email: 'user2@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false
    }
]

module.exports = users