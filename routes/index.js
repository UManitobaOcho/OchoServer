
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Y2K | Yearning 2 Know' });
};