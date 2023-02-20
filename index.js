const express = require("express");
const app = express();
require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const { connection } = require("./configs/db");
const { authenticate } = require("./middlewares/authenticate.middleware");
const { UserRouter } = require("./routes/User.route");
const { PostRouter } = require("./routes/Post.route");

app.use(cors({origin: "*"}));
app.use(express.json());

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Linked FullStack App Api Documentation',
        version: '1.0.0',
      },
      servers: [
        {
            url: "http://localhost:8080"
        }
      ],
    },
    apis: ['./routes/*.js'], // files containing annotations as above
  };

const openapiSpecification = swaggerJsdoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.get("/", (req, res) => {
    res.send("Home Page");
})

app.use("/users", UserRouter);
app.use(authenticate);
app.use("/posts", PostRouter);

app.listen(process.env.port, async() => {
    try {
        await connection;
        console.log("Connected to the DB");
    } catch(err) {
        console.log("Trouble connecting to the DB");
        console.log(err);
    }
    console.log(`Listening at ${process.env.port}`)
})
