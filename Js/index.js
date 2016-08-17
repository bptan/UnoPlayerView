/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//$("btnSave").click(function()){
//    if($('gameId').val()=='')
//     gamesAvailable();   
//
$(function () {
    var gamesTemplate = Handlebars.compile($("#gamesTemplate").html());
    var rootURL = "http://localhost:8080/uno/api";
    var rootURLws = "ws://localhost:8080/uno";
    var gid;
    var user;
    var socket;


    $("#reloadBtn").on("singletap", function () {
        var promise = $.getJSON(rootURL + "/games");
        promise.done(function (result) {
            console.log(result);
            $("#all-games").empty();
            $("#all-games").append(gamesTemplate({games: result}));
        });

    });

    $("#all-games").on("singletap", "li", function () {
        gid = $(this).find("h4").text();
        var promise = $.post(rootURL + "/games/" + gid + "/players",
            {username: user});

        promise.done(function (result) {
            //$("#all-cards").empty();
            //console.log("inside promise done");
            $.UIGoToArticle("#selectedGame");
            //get websocket connection
            socket = new WebSocket(rootURLws+"/games/"+gid+"/"+user);
            $("#playername").empty();
            $("#playername").append(user);

            socket.onmessage = function(msg){

                var jsonObj = JSON.parse(msg.data);
                if(jsonObj.command === "yourcards"){
                    var result = jsonObj.hand;
                    $("#all-cards").empty();
                    for (var i = 0; i < result.length; i++) {
                        var imagename = result[i].image;

                        var cardUrl = $('<li class = "card" data-card="'+imagename+'">');
                        //$("<li>").addClass("card").attr("data-card", imagename);
                        var img = $("<img>").attr("src", "Images/" + result[i].image + ".png").attr("alt",result[i].image);

                        cardUrl.append(img);
                        //console.log(cardUrl);
                        $("#all-cards").append(cardUrl)
                    }
                }

            };

        });
        console.log("joingame")
    });

    $("#btnSave").on("singletap", function () {
        console.log("before click")
        var usernameEntered =true;
        if($("#txtUserName").val()==""){
            alert("Please enter username!");
            usernameEntered=false;
        }

        if(usernameEntered){
            var promise = $.post(rootURL + "/user",
                {
                    username: $("#txtUserName").val(),
                    password: $("#txtPassword").val()
                });
            console.log("after click");
            promise.done(function (result) {
                var data = result;
                user = data.username;
                $.UIGoToArticle("#main");
                console.log(user);
            })
            promise.fail(function(){
                    alert("Username in use!");
            });

        };

    });

    $("#btnBackInsideSelectedGame").on("singletap", function () {
        //socket.close();
        $.UIGoBack();
    });

    $("#all-cards").on("singletap", "li", function () {

        var message = {};
        message.command = "playcard";
        message.pname = user;
        message.card = $(this).attr("data-card");

        socket.send(JSON.stringify(message));

    });

});
