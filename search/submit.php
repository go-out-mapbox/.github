<?php
mb_language("ja");
mb_internal_encoding("UTF-8");
date_default_timezone_set('Asia/Tokyo');

$year = date("Y");
$month = date("m");

$source_file = "../date/". $year . $month .".csv";
$ip = $_SERVER["REMOTE_ADDR"];

define("LOGFILE", $source_file);
$data = json_decode(file_get_contents("php://input"), true);

$output = array(
  $data["longitude"],
  $data["latitude"],
  '"'. $data["address"] .'"',
  '"'. $data["date"] .'"',
  '"'. $data["timestamp"] .'"',
  '"'. $ip .'"'
);

$result = implode(',', $output);
file_put_contents(LOGFILE, $result."\n", FILE_APPEND | LOCK_EX);
echo json_encode($output);
?>
