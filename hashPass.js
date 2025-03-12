const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10; 
    return await bcrypt.hash(password, saltRounds);
}

hashPassword("admin123").then(hash => {
    console.log(hash);
});
