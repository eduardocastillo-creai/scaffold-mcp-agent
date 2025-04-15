const { aliasDangerous, configPaths } = require('react-app-rewire-alias/lib/aliasDangerous');

module.exports = function override(config) {
  aliasDangerous({
    ...configPaths('./tsconfig.paths.json'),
  })(config);

  config.ignoreWarnings = [
    {
      module: /@antv\/util/,
      message: /Failed to parse source map/,
    },
    {
      module: /@antv\/scale/,
      message: /Failed to parse source map/,
    },
    {
      module: /@antv\/g2/,
      message: /Failed to parse source map/,
    },
    {
      module: /@antv\/component/,
      message: /Failed to parse source map/,
    },
    {
      module: /@antv\/g-math/,
      message: /Failed to parse source map/,
    }
  ];

  return config;
};
