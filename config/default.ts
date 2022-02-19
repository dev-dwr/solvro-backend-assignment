export default {
  port: 4000,
  dbUri: "mongodb://localhost:27017/mongodb",
  logLevel: "info",
  smtp: {//I should not put credentials in public file, but i'm using fake email server and fake credentials. Generally I would put these inside .env file
    user: "xrynelkxp7raewvg@ethereal.email", 
    pass: "QSXe1fFNU7qZHwR4Xc",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
  },
};
