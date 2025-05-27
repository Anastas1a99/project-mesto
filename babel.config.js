const presets = [
  ['@babel/preset-env', { 
    targets: { 
      edge: '17',
      ie: '11',
      firefox: '50',
      chrome: '64',
      safari: '11.1'
    },
    useBuiltIns: "entry",
    corejs: "3.36"  // Явно указываем версию core-js
  }]
];

module.exports = { presets };