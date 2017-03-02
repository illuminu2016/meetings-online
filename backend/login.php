<?php
require 'credentials.php';

$user = $_POST["username"];
$pass = $_POST["password"];

// Create connection
$conn = mysql_connect($servername, $username, $password);

if(! $conn )
{
  die('Could not connect: ' . mysql_error());
}

mysql_select_db($dbname);

$sql = "SELECT * FROM login WHERE username = '$user'";
$retval = mysql_query($sql, $conn);

if(!$retval)
{
  http_response_code(404);
  die();
}

$num_rows = mysql_num_rows($retval);
if($num_rows) {
    while($row = mysql_fetch_array($retval, MYSQL_ASSOC))
    {
        if($row['password'] == $pass) {
            echo '202';
        } else {
            http_response_code(404);
            //include('my_404.php'); // provide your own HTML for the error page
            die();
        }
    }

    mysql_close($conn);
}
else {
  http_response_code(404);
  die();
}
?>