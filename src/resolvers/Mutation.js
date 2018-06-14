const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(parent, args, context, info) {

  // 1. First encrypt the User's password with bcrypt
  const password = await bcrypt.hash(args.password, 10);

  // 2. Using Prisma binding to store the new User in the database
  // N.B. id is hardcorded in the selection set
  const user = await context.db.mutation.createUser({
    data: { ...args, password }
  }, `{id}`)

  // 3. Generate a JWT which is signed by APP_SECRET
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 4. Finally return token and user
  return {
    token,
    user
  }
}

async function login(parent, args, context, info) {

  // 1. Use Prisma binding to get the User using the email that was sent along in the login mutation
  const user = await context.db.query.user({ where: { email: args.email } }, `{id password}`);

  // 2. If no user is found return an error
  if (!user) {
    throw new Error('No such user found')
  }

  // 3. check password is valid, if not return an error
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password')
  }

  // 4. Generate a JWT which is signed by APP_SECRET
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4. Finally return token and user
  return {
    token,
    user
  }
}

module.exports = {
  signup,
  login
}