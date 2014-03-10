
/*
 * GET course page.
 */

exports.courseHomepage = function(req, res){
  res.render('courseHomepage', { title: 'Y2K | Yearning 2 Know' });
};
