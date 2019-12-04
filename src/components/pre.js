const { GraphQLClient } = require("graphql-request");

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const CLAIM_NAMESPACE =
  process.env.CLAIM_NAMESPACE || "https://hasura.io/jwt/claims";
const endpoint = process.env.HGE_ENDPOINT;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Hasura-Admin-Secret": ADMIN_SECRET
  }
});

const query = `
  query getUser($userId: String!) {
    user: users_by_pk(id: $userId) {
      roles_connection(order_by: {role: {priority: desc, id: asc}}, where: {deleted_at: {_is_null: true}}) {
        role {
          name
        }
      }
      organizations_connection(where: {organization: {is_active: {_eq: true}, deleted_at: {_is_null: true}}}) {
        organization_id
      }
    }
  }
`;

module.exports.assign = async (event, context, callback) => {
  const userId = event.request.userAttributes.sub;
  const { user } = await client.request(query, {
    userId
  });

  const allowedRoles = (user.roles_connection || []).map(rc => rc.role.name);
  const organizationIds = (user.organizations_connection || []).map(
    oc => oc.organization_id
  );

  const claimData = {
    "x-hasura-allowed-roles": [...allowedRoles, "anonymous"],
    "x-hasura-default-role": "user",
    "x-hasura-user-id": userId
  };

  if (organizationIds && organizationIds.length > 0) {
    claimData["X-Hasura-Allowed-Organizations"] = `{${organizationIds.join(
      ","
    )}}`;
  }

  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        [CLAIM_NAMESPACE]: JSON.stringify(claimData)
      }
    }
  };

  callback(null, event);
};