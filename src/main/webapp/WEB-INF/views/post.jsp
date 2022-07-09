<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!doctype html>
<html lang="en">
<head>
<!-- Required meta tags -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link href="css/login.css" rel="stylesheet">
<!-- Fonts -->
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css?family=Raleway:300,400,600" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
<script src="http://code.jquery.com/jquery-3.3.1.min.js"
integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">
<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js" ></script>
<title>Post</title>
</head>
<body>
<!--nav class="navbar navbar-expand-lg navbar-light navbar-laravel"-->
<nav class="navbar navbar-expand-lg navbar-light navbar-laravel" style="background-color: #d0cece;">
<div class="container">
    <a class="navbar-brand">ポストアプリケーション</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
    </div>
</div>
</nav>
<div class="container">
<main class="post-form">
   <div class="cotainer">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-body">
                    <form action="/save" method="post">
                        <table style="width:100%">
                            <div style="margin-bottom: -8px;">
                                <label>${userName}さん、ログイン中...</lable>
                                    <a class="label-two" href="/logout">ログアウト</a>
                                    </div>
                                    <tr>
                                      <td><label for="email_address" class="col-md-10 col-form-label text-md-right">発言者</label></td>
                                      <td>${userName}</td>
                                  </tr>
                                  <tr style="height:200px">
                                      <td><label for="email_address" class="col-md-10 col-form-label text-md-right">内容</label></td>
                                      <td> <textarea class="form-control" id="message" name="message" placeholder="Message" rows="7"></textarea></td>
                                  </tr>
                                  <tr>
                                      <td colspan="2">
                                        <button style="margin-left: 5px; width: 95px; background-color: #d0cece; border-color: #6882a4; color: #212529;" type="submit"  class="btn btn-primary" value="">書き込</button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
           <c:forEach items="${postList}" var="post"> 
            <div class="col-md-10" id="list" >
                <div class="row" style="margin-top: 5px;">
                    <div class="col-md-5" style="float: left;">${post.user.userName}</div>
                    <div class="col-md-3">${post.date}</div>
                    <div class="col-md-2" style="text-align: end;"><a href="/editpost/${post.postId}">編集</a></div>
                    <div class="col-md-2" style="text-align: end;"><a  href="/deletepost/${post.postId}">削除</a></div>
                </div>
                <div><p style="margin-top: 10px;">${post.message}</p></div>
            </div>
           </c:forEach>
        </div>
    </div>
</main></body>
</html>