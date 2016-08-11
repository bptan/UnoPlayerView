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

    var gid;
    var user


    $("#reloadBtn").on("singletap", function() {
        var promise = $.getJSON("http://localhost:8080/uno/api/games");
        promise.done(function(result) {
            console.log(result);
            $("#all-games").append(gamesTemplate({games: result}));
        });

    });

    $("#all-games").on("singletap", "li", function() {
        gid = $(this).find("h4").text();
        var promise = $.get("http://localhost:8080/uno/api/games/"+gid+"?username="+user)
            promise.done(function(result) {

                $.UIGoToArticle("#selectedGame");
            })
        console.log("joingame")
    });

    $("#showHand").on("singletap", function(){
        var promise = $.getJSON("http://localhost:8080/uno/api/games/"+gid+"/players/"+user);
        console.log("showhand")
        promise.done(function(result){
            console.log(result.length)
            //var jsonArrayHand = JSON.stringify(result.hand);
            //var arr = $.map(jsonArrayHand, function(el) { return el });
            //console.log(arr);
            for (var i = 0; i< result.length;i++){
                var cardUrl = $('<li class = "card">');
                var img = $("<img>").attr("src","Images/"+result[i].image+".png");
                cardUrl.append(img);
                $("#all-cards").append(cardUrl)
            }
        });
        promise.fail(function(){
            //wont come here
            //$("#waitForGameToStart").val("Waiting");
        })
    })

    $("#btnSave").on("singletap",function(){
        console.log("before click")
        var promise = $.post("http://localhost:8080/uno/api/user/register",
            {username:$("#txtUserName").val(),
            password:$("#txtPassword").val()});
        console.log("after click");
        promise.done(function(result){
            user = result;
            $.UIGoToArticle("#main");
            console.log(user);
        })
        promise.fail(
            $("#information").val("Username in use")
        );
    })






});
