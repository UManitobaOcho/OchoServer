
/*
 * GET about page.
 */

exports.about = function(req, res){
  res.render('about', { title: 'Y2K | Yearning 2 Know' });
};