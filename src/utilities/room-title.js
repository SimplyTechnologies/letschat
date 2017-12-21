export function getTitleFromUsers(users = []) {
  if (!users) {
    return null;
  }
  return users.filter(str => !!str).join(', ');
};
