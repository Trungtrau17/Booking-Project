const express = require("express"); // nhung thu vien
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const cors = require("cors");
require("dotenv").config();
const dataBaseConnect = require("./config/database");
dataBaseConnect.dataConnect();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3001", // Địa chỉ frontend
    credentials: true, // Cho phép gửi cookie
  })
); // Cho phép mọi yêu cầu CORS
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT;
const RouterApiAdmin = require("./API/V1/routes/admin/index");
const RouterApiClient = require("./API/V1/routes/client/index");

// Serve static files
app.use('/TravelBooking', express.static(path.join(__dirname, 'TravelBooking')));

app.set('views', path.join(__dirname, 'TravelBooking/views'));

RouterApiAdmin(app);
RouterApiClient(app);
app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}/api/v1/client`);
});
