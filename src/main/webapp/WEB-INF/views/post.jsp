<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!doctype html>
<html lang="en">
<head>
   <%@include file="headerLink.jsp"%>
   <link href="css/common.css" rel="stylesheet">
    <title>Post</title>
</head>
<body>
<!--nav class="navbar navbar-expand-lg navbar-light navbar-laravel"-->
<nav class="navbar navbar-expand-lg navbar-light navbar-laravel" style="background-color: #d0cece;">
    <div class="container">
        <a class="navbar-brand">ポストアプリケーション</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
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
                                        <td><label for="email_address" class="col-md-10 col-form-label text-md-right">発言者</label>
                                        </td>
                                        <td>${userName}</td>
                                    </tr>
                                    <tr style="height:200px">
                                        <td><label for="email_address"
                                                   class="col-md-10 col-form-label text-md-right">内容</label></td>
                                        <td><textarea class="form-control" id="message" name="message"
                                                      placeholder="Message" rows="7"></textarea></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <button style="margin-left: 5px; width: 95px; background-color: #d0cece; border-color: #6882a4; color: #212529;"
                                                    type="submit" id="submit" class="btn btn-primary" value="">書き込
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </div>
                    </div>
                </div>
                <c:forEach items="${postList}" var="post">
                    <div class="col-md-10" id="list">
                        <div class="row" style="margin-top: 5px;">
                            <div class="col-md-4" style="float: left;">${post.user.userName}</div>
                            <div class="col-md-4">${post.date}</div>
                            <div class="col-md-2" style="text-align: end;"><a href="/editpost/${post.postId}">編集</a>
                            </div>
                            <div class="col-md-2" style="text-align: end;"><a href="/deletepost/${post.postId}">削除</a>
                            </div>
                        </div>
                        <div><p style="margin-top: 10px;">${post.message}</p></div>
                    </div>
                </c:forEach>
            </div>
        </div>
    </main>
</div>
<script src="js/post.js"></script>
</body>
</html>