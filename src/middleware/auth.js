const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};

const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
};

const ensureDataEntered = (req, res, next) => {
  if (!req.user.training && req.user.hospitals.length > 0 && req.user.address) {
    return next();
  }

  if (
    req.user.training &&
    req.user.hospitals.length > 0 &&
    req.user.availableTime.from &&
    req.user.availableTime.to
  ) {
    return next();
  }

  res.redirect('/account/profile');
};

module.exports = {
  ensureAuth,
  ensureGuest,
  ensureDataEntered,
};
