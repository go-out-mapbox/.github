<?php
mb_language("ja");
mb_internal_encoding("UTF-8");
date_default_timezone_set('Asia/Tokyo');

$source_file = "date/". date("Y") .".json";
$ip = $_SERVER["REMOTE_ADDR"];

define("LOGFILE", $source_file);
$data = json_decode(file_get_contents("php://input"), true);

// JSONファイルの確認
if(!file_exists(LOGFILE)) {
  file_put_contents(LOGFILE, "[]");
}

$json = file_get_contents(LOGFILE);
$a = json_decode($json);
if(!is_array($a)) { $a = array(); }
array_unshift($a, array(
  "type" => 'Feature',
  "geometry" => array(
    "type" => 'Point',
    "coordinates" => '['. $data["longitude"].', '. $data["latitude"]. ']',
  ),
  "properties" => array(
    "title" => $data["longitude"].", ". $data["latitude"],
    "address" => '"'.$data["address"].'"',
    "date" => '"'.$data["date"].'"',
    "timestamp" => '"'.$data["timestamp"].'"',
    "ip" => '"'.$ip.'"',
    "tags" => 'marker',
  )
);

$json = json_encode( $a, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES )
file_put_contents(LOGFILE, $json FILE_APPEND | LOCK_EX);
echo json_encode($output);
?>
