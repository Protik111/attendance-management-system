require("dotenv").config();
const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const port = process.env.PORT || 7000;

const dbConnect = () => {};

const main = async () => {
  try {
    dbConnect();
    server.listen(port, async () => {
      console.log(`Server is listening to port ${port}`);
    });
  } catch (error) {
    console.log("Database Error");
    console.log(error);
  }
};

main();
