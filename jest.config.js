module.exports = {
  testEnvironment: 'node',
  transform: {},
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
      'LogisticsCore.js',
      'StrategicPathfinder.js',
      'MissionSimulator.js',
      'DecisionSupport.js',
      'js/modules/**/*.js'
  ],
  testMatch: [
      '**/tests/unit/**/*.test.js',
      '**/tests/integration/**/*.test.js'
  ]
};
