<?php
require 'credentials.php';

$latitude = $_POST["lat"];
$longitude = $_POST["lng"];
$genre = $_POST["genre"];
$user = $_POST["user"];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "UPDATE locations SET lat=$latitude, lng=$longitude, genre='$genre'  WHERE user='$user'";

if ($conn->query($sql) === TRUE) {
    echo "202";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>