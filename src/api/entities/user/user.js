const buildMakeUser = ({ Id, Email, makeHash, makeSource }) => ({
  id = Id.makeId(),
  email,
  password,
  source,
  createdAt = Date.now(),
  updatedAt = Date.now(),
}) => {
  if (!email || !Email.validate(email)) {
    throw new Error("User requires a valid email");
  }

  if (!password) {
    throw new Error("User requires a valid password");
  }

  const userSource = makeSource(source);
  const hashText = `${id}${email}${createdAt}${updatedAt}`;
  let hash;

  const serialize = (fields = ["id", "email"]) => {
    const userInfo = {
      id,
      email,
      createdAt,
      updatedAt,
      hash: (hash || makeHash(hashText)),
      source: userSource,
    };
    return fields.reduce((acc, field) => {
      if (userInfo[field]) {
        acc[field] = userInfo[field];
      }
      return acc;
    }, {});
  };

  return {
    getId: () => id,
    getEmail: () => email,
    getPassword: () => password,
    getSource: () => userSource,
    getCreatedAt: () => createdAt,
    getUpdatedAt: () => updatedAt,
    getHash: () => (hash || makeHash(hashText)),
    serialize,
  };
};

export default buildMakeUser;
