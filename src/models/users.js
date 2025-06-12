const fs = require('fs').promises; // <-- Ganti ke fs.promises
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // <-- Install uuid: npm install uuid

const filePath = path.join(__dirname, '../data/users.json');

async function readUsers() { // <-- Jadikan async
    try {
        // Gunakan await fs.promises.readFile
        const data = await fs.readFile(filePath, { encoding: 'utf-8' });
        // Trim dan cek data kosong
        const trimmedData = data.trim();
        if (!trimmedData) return [];
        return JSON.parse(trimmedData);
    } catch (err) {
        // Cek jika file tidak ditemukan
        if (err.code === 'ENOENT') {
            return [];
        }
        console.error('❌ Error saat baca users.json:', err.message);
        return [];
    }
}

async function writeUsers(users) { // <-- Jadikan async
    // Gunakan await fs.promises.writeFile
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), { encoding: 'utf-8' });
}

module.exports = {
    async getAll() { // <-- Jadikan async
        return await readUsers();
    },

    async add(userData) { // <-- Jadikan async
        const users = await readUsers(); // <-- Pakai await
        // Gunakan UUID untuk ID yang unik
        const newUser = { id: uuidv4(), ...userData }; // <-- Penting: id unik
        users.push(newUser);
        await writeUsers(users); // <-- Pakai await
        return newUser;
    },

    async findByUsername(username) { // <-- Jadikan async
        const users = await readUsers(); // <-- Pakai await
        return users.find((u) => u.username === username);
    },

    async findById(id) { // <-- Jadikan async
        const users = await readUsers(); // <-- Pakai await
        // Pastikan ID yang dicari sesuai dengan tipe data (misal: int atau string UUID)
        return users.find((u) => u.id === id); 
    },

    async validatePassword(username, inputPassword) { // <-- Sudah async, bagus
        const user = await this.findByUsername(username); // <-- Pakai await
        if (!user) return false;
        try {
            const match = await bcrypt.compare(inputPassword, user.password);
            return match;
        } catch (err) {
            console.error('❌ Gagal validasi password:', err.message);
            return false;
        }
    }
};