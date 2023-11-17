export default {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Rapor Onay',
      version: '1.0.0',
      description: 'Rapor Onay sistemi için otomasyon Api',
    },
    basePath: '/api',
    servers: [
      {
        url: 'http://localhost:3001/api/',
      },
    ],
  },
  tags: [
    {
      "name": "User",
      "description": "API for users"
    }
  ],
  apis: [
    "src/models/*.js",
    "src/utils/helpers/*.js",
    "src/api/controllers/user/*.js",
    "src/api/controllers/user/edit/*.js",
    "src/api/controllers/user/auth/*.js"
  ]
};