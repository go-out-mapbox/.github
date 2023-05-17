<?php
$source_file = "submit.csv";
$ip = $_SERVER["REMOTE_ADDR"];

define("LOGFILE", $source_file);
$data = json_decode(file_get_contents("php://input"), true);

$output = array(
  $data["geolocation"],
  $data["address"],
  $data["timestamp"],
  $data["comment"],
  $ip
);

$result = implode(',', $output);
file_put_contents(LOGFILE, $result."\n", FILE_APPEND | LOCK_EX);
echo json_encode($output);
?>