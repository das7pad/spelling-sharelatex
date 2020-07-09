const Path = require('path')

module.exports = {
  internal: {
    spelling: {
      port: 3005,
      host: process.env.LISTEN_ADDRESS || 'localhost'
    }
  },

  mongo: {
    url:
      process.env.MONGO_CONNECTION_STRING ||
      `mongodb://${process.env.MONGO_HOST || 'localhost'}/sharelatex`
  },

  cacheDir: Path.resolve('cache'),

  healthCheckUserId: '53c64d2fd68c8d000010bb5f',

  sentry: {
    dsn: process.env.SENTRY_DSN
  },

  /*
    $ grep install_deps.sh -e '  aspell-' \
      | sed "s/\ \ aspell-/'/;s/ ./',/;s/-/_/"
  */
  supportedLanguages: JSON.parse(process.env.SUPPORTED_LANGUAGES || null) || [
    'af',
    'am',
    'ar',
    'ar_large',
    'bg',
    'bn',
    'br',
    'ca',
    'cs',
    'cy',
    'da',
    'de',
    'de_1901',
    'el',
    'en',
    'eo',
    'es',
    'et',
    'eu_es',
    'fa',
    'fo',
    'fr',
    'ga',
    'gl_minimos',
    'gu',
    'he',
    'hi',
    'hr',
    'hsb',
    'hu',
    'hy',
    'id',
    'is',
    'it',
    'kk',
    'kn',
    'ku',
    'lt',
    'lv',
    'ml',
    'mr',
    'nl',
    'no',
    'nr',
    'ns',
    'or',
    'pa',
    'pl',
    'pt',
    'pt_br',
    'ro',
    'ru',
    'sk',
    'sl',
    'ss',
    'st',
    'sv',
    'ta',
    'te',
    'tl',
    'tn',
    'ts',
    'uk',
    'uz',
    'xh',
    'zu'
  ]
}
