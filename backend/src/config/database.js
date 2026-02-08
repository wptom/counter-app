const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB připojeno úspěšně');
  } catch (error) {
    console.error('MongoDB chyba připojení:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
