const axios = require('axios');
const { config, getToken } = require('../data/auth0.config');

async function findAllUsers(req, res, next) {
  const token = await getToken();
  try {
    const users = await axios.get('/users', config(token));
    res.json(users.data);
  } catch (error) {
    next(error);
  }
}

async function findUser(req, res, next) {
  const { sub } = req.user;
  const token = await getToken();
  try {
    const userData = await axios.get(`/users/${sub}`, config(token));
    const roleData = await axios.get(`/users/${sub}/roles`, config(token));
    res.json({ ...userData.data, roles: roleData.data });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  const { sub } = req.user;
  const token = await getToken();
  try {
    const updatedUser = await axios.patch(
      `/users/${sub}`,
      req.body,
      config(token)
    );
    const roleData = await axios.get(`/users/${sub}/roles`, config(token));
    res.status(200).json({ ...updatedUser.data, roles: roleData.data });
  } catch (error) {
    next(error);
  }
}

async function getAllRoles(req, res, next) {
  const token = await getToken();
  try {
    const roles = await axios.get(`/roles`, config(token));
    res.json(roles.data);
  } catch (error) {
    next(error);
  }
}

async function promoteModerator(req, res, next) {
  const token = await getToken();
  const { userId } = req.params;
  const { roleId } = req.body;
  try {
    const body = { roles: [roleId] };
    const response = await axios.post(
      `/users/${userId}/roles`,
      body,
      config(token)
    );
    res.status(response.status);
  } catch (error) {
    next(error);
  }
}

async function demoteModerator(req, res, next) {
  const { userId } = req.params;
  const { roleId } = req.body;
  const token = await getToken();
  try {
    const body = { roles: [roleId] };
    const response = await axios.post(
      `/users/${userId}/roles`,
      body,
      config(token)
    );
    res.status(response.status);
  } catch (error) {
    next(error);
  }
}

function checkRoleId(req, res, next) {
  const { roleId } = req.body;
  if (!roleId) {
    res.status(400).json({ message: 'roleId is required' });
  }
  next();
}

async function checkUser(req, res, next) {
  const { userId } = req.params;
  const token = await getToken();
  try {
    const foundUser = await axios.get(`/users/${userId}`, config(token));
    if (foundUser.status === 200) {
      next();
    } else {
      res.status(foundUser.status).json({ message: 'Something went wrong' });
    }
  } catch (error) {
    res.status(error.status).json({ message: 'An Error has occurred', error });
  }
}

// async function deleteUser(req, res, next) {
//   const { id } = req.params;
//   try {
//     const foundUser = await Users.findBy({ id });
//     if (foundUser.length > 0) {
//       const count = await Users.remove(id);
//       res.json(count);
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     next(error);
//   }
// }

module.exports = {
  findAllUsers,
  findUser,
  updateUser,
  getAllRoles,
  promoteModerator,
  demoteModerator,
  checkRoleId,
  checkUser,
};

/**
 * @apiDefine RoleIdValidation
 * @apiError (400) {json} ValidationError
 * @apiErrorExample {json} Error-Response:
 * {
 *   "message": "roleId is required"
 * }
 */

/**
 * @api {get} /api/moderator/users Gets All Users from Auth0
 * @apiName Get All Users
 * @apiGroup Users
 * @apiPermission token, moderator
 * @apiDescription requires token, moderator
 * @apiSuccess {json} users All Users in Auth0
 */

/**
 * @api {get} /api/users/user Gets current Logged in User
 * @apiName Get Logged In User
 * @apiGroup Users
 * @apiPermission token
 * @apiDescription requires token
 * @apiSuccess {json} user Current logged in user
 */

/**
 * @api {patch} /api/users/user Updates the User Information
 * @apiName Update current Logged in User
 * @apiGroup Users
 * @apiPermission token
 * @apiDescription requires token
 * @apiParam {String} first_name User's First Name
 * @apiParam {String} last_name User's Last Name
 * @apiParam {String} about User's About Information
 * @apiParam {String} company User's Company
 * @apiParam {String} company_url User's Company URL
 * @apiParam {String} phone User's Phone Number
 * @apiParam {String} role User's Role
 * @apiSuccess {json} user_metadata User's MetaData update from Auth 0
 */

/**
 *  @api {get} /api/moderator/roles Retrieves all Roles form Auth0
 *  @apiName Get All Auth0 Roles
 *  @apiGroup Users
 *  @apiPermission token, moderator
 *  @apiDescription Requires token, moderator
 *  @apiSuccess {json} roles Roles data from Auth0
 */

/**
 *  @api {post} /api/admin/moderator/:userId Promotes an User to Moderator with Provided User ID
 *  @apiUse RoleIdValidation
 *  @apiName Promote Moderator
 *  @apiGroup Users
 *  @apiPermission token, admin
 *  @apiDescription Requires token, admin
 *  @apiParam {String} userId The userId you want to promote
 *  @apiParam {String} roleId The roleId you want to give the user
 *  @apiParamExample {json} Sample-Request
 *  {
 *    "roleId": "Auth0 Role Id"
 *  }
 */

/**
 *  @api {delete} /api/admin/moderator/:userId Demotes an User with Provided User Id
 *  @apiUse RoleIdValidation
 *  @apiName Demote Moderator
 *  @apiGroup Users
 *  @apiPermission token, admin
 *  @apiDescription Requires token, admin
 *  @apiParam {String} userId The userId you want to promote
 *  @apiParam {String} roleId The roleId you want to give the user
 *  @apiParamExample {json} Sample-Request
 *  {
 *    "roleId": "Auth0 Role Id"
 *  }
 */
