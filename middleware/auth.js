module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('warning_msg', '請先登入帳號！')
  return res.redirect('/users/login')
}