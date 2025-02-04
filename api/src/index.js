/**
 * Prelude
 */
const express = require('express')
const bodyParser = require('body-parser')
const boom = require('express-boom')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const compression = require('compression')
const YAML = require('yamljs')
const swaggerUi = require('swagger-ui-express')
const path = require('path')
const pify = require('pify')
const { userExtent } = require('./routes/extents')

const pckg = require('../../package.json')
const router = require('./routes')

const app = express()
const db = require('./db/connection')
const dbSettings = require('./models/settings')

const { SESSION_SECRET, NODE_ENV, cache } = require('./config')
const { passport, authRouter } = require('./passport')

/**
 * Methods for local mbtiles
 */
const Mbtiles = require('@mapbox/mbtiles')
const mbtiles = pify(function (params, callback) {
  return new Mbtiles(params, callback)
})

/**
 * Config
 */

const swaggerDocument = YAML.load(path.join(__dirname, '..', '/docs/api.yml'))
swaggerDocument.info.version = pckg.version

/**
 * Session
 */

let sessionConfig = {
  name: 'scoreboard',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  store: new KnexSessionStore({ knex: db }),
  cookie: { maxAge: 30 * 86400 * 1000 } // 1 month cookies
}

app.use(bodyParser.json())
app.use(compression())
app.use(boom())
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
app.use('/auth', authRouter)
app.use('/api', router)
app.use('/scoreboard/api', router)
app.use(['/api', '/api/docs'], swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/fonts', express.static(path.join(__dirname, '../../static/fonts')))
app.use('/docs', express.static(path.join(__dirname, '../../docs-build')))

app.get('/favicon.ico', (req, res) => res.status(200).sendFile('favicon.ico', { root: path.join(__dirname, '../../static/') }))

module.exports = async function () {
  // load the cache
  const settings = await dbSettings.list()
  settings.forEach(({ setting, value }) => {
    cache.put(setting, value)
  })

  if (NODE_ENV === 'development') {
    let tiles = await mbtiles(path.join(__dirname, 'db', 'earthquakes.mbtiles'))
    app.get(['/api/extents/user/test/:z/:x/:y.mvt', '/scoreboard/api/extents/user/test/:z/:x/:y.mvt'], (req, res) => {
      var p = req.params
      tiles.getTile(p.z, p.x, p.y, function (err, tile, headers) {
        if (err) {
          res.end()
        } else {
          res.writeHead(200, headers)
          res.end(tile)
        }
      })
    })
    return app
  } else {
    app.get(['/api/extents/user/:user/:z/:x/:y.mvt', '/scoreboard/api/extents/user/:user/:z/:x/:y.mvt'], userExtent)
    return app
  }
}
