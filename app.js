var express         = require("express"),
    mongoose        = require("mongoose"),
    app             = express(),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    // creating schema from folder models
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    Admin       = require("./models/admin"),
    seedDB      = require("./seeds");

//connecting mongoose and creating a database

//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://abdulmajid:Confort7@ds017886.mlab.com:17886/uniconnect");

//seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Configuring passport
app.use(require("express-session")({
    secret: "Rusty is a champ",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passport.use(new LocalStrategy(Admin.authenticate()));
//passport.serializeUser(Admin.serializeUser());
//passport.deserializeUser(Admin.deserializeUser());

//implementing the currentUser middleware method to all templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//Admin.create({
//    admin: "abdulmajid",
//    password: "password"
//}, function(err, admin){
//    if(err){
//        console.log(err)
//    }else{
//        console.log("newly created admin");
//        console.log(admin)
//    }
//})

//Campground.create(
//    {
//        name: "adams majid", 
//        image:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcROcYNX6A4Efl1xbEmLwq0BXRxq6KYsSXx2ygrhhwGnXy_IiqM5",
//        description: "this is the best camp site ever, had fun to the fullest"
//    }, function(err, campground){
//        if(err){
//            console.log(err);
//        }else{
//            console.log("Newly CREATED");
//            console.log(campground);
//        }
//    });

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", { varcampgrounds: allCampgrounds, currentUser: req.user });
        }
    });
});

//CREATE ROUTES
app.post("/campgrounds", isLoggedIn, function(req, res){
    //getting the value passed in the form
    var nameValue = req.body.name;
    var imageValue = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    //we need an object to pass to the array
    var newCampgroundObj = {name: nameValue, image: imageValue, description: description, author: author};
    
    
    
    Campground.create(newCampgroundObj, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect to campground page
            res.redirect('/campgrounds');
        }
    });
});

//NEW ROUTES
app.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render('campgrounds/new.ejs');
});

//SHOW ROUTES
app.get("/campgrounds/:id", function(req, res){
    //find the campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
       if(err){
           console.log(typeof(req.params.id));
           console.log(err);
       } else{
           //so we access the var campground and have the value we have with the id
            res.render('campgrounds/show', { campground: foundCamp });    
       }
    });
})


//==========================
    //COMMENTS ROUTES
//==========================

//rendring comment form
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render('comments/new', {campground: campground});      
        }
    })
})

//handling the comment form
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    campground.comments.push(comment)
                    //saving comments...
                    comment.save();
                    //saving campsgrounds
                    campground.save();
                    req.flash("success", "successfully added comment");
                    res.redirect('/campgrounds/' + campground._id)
                }
            })
        }
    })
})

//edit route comments
app.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back')
        }else{
            res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });      
        }
    })
})

//handling the the edit comment form - comment update route
app.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect('back')
        }else{
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

//comment -- destroy route
app.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err){   //refering to the :comment_id
        if(err){
            res.redirect('back')
        }else{
            req.flash("success", "Your comment was deleted")
            res.redirect('/campgrounds/' + req.params.id)   //referring to the campgrounds/:id
        }
    })
})

//===================
//AUTH ROUTES
//===================

//show sign up form
app.get("/register", function(req, res){
    res.render('register');
});

//handling the signup form
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            req.flash("error", err.message)
            return res.redirect('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "You are signed in as " + user.username)
            res.redirect('/campgrounds')
        })
    })
});

//showing login form
app.get("/login", function(req, res){
   res.render('login');
});

//handling the login form
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route
app.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "successfully logout");
    res.redirect('/campgrounds')
});

//admin dashboard
app.get("/admin", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("admin/index", { varcampgrounds: allCampgrounds });
        }
    });
});

//showing admin login form
app.get("/admin/login", function(req, res){
   res.render('admin_login.ejs');
});

//handling the admin login form
app.post("/admin/login", passport.authenticate("local", 
    {
        successRedirect: "/admin", 
        failureRedirect: "/admin/login"
    }), function(req, res){
});

//edit route
app.get("/campgrounds/:id/edit", checkOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundEditCampgrounds){
            res.render('campgrounds/edit', {editCampground: foundEditCampgrounds})
        });
});

//update route
app.put("/campgrounds/:id", checkOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camps, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
})

//delete route
app.delete("/campgrounds/:id", checkOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect('/campgrounds'); 
       }else{
           res.redirect('/campgrounds');
       }
    });
})

//middleware methods
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

//checking if campgrounds belongs to a user
function checkOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundEditCampgrounds){
            if(err){
                req.flash("error", "Campgrounds not found");
                res.redirect("back");
            }else{
                if(foundEditCampgrounds.author.id.equals(req.user._id)){
                    next()  //continue with the rest of the function
                }else{
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                } 
            }
        })   
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect('back')    //take the user to the previous page
    }
}

//checking if comment belongs to a user
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundEditComment){
            if(err){
                console.log(err)
                res.redirect("back");
            }else{
                if(foundEditComment.author.id.equals(req.user._id)){
                    next()  //continue with the rest of the function
                }else{
                    req.flash("error", "You dont have permission to do that")
                    res.redirect("back");
                } 
            }
        })   
    }else{
        req.flash("error", "You need to be logged in to do that")
        res.redirect('back')    //take the user to the previous page
    }
}

app.listen(3000, function(){
	console.log("server started");
})