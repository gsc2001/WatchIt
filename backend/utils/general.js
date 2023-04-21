const generateRandomCode = len => {
    const chars = '0123456789';
    let randomCode = '';
    for (let i = 0; i < len; i++)
        randomCode += chars[Math.floor(Math.random() * chars.length)];
    return randomCode
};

module.exports = {
    generateRandomCode
}
