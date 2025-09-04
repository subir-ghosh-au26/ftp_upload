// backend/models/User.js
const bcrypt = require('bcryptjs');

const users = [];

const addUser = async (id, username, password, name, role) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { id, username, password: hashedPassword, name, role };
    users.push(newUser);
    console.log(`User "${username}" (${role}) created.`);
};

// Immediately add a default admin and a default user
(async () => {
    await addUser(1, 'admin', 'adminpass', 'Super Admin', 'admin');
    await addUser(2, 'testuser', 'testpass', 'Test User', 'user');
})();

module.exports = users;