const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated) {
    next();
  }

  res.redirect('/login');
};

const ensureGuest = (req, res, next) => {
  if (!req.isAuthenticated) {
    next();
  }

  res.redirect('/dashboard');
};

const ensureDataEntered = (req, res, next) => {
  if (
    req.user.hospitals.length > 0 &&
    req.user.availableTime.from &&
    req.user.availableTime.to
  ) {
    next();
  }

  res.redirect('/users/data');
};

module.exports = {
  ensureAuth,
  ensureGuest,
  ensureDataEntered,
};
