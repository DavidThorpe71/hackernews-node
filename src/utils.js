const jwt = require('jsonwebtoken')
const APP_SECRET = 'CoolDeeishere'

// This is a helper function to call in resolvers that require authentication
function getUserId(context) {
  // 1. Retreive the Authorization header (which contains the user's JWT) from incoming HTTP request
  const Authorization = context.request.get('Authorization')

  // 2. Verify the JWT and gets user's ID from it
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }
  // 3. Throw's and error if user not successfully authenticated
  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getUserId,
}