
//---------------------------------------------signup page call------------------------------------------------------

exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
	   //get all input values from html by post method
      var post  = req.body;
      var rname= post.register_username;
      var rpass= post.register_password;
      var gender= post.gender;
      var role= post.role;
      
    //create sql to insert username and password to mysql 
       var sql = "INSERT INTO `user`(`username`,`password`,`gender`,`role`) VALUES ('" + rname + "','" + rpass + "','" + gender + "','" + role + "')";
   
    //implement sql query
      var query = db.query(sql, function(err, result) {
	
	//if successful print success message
         message = "Succesfully! Your account has been created.";
         res.render('signup.html',{message: message});
		 
      });

   } else {
      
         res.render('signup');
		 
   }
};
//-----------------------------------------------login page call------------------------------------------------------

exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
	    //get all input values from html by post method
      var post  = req.body;
      var name= post.login_username;
      var pass= post.login_password;
	  
      //create sql to check username and password exists in mysql 
      var sql="SELECT * FROM `user` WHERE `username`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
			 //save username and userid in session
            req.session.userId = results[0].userid;
            req.session.user = results[0].username;
            
			//return to index page
            res.redirect('/');
         }
         else{
			 //error present
            message = 'Wrong Credentials.';
            res.render('login.html',{message: message});
			
         }
                 
      });
   } else {
      res.render('login.html',{message: message});
   }
           
};

//-----------------------------------------------library page functionality----------------------------------------------
           
exports.library = function(req, res, next){
           
   var sql="SELECT * FROM books";
//send information of all books to a url then use ajax to use those data
   db.query(sql, function(err, results){
       res.send(results); 
   });       
};

//post books to html and if login already display the username
exports.books = function(req, res, next){
	var user = req.session.user;
   if(user != null){
      res.render('library.html', {user:user});
   }
   else{
	   user = '';
	     res.render('library.html', {user:user});
   }
      
          
};
//get book id when click detail button
exports.books_post = function(req, res, next){
      if(req.method == "POST"){
      var post  = req.body;
      
	  var id= post.detail;
	  req.session.bookid = id;
	  //console.log(req.session.bookid );
	  res.redirect('/books/details');
	  }
          
};
//------------------------------------book details get functionality----------------------------------------------
exports.book_detail=function(req,res){
	//check login
	var user = req.session.user;
   if(user == null){
      res.redirect("/login");
      return;
   }
   
	var bookid = req.session.bookid;
	  if(bookid != null)
	  {
		  //creat sql query to get all information of books and review by book choose.
		var sql="SELECT * FROM `books` WHERE `book_id`='"+bookid+"' "; 
		var sql2="SELECT username, review FROM `user` join `review` using(userid) WHERE `book_id`='"+bookid+"' "; 
		
	  //implement sql query
        db.query(sql, function(err, results){      
         if(results.length){
			 
            db.query(sql2, function(err, results2){      
			//send results of query to html
            res.render('book_detail.html',{detail: results, review:results2, user:user});
 
                 
      });
            
            
         }
         else{
            message = '';
            res.render('book_detail.html',{message: message});
			
         }
                 
      });	

      	  
	  }
   
};
//--------------------------------book details Post functionality--------------------------------
exports.book_action = function(req, res){
	//check login
	var userid = req.session.userId;
	var user = req.session.user;
   if(user == null){
      res.redirect("/login");
      return;
   }
   //get select book id
    var bookid = req.session.bookid;
	//check user id and book id is not null
	if (userid != null && bookid != null){
    if(req.method == "POST"){
      var post  = req.body;
      var submitb = post.submitv;
	  var action= post.wish_buy;
	  var review= post.review_text;
	  //if user click submit button of review 
	  if(review != '' && submitb == "Submit"){
		  //insert user id, book id and review into review table
		  var sql = "INSERT INTO `review`(`userid`,`book_id`,`review`) VALUES ('" + userid + "','" + bookid + "','" + review + "')";
		  db.query(sql, function(err, results){      
   res.redirect('/books/details');
      });
		  
	  }
	  
	 
	  else if(action != ''){
		   //if user click purchase button then insert information into purchase table and update book stock
		  if(action == "purchase"){
			  var psql = "INSERT INTO `purchase`(`userid`,`book_id`) VALUES ('" + userid + "','" + bookid + "')";
		  db.query(psql, function(err, results){      

      });
	  
	   var quanNo = "select stock from `books` where book_id = '" + bookid + "'";
	   
	   db.query(quanNo, function(err, results){    
           var news = results[0].stock - 1
           var quanNoup = "update `books` set stock = '" + news + "' where book_id = '" + bookid + "'";
		   db.query(quanNoup, function(err, results){      
         res.redirect('/books/details');
   
      });
      });
	   
		  }
		  //if user click wish button then insert information into wish table
		  else if(action == "wish"){
			  var wsql = "INSERT INTO `wish`(`userid`,`book_id`) VALUES ('" + userid + "','" + bookid + "')";
		  db.query(wsql, function(err, results){  
      res.redirect('/books/details');		  
     
      });
		  }
		  else{
		     res.redirect('/books/details');
	  }
	  }
		 
	  
	  }
	  
	}
 
};

//---------------------------------users details get functionality----------------------------------       

exports.user_detail=function(req,res){
	//check login
	var userid = req.session.userId;
	var user = req.session.user;
   if(userid == null){
      res.redirect("/login");
      return;
   }
	
	error = '';
	if(req.query.error != null){
	error = req.query.error;}
	  //get all information from user table, book table, wish table， purchase table and review table use into user profile
		var sql="SELECT * FROM `user` WHERE `userid`='"+userid+"' "; 
		var sql1="SELECT * FROM `books` join `wish` using(`book_id`) WHERE `userid`='"+userid+"' group by `book_id`";
		var sql2="SELECT * FROM `books` join `purchase` using(`book_id`) WHERE `userid`='"+userid+"' ";
		var sql3="SELECT sum(price) as 'total', count(*) as 'noof' FROM `books` join `purchase` using(`book_id`) WHERE `userid`='"+userid+"' ";
		var sql4="SELECT title, review FROM `books` join `review` using(book_id) WHERE `userid`='"+userid+"' "; 
		
	  
        db.query(sql, function(err, results){      
       db.query(sql1, function(err, results1){      
       db.query(sql2, function(err, results2){
		db.query(sql3, function(err, results3){
		   db.query(sql4, function(err, results4){
		   
       res.render('user_profile.html',{detail: results, wish :results1 , purchase: results2, sum: results3, review:results4, error:error, user:user});
                 
      }); 
       
                 
      });   
          
      });
                 
      });
                 
      });
            
}      

//---------------------------------users details post functionality----------------------------------          
       
exports.user_post = function(req, res){
	//check login
	var userid = req.session.userId;
	var user = req.session.user;
   if(user == null){
      res.redirect("/login");
      return;
   }

   if(req.method == "POST"){
	   
      var post  = req.body;
	  var userid = req.session.userId;
      var pbookid= post.p_sub;
	  var cbookid= post.c_sub;
	  var oldp= post.old_password;
	  var newp= post.new_password;
	  var conp= post.con_password;
      console.log(cbookid);
	  //user purchase book in wish screen
	  if(pbookid != null){
	  var psql = "INSERT INTO `purchase`(`userid`,`book_id`) VALUES ('" + userid + "','" + pbookid + "')";
		  db.query(psql, function(err, results){      

      });
	  
	   var quanNo = "select stock from `books` where book_id = '" + pbookid + "'";
	   
	   db.query(quanNo, function(err, results){    
           var news = results[0].stock - 1
           var quanNoup = "update `books` set stock = '" + news + "' where book_id = '" + pbookid + "'";
		   db.query(quanNoup, function(err, results){      
         res.redirect('/user_profile');
   
      });
      });
	  
	  }
	  //user delete a book from wish screen 
	  else if(cbookid != null){
	  var delewish = "delete from `wish` where userid = '" + userid + "' and book_id = '" + cbookid + "'";
	  db.query(delewish, function(err, results){      
		res.redirect('/user_profile');
      });
	  }
	  //check old password is right and update new password
	  else if(oldp != null && newp != null && conp != null && newp == conp){
		  var passup = "update `user` set password = '" + newp + "' where userid = '" + userid + "'";
		  var passcheck = "select * from `user` where userid = '" + userid + "' and password = '" + oldp + "' ";
		  
	  db.query(passcheck, function(err, results){
		  if(results == 0){
			  res.redirect('/user_profile?error=Password misstake');
		  }
		  else{
			  
			db.query(passup, function(err, results){
			
        res.redirect('/user_profile?error=Update Successful');
			
      });
		  }
      });
	  }
	  //error present
	  else if(newp != conp){res.redirect('/user_profile?error=Both Password Diff');}
	  else{
		  res.redirect('/user_profile?error=Password misstake');
	  }
   } 
           
};

//------------------------------------logout functionality----------------------------------------------
	exports.logout=function(req,res){
	   req.session.destroy(function(err) {
		  res.redirect("/login");
	   })
	};



