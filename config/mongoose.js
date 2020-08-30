const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log(`Database connected on ${connection.connection.host}  `);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectToDb;
