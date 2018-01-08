// @flow

type UsersArg = Array<string>;

export function getTitleFromUsers(users: UsersArg = []) {
  if (!users) {
    return null;
  }
  return users.filter(str => !!str).join(', ');
};
