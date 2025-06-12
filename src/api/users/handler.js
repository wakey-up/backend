const users = require('../../models/users'); // Pastikan path ini benar
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const Boom = require('@hapi/boom'); // <-- Import Boom untuk error handling yang lebih baik

module.exports = {
  register: async (request, h) => {
    try {
      const { username, password } = request.payload;

      if (!username || !password) {
        // Menggunakan Boom untuk error 400 Bad Request
        throw Boom.badRequest('Username dan password wajib diisi');
      }

      // Pastikan fungsi findByUsername di users.js sudah async dan di-await di sini
      const existingUser = await users.findByUsername(username); 
      if (existingUser) {
        // Menggunakan Boom untuk error 409 Conflict (username sudah ada)
        throw Boom.conflict('Username sudah digunakan');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // Pastikan fungsi add di users.js sudah async dan di-await di sini
      await users.add({ username, password: hashedPassword });

      console.log(`✅ User "${username}" berhasil terdaftar`);
      return h.response({ message: 'Registrasi berhasil' }).code(201);
    } catch (err) {
      // Tangani error Boom atau error lainnya
      if (Boom.isBoom(err)) {
        throw err; // Jika sudah error Boom, lempar langsung
      }
      console.error('❌ Error di register:', err);
      // Fallback untuk error server internal
      throw Boom.internal('Server error saat register');
    }
  },

  login: async (request, h) => {
    try {
      const { username, password } = request.payload;

      if (!username || !password) {
        // Menggunakan Boom untuk error 400 Bad Request
        throw Boom.badRequest('Username dan password wajib diisi');
      }

      // Pastikan fungsi findByUsername di users.js sudah async dan di-await di sini
      const user = await users.findByUsername(username);

      console.log('🔍 Login request:', { username });
      console.log('📦 User ditemukan:', !!user);

      if (!user) {
        // Menggunakan Boom untuk error 401 Unauthorized (karena user tidak ditemukan)
        throw Boom.unauthorized('Username atau password salah'); // Pesan generik untuk keamanan
      }

      const valid = await bcrypt.compare(password, user.password);
      console.log('🔐 Password valid:', valid);

      if (!valid) {
        // Menggunakan Boom untuk error 401 Unauthorized (karena password salah)
        throw Boom.unauthorized('Username atau password salah'); // Pesan generik untuk keamanan
      }

      const token = Jwt.token.generate(
        { id: user.id, username: user.username },
        {
          key: process.env.JWT_SECRET, // Pastikan JWT_SECRET ada di .env dan sudah di-load
          algorithm: 'HS256',
        }
      );

      return h.response({ message: 'Login berhasil', token }).code(200);
    } catch (err) {
      // Tangani error Boom atau error lainnya
      if (Boom.isBoom(err)) {
        throw err; // Jika sudah error Boom, lempar langsung
      }
      console.error('❌ Error di login:', err);
      // Fallback untuk error server internal
      throw Boom.internal('Server error saat login');
    }
  },

  profile: (request, h) => {
    // Pastikan rute ini dilindungi dengan authentication strategy
    // dan JWT token sudah divalidasi.
    const { user } = request.auth.credentials;
    return { message: 'Ini profil lo', user };
  },
};