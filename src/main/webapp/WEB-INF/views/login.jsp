<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!doctype html>
<html lang="en">
<head>
   <%@include file="headerLink.jsp"%>
   <link href="css/common.css" rel="stylesheet">
    <title>Login</title>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-light navbar-laravel" style="background-color: #d0cece;">
    <div class="container">
        <a class="navbar-brand">ポストアプリケーション</a>
    </div>
</nav>
<main class="container">
    <main class="login-form">
        <div class="cotainer">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header center" style="background-color: #e1ebf7; text-align: center;">ログイン認証
                        </div>
                        <div class="card-body">
                            <form action="/login" method="post">
                                <div class="form-group row">
                                    <label for="email_address"
                                           class="col-md-4 col-form-label text-md-right">メールアドレス</label>
                                    <div class="col-md-6">                                       
                                        <input type="text" id="username" class="form-control" name="username">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="password" class="col-md-4 col-form-label text-md-right">パスワード</label>
                                    <div class="col-md-6">                                     
                                        <input type="password" id="password" class="form-control" name="password">
                                    </div>
                                </div>
                                <div class="col-md-2 offset-md-5">
                                    <button type="submit" id="submit"
                                            style="background-color: #d0cece; border-color: #6882a4" ;
                                            class="btn btn-primary">
                                        ログインする
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div>
                        <p class="phara" id="error2">パスワードを省略することはできません</p>
                    </div>
                    <div>
                        <p class="phara" id="error1">メールアドレス、もしくはパスワードが間違っています</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</main>
<script src="js/login.js"></script>
</body>
</html>