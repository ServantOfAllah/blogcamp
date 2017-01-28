var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "latest",
        image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSdFyOLBvUcFFmMQS0Y4hNwo-3q_QudTAyRvaJ0yA1j14ikn3gZ",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    },
    {
        name: "playful",
        image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTBFDdA7x-7ALyY3rFHNolhCdB8E71yQ60_kidVVNcX2LRXVCvXyg",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    },
    {
        name: "hottest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgDDPV_tSBFLl8Xcl4uVsi9AL7GQFuGnMAPIq_kfc6l0x8olA6",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    }
]

function seedDB(){
    //emptying the DB
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed campgrounds!");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campgroundData){
                if(err){
                    console.log(err)
                }else{
                    console.log("camp created");
                    
                    //create comments
                    Comment.create(
                        {
                            text: "crazy place i dont wanna go again",
                            author: "adamson"
                        }, function(err, newComment){
                            if(err){
                                console.log(err)
                            }else{
                                    campgroundData.comments.push(newComment);
                                    campgroundData.save();  
                                    console.log("comment created")
                                }
                            }
                        )}
                     }
                    )
                    }
                )};
            });
        }

module.exports = seedDB;