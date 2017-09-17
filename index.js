/**
 * Created by sergey on 21.07.17.
 */
const Koa        = require('koa');
const body       = require('koa-json-body');
const logger     = require('koa-logger');
const cors       = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const passport   = require('koa-passport');
const Router     = require('./routes/index');
const port       = process.env.PORT || 4000;

const jwtsecret = "mysecretkey"; // ключ для подписи JWT
const socketioJwt = require('socketio-jwt'); // аутентификация  по JWT для socket.io
const socketIO = require('socket.io');

const app = new Koa();

// const options = {
//   origin: '*'
// };

// Cors
app.use(cors());
// Logger
app.use(logger());
// Parser
app.use(body({limit: '10mb', fallback: true}));

app.use(bodyParser());

// Routes
app
  .use(passport.initialize())
  .use(Router.routes())
  .use(Router.allowedMethods());

const server = app.listen(port, () => {
  console.log(`Listen port: ${port} !`);
});

let io = socketIO(server);

io.on('connection', socketioJwt.authorize({
  secret: jwtsecret,
  timeout: 15000
})).on('authenticated', function (socket) {

  console.log('Это мое имя из токена: ' + socket.decoded_token.displayName);

  socket.on("clientEvent", (data) => {
    console.log(data);
  })
});
