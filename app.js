const express=require("express");

const app=express();

app.use(express.static(__dirname + "/public/"));

const bodyParser=require("body-parser");

const https=require("https");

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    var firstName=req.body.fName;
    var lastName=req.body.lName;
    var email=req.body.email;

    var data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };    

    var jsonData=JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/828c1c2f81"

    options={
        method: "POST",
        auth: process.env.API_KEY
    }

    const request=https.request(url,options,function(response){
        
        if (response.statusCode==200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }
        
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server started");
})

// API Key
// 488dd914832d1687250ea9f236248527-us21

// ID
// 828c1c2f81
