

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
    <link rel="stylesheet" href="https://cdn.datatables.net/1.12.1/css/dataTables.bootstrap4.min.css">


     <!-- Bootstrap CSS -->
     
     <link rel="stylesheet" href="https://cdn.datatables.net/1.12.1/css/dataTables.bootstrap5.min.css">


    <title>Login</title>
    <script>$(document).ready(function () {
        $('#example').DataTable();
    });</script>
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


            
            <table id="postTable" class="table table-striped table-bordered" style="width:100%">
                <thead>
                    <tr>
                        <th>Post Id</th>
                        <th>Posted Date</th>
                        <th>Message</th>
                        <th>Action</th>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>2003/05/06</td>
                        <td>Edinburgh</td>
                        <td>
                            <button type="button" class="btn btn-success">Edit</button>
                            <button type="button" class="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>2003/05/06</td>
                        <td>Tokyo</td>
                        <td>
                            <button type="button" class="btn btn-success">Edit</button>
                            <button type="button" class="btn btn-danger">Delete</button>
                        </td>
                    </tr>
   
                </tbody>
            </table>

            </div>

</main>

</body>
</html>