/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const metrics = require('@overleaf/metrics')
metrics.initialize('spelling')
const { URL } = require('url')

const Settings = require('@overleaf/settings')
const logger = require('logger-sharelatex')
logger.initialize('spelling')
metrics.memory.monitor(logger)

const mongodb = require('./app/js/mongodb')
const SpellingAPIController = require('./app/js/SpellingAPIController')
const express = require('express')
const app = express()
metrics.injectMetricsRoute(app)
const bodyParser = require('body-parser')
const HealthCheckController = require('./app/js/HealthCheckController')

app.use(bodyParser.json({ limit: '2mb' }))
app.use(metrics.http.monitor(logger))

app.delete('/user/:user_id', SpellingAPIController.deleteDic)
app.get('/user/:user_id', SpellingAPIController.getDic)
app.post('/user/:user_id/check', SpellingAPIController.check)
app.post('/user/:user_id/learn', SpellingAPIController.learn)
app.post('/user/:user_id/unlearn', SpellingAPIController.unlearn)
app.post('/v20200714/check', SpellingAPIController.check)
app.delete('/v20200714/user/:user_id', SpellingAPIController.deleteDic)
app.get('/v20200714/user/:user_id', SpellingAPIController.getDicNoCache)
app.get('/v20200714/user/:user_id/dict', SpellingAPIController.getDicNoCache)
app.post('/v20200714/user/:user_id/learn', SpellingAPIController.learn)
app.post('/v20200714/user/:user_id/unlearn', SpellingAPIController.unlearn)
app.get('/status', (req, res) => res.send({ status: 'spelling api is up' }))

app.get('/health_check', HealthCheckController.healthCheck)

// direct user access with jwt auth
const jwt = require('express-jwt')
const publicHost = new URL(Settings.siteUrl).host
const jwtRouter = express.Router()
function asUser(req, res, next) {
  // emulate the params from the '/user/:user_id/check' route
  req.params.user_id = req.user.userId
  next()
}

jwtRouter.post('/check', asUser, SpellingAPIController.check)
jwtRouter.post('/learn', asUser, SpellingAPIController.learn)
jwtRouter.post('/v20200714/check', SpellingAPIController.check)
jwtRouter.get('/v20200714/dict', asUser, SpellingAPIController.getDicNoCache)
jwtRouter.post('/v20200714/learn', asUser, SpellingAPIController.learn)

app.use(
  '/jwt/spelling',
  (req, res, next) => {
    // only add CORS headers when not getting proxied through the main domain
    if (req.headers.host !== publicHost) {
      res.vary('Origin')
      if (Settings.allowedOrigins.includes(req.headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      }
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Authorization,Content-Type'
      )
      res.setHeader('Access-Control-Max-Age', 3600)
    }
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204)
    }
    next()
  },
  jwt(
    Object.assign(Settings.jwt.spelling.verify.options, {
      secret: Settings.jwt.spelling.verify.secret
    })
  ),
  jwtRouter,
  function (error, req, res, next) {
    if (error.name === 'UnauthorizedError') {
      // jwt auth failure
      return res.sendStatus(401)
    }
    next(error)
  }
)

const settings =
  Settings.internal && Settings.internal.spelling
    ? Settings.internal.spelling
    : undefined
const host = settings && settings.host ? settings.host : 'localhost'
const port = settings && settings.port ? settings.port : 3005

if (!module.parent) {
  // application entry point, called directly
  mongodb
    .waitForDb()
    .then(() => {
      app.listen(port, host, function (error) {
        if (error != null) {
          throw error
        }
        return logger.info(`spelling starting up, listening on ${host}:${port}`)
      })
    })
    .catch((err) => {
      logger.fatal({ err }, 'Cannot connect to mongo. Exiting.')
      process.exit(1)
    })
}

module.exports = app
