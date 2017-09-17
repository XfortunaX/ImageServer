const Router         = require('koa-router');
const router         = new Router();

const requireTree    = require('require-tree');
const controllers    = requireTree('../app/controllers');
const User           = require('../app/models/user');
const Img            = require('../app/models/image');

const passport       = require('koa-passport'); //реализация passport для Koa
const LocalStrategy  = require('passport-local'); //локальная стратегия авторизации
const JwtStrategy    = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt     = require('passport-jwt').ExtractJwt; // авторизация через JWT

const jwtsecret      = "mysecretkey"; // ключ для подписи JWT
const jwt            = require('jsonwebtoken'); // аутентификация  по JWT для hhtp

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  function (email, password, done) {
    User.findOne({email}, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
      }
      return done(null, user);
    });
  }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
    User.findById(payload.id, (err, user) => {
      if (err) {
        return done(err)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  })
);

router.post('/user', async(ctx, next) => {
  try {
    ctx.body = await User.create(ctx.request.body);
  }
  catch (err) {
    ctx.status = 400;
    ctx.body = err;
  }
});

router.post('/login', async(ctx, next) => {
  await passport.authenticate('local', function (err, user) {
    if (user == false) {
      ctx.body = "Login failed";
    } else {
      //--payload - информация которую мы храним в токене и можем из него получать
      const payload = {
        id: user.id,
        displayName: user.displayName,
        email: user.email
      };
      const token = jwt.sign(payload, jwtsecret); //здесь создается JWT

      ctx.body = {
        user: user.displayName,
        email: user.email,
        token: 'JWT ' + token
      };
    }
  })(ctx, next);
});

router.get('/custom', async(ctx, next) => {
  await passport.authenticate('jwt', function (err, user) {
    if (user) {
      ctx.body = {
        user: user.displayName,
        email: user.email
      };
    } else {
      ctx.body = "No such user";
    }
  } )(ctx, next)
});

router.get('/test',  function (ctx, next) {
  // console.log(ctx.request);
  console.log(ctx.request.query);
  let qu = ctx.request.query;
  // console.log(this.params);
  User.find({}).select({ displayName: 1, email: 1 }).exec( function(err, users) {
    if (err) throw err;

    // object of all the users
    console.log(users)});
  // User.find({}, function(err, users) {
  //   if (err) throw err;
  //
  //   // object of all the users
  //   console.log(users);
  // });
  // console.log(query);
  ctx.body = 'test';
});

router.post('/test',  function (ctx, next) {
  // console.log(ctx.request);
  console.log(ctx.request.body);
  ctx.body = 'test';
});

router.post('/image',  async(ctx, next) => {
  try {
    // console.log(ctx.request.body);
    ctx.body = await Img.create(ctx.request.body);
  }
  catch (err) {
    // console.log(err);
    ctx.status = 400;
    ctx.body = err;
  }
});

router.get('/image',  async (ctx, next) => {

  let randomIm;

  await Img.findOne().skip(Math.floor(Math.random() * 10)).exec(
    function (err, result) {
      // Tada! random user
      randomIm = result;
      console.log('efr');
    });

  // Img.count().exec(function (err, count) {
  //
  //   // Get a random entry
  //   let random = Math.floor(Math.random() * count);
  //
  //   // Again query all users but only fetch one offset by our random #
  //   Img.findOne().skip(random).exec(
  //     function (err, result) {
  //       // Tada! random user
  //       randomIm = result;
  //       console.log('efr');
  //     })
  // });
  console.log(randomIm);
  ctx.body = randomIm;
});

module.exports = router;
