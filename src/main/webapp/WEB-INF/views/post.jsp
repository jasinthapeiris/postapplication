<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <link href="/css/signin.css" rel="stylesheet" type="text/css">
    

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
	
</style>

    <title>Post</title>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light navbar-laravel">
        <div class="container">
            <a class="navbar-brand" href="#">Post</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
    
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#">user name</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">logout</a>
                    </li>
                </ul>
    
            </div>
        </div>
    </nav>

    
    <div class="container">
        <main class="post-form">
            <div class="cotainer">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-body">
                                
                                
                                <form action="" method="">

                                    <table style="width:100%">
                                        <tr>
                                          <td><label for="email_address" class="col-md-10 col-form-label text-md-right">Speaker</label></td>
                                          <td>Sugiyama (Name)</td>
                                        </tr>
                                        <tr style="height:200px">
                                          <td><label for="email_address" class="col-md-10 col-form-label text-md-right">Content</label></td>
                                          <td> <textarea class="form-control" id="exampleFormControlTextarea1" placeholder="Message" rows="7"></textarea></td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <button style="margin-left: 30px; width: 95px; " type="submit" class="btn btn-primary" value="">Write in</button>
                                            <button style="margin-left:10px; width: 95px" hidden type="button" class="btn btn-success">Edit</button>
                                            <button type="button" style="width: 95px" hidden class="btn  btn-secondary">Back</button>
                                        </td>
                                        </tr>
                                      </table>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            
            <table class="table table-striped table-bordered" id="myTable">
                <thead>
                <tr><th>Name</th><th>Email</th><th>Password</th></tr>
                </thead>
                <tbody>
                <tr><td>Daniel mailto:danny</td><td>danny.daniel@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>samuel</td><td>samuel@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>jack</td><td>jack@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>eureka</td><td>eureka@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>pinky</td><td>pinky@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>mishti</td><td>mishti@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>puneet</td><td>puneet@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>nick</td><td>nick@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>danika</td><td>danika@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>vishakha</td><td>vishakha@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>nitin</td><td>ni3@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>latika</td><td>latika@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>kaavya</td><td>kaavya@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>ishika</td><td>ishika@gmail.com</td><td>Pass1234</td></tr>
                <mailto:tr><td>veronika</td><td>veronika@gmail.com</td><td>Pass1234</td></tr>
                </tbody>
                </table>

            </div>
              
            <script>
                $(document).ready( function () {
                $('#myTable').DataTable();
            } );
                </script>

</main>

</body>
</html>