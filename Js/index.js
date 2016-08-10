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
    $("#reloadBtn").on("singletap", function() {
        var promise = $.getJSON("http://localhost:8080/uno/api/games");
        promise.done(function(result) {

            $("#all-games").append(gamesTemplate({games: result}));
        });

    });

    $("#all-games").on("singletap", "li", function() {
        gid = $(this).find("h4").text();
        var promise = $.get("http://localhost:8080/uno/api/games/"+gid+"?username=bob")
            promise.done(function(result) {

                $.UIGoToArticle("#selectedGame");
            })
        console.log("joingame")
    });

    $("#showHand").on("singletap", function(){
        var promise = $.getJSON("http://localhost:8080/uno/api/games/"+gid+"/players/bob");
        console.log("showhand")
        promise.done(function(result){


        });
        promise.fail(function(){
            //wont come here
            //$("#waitForGameToStart").val("Waiting");
        })
    })



    $("#reloadBtn").trigger("singletap");


});
