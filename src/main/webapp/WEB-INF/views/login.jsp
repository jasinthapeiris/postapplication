<%@ page language="java" contentType="text/html; charset=utf-8"
pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="css/signin.css" rel="stylesheet">

    <!-- Fonts -->
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Raleway:300,400,600" rel="stylesheet" type="text/css">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">

    <title>Login</title>
    
    
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

.my-form
{
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
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

.card-header1 {

  text-align: center !important;
}

.navbar-toggler-icon{
  display: inline !important;
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
</style>
</head>
<body> 
<nav class="navbar navbar-expand-lg navbar-light navbar-laravel" style="background-color: #d0cece;">
    <div class="container">
        <a class="navbar-brand">ポストアプリケーション</a>
    </div>
</nav>
    <div class="container">
<main class="login-form">
    <div class="cotainer">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header center" style="background-color: #e1ebf7; text-align: center;" >ログイン認証</div>
                    <div class="card-body">
                        <form action="" method="">
                            <div class="form-group row">
                                <label for="email_address" class="col-md-4 col-form-label text-md-right">メールアドレス</label>
                                <div class="col-md-6">
                                    <input type="text" id="email_address" class="form-control" name="email-address">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password" class="col-md-4 col-form-label text-md-right">パスワード</label>
                                <div class="col-md-6">
                                    <input type="password" id="password" class="form-control" name="password">
                                </div>
                            </div>
                            <div class="col-md-2 offset-md-5">
                                <button type="submit" style="background-color: #d0cece; border-color: #6882a4"; class="btn btn-primary">
                                  ログインする
                                </button>
                            </div>
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