<?php
require 'credentials.php';

$latitude = $_POST["lat"];
$longitude = $_POST["lng"];
$user = $_POST["user"];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO locations (user, lat, lng) VALUES ($user, $latitude, $longitude)";

if ($conn->query($sql) === TRUE) {
    echo "202";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>