/*
 * GET home page.
 */

exports.viewAssignments = function(req, res){
  res.render('viewAssignments', { title: 'Y2K | Yearning 2 Know' });
};