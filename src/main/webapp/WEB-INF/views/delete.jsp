<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<!doctype html>
<html lang="en">
<head>
   <%@include file="headerLink.jsp"%>
  <link href="../css/common.css" rel="stylesheet">
   <title>Delete</title>
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
    </div>
</nav>
<div class="container">
    <main class="post-form">
        <div class="cotainer">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card">
                        <div class="card-body">
                            <form action="/delete/${post.postId}" method="post">
                                <div style="margin-bottom: -8px;">
                                    <label>${userName}さん、ログイン中...</lable>
                                        <a class="label-two" href="/logout">ログアウト</a>
                                </div>
                                <table style="width:100%">
                                    <tr>
                                        <td><label class="col-md-10 col-form-label text-md-right">発言者</label>
                                        </td>
                                        <td>${userName}</td>
                                    </tr>
                                    <tr style="height:200px">
                                        <td><label class="col-md-10 col-form-label text-md-right">内容</label></td>
                                        <td><textarea class="form-control" id="message" name="message"
                                                      placeholder="Message" rows="7" readonly>${post.message}</textarea></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <button style="margin-left: 5px; width: 95px; background-color: #d0cece; border-color: #6882a4; color: #212529;"
                                                    id="deletebtn" class="btn btn-primary" value="">削除
                                            </button>
                                            <button onclick="window.location.href = '/post'"
                                                    style="margin-left: 5px; width: 95px; background-color: #d0cece; border-color: #6882a4; color: #212529;"
                                                    type="button" class="btn btn-primary" value="">戻る
                                            </button>
                                            <label style="margin-left: 75px;">書き込みを削除中です。</label>
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</div>
</main>
<script src="../js/post.js"></script>
</body>
</html>