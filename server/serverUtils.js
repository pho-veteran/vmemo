// Hash password
import bcryptjs from 'bcryptjs';

const hashPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

const checkPassword = async (password, hashedPassword) => {
    return await bcryptjs.compare(password, hashedPassword);
}

export { 
    hashPassword,
    checkPassword
};