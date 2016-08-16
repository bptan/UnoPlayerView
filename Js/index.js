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

            $.UIGoToArticle("#selectedGame");
            //get websocket connection
            socket = new WebSocket(rootURLws+"/games/"+gid+"/"+user);


            socket.onmessage = function(msg){

                var jsonObj = JSON.parse(msg.data);
                if(jsonObj.command === "yourcards"){
                    var result = jsonObj.hand;
                    $("#all-cards").empty();
                    for (var i = 0; i < result.length; i++) {
                        var cardUrl = $('<li class = "card">');
                        var img = $("<img>").attr("src", "Images/" + result[i].image + ".png");
                        cardUrl.append(img);
                        $("#all-cards").append(cardUrl)
                    }
                }

            };


        });


        console.log("joingame")
    });

    $("#showHand").on("singletap", function () {
        var promise = $.getJSON(rootURL + "/games/" + gid + "/players/" + user);
        console.log("showhand")
        promise.done(function (result) {
            console.log(result.length)
            $("#all-cards").empty();
            for (var i = 0; i < result.length; i++) {
                var cardUrl = $('<li class = "card">');
                var img = $("<img>").attr("src", "Images/" + result[i].image + ".png");
                cardUrl.append(img);
                $("#all-cards").append(cardUrl)
            }
        });
        promise.fail(function () {
            //wont come here
            //$("#waitForGameToStart").val("Waiting");
        })
    })

    $("#btnSave").on("singletap", function () {
        console.log("before click")
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
        promise.fail(
            $("#information").val("Username in use")
        );
    })

    $("#btnBackInsideSelectedGame").on("singletap", function () {
        $.UIGoBack();
    });

});
