<%@ page language="java" contentType="text/html; charset=UTF-8"
     pageEncoding="UTF-8" %>

<!doctype html>
<html lang="en">
<head>
<!-- Required meta tags -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
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
<style>
@import url(https://fonts.googleapis.com/css?family=Raleway:300,400,600);

body{
margin: 0;
font-size: .9rem;
font-weight: 400;
line-height: 1.6;
color: #212529;
text-align: left;
background-color: #f5f8fa;
font-family: "Meiryo", Meiryo, "Hiragino Kaku Gothic Pro", Osaka, "MS Gothic", "MS P Gothic", sans-serif !important;
}

.navbar-laravel
{
box-shadow: 0 2px 4px rgba(0,0,0,.04);
}

.navbar-brand , .nav-link, .my-form, .login-form
{
font-family: Raleway, sans-serif;
}

.my-form .row
{
margin-left: 0;
margin-right: 0;
}

.login-form
{
padding-top: 1.5rem;
padding-bottom: 1.5rem;
margin-top: 150px;
}

.login-form .row
{
margin-left: 0;
margin-right: 0;
}

.post-form
{
padding-top: 1.5rem;
padding-bottom: 1.5rem;
margin-top: 100px;
}

#postTable{
margin-top: 30px;
}

table, th, td {
border: 1px solid black;

}
tbody tr td:first-child {
width: 13%;
}
.label-two {
	margin-left: 10px;
	margin-bottom: -15px;
}
</style>

<title>Delete</title>
</head>
<body>
<!--nav class="navbar navbar-expand-lg navbar-light navbar-laravel"-->
<nav class="navbar navbar-expand-lg navbar-light navbar-laravel" style="background-color: #d0cece;">
    <div class="container">
        <a class="navbar-brand">ポストアプリケーション</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
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
								<div>
								<label>${userName}さん、ログイン中...</lable>
								<label class="label-two">ログアウト</lable>
								</div>
                                <table style="width:100%">
                                    <tr>
                                      <td><label for="email_address" class="col-md-10 col-form-label text-md-right">発言者</label></td>
                                      <td>${userName}</td>
                                    </tr>
                                    <tr style="height:200px">
                                      <td><label for="email_address" class="col-md-10 col-form-label text-md-right">内容</label></td>
                                      <td> <textarea class="form-control" id="message" name="message" placeholder="Message" rows="7">${post.message}</textarea></td>
                                    </tr>
                                    <tr>
                                      <td colspan="2">
                                        <button style="margin-left: 5px; width: 95px; background-color: #d0cece; border-color: #6882a4; color: #212529;" type="submit"  class="btn btn-primary" value="">削除</button>
                                        <button onclick="window.location.href = '/post'"  style="margin-left: 5px; width: 95px; background-color: #d0cece; border-color: #6882a4; color: #212529;" type="button" class="btn btn-primary" value="">戻る</button>
                                        <label style="margin-left: 75px;">書き込みを削除中です。</label>
                                    </td>
                                    </tr>
                                  </table>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
</main>
</body>
</html>