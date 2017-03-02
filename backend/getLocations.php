<?php
require 'credentials.php';

// Create connection
$conn = mysql_connect($servername, $username, $password);

if(! $conn )
{
  die('Could not connect: ' . mysql_error());
}

mysql_select_db('b18_19542425_events');

$sql = " SELECT * FROM locations WHERE id IN (SELECT MAX(id) FROM locations GROUP BY user)";
$retval = mysql_query( $sql, $conn );

if(! $retval )
{
  die('Could not get data: ' . mysql_error());
}

$data = array();
while($row = mysql_fetch_array($retval, MYSQL_ASSOC))
{
    $data[] = $row;
}

echo json_encode($data);

mysql_close($conn);
?>