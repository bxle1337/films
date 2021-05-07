<?php 
//ini_set('error_reporting', E_ALL);
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
header("Access-Control-Allow-Origin: *");
include('bd.php');
if(isset($_GET['key'])){
	$key = base64_decode($_GET['key']);
	$url = "https://{$_SERVER['HTTP_HOST']}$key";
    $client_secret = 'gTUcxN2Jntcebrdx0UG2'; //Защищённый ключ из настроек вашего приложения

    $query_params = [];
    parse_str(parse_url($url, PHP_URL_QUERY), $query_params); // Получаем query-параметры из URL

    $sign_params = [];
    foreach ($query_params as $name => $value) {
        if (strpos($name, 'vk_') !== 0) { // Получаем только vk параметры из query
          continue;
        }
        $sign_params[$name] = $value;
    }

    ksort($sign_params); // Сортируем массив по ключам
    $sign_params_query = http_build_query($sign_params); // Формируем строку вида "param_name1=value&param_name2=value"
    $sign = rtrim(strtr(base64_encode(hash_hmac('sha256', $sign_params_query, $client_secret, true)), '+/', '-_'), '='); // Получаем хеш-код от строки, используя защищеный ключ приложения. Генерация на основе метода HMAC.

    $status = $sign === $query_params['sign']; // Сравниваем полученную подпись со значением параметра 'sign'

    if($status != 1){
    	$id = $query_params['vk_user_id'];
    	exit();
    	echo "Bad Key";
    }else{
    	$id = $query_params['vk_user_id'];
    }
}else{
	echo "Bad Key";
	exit();
}

                        if(isset($_GET['action'])){
							$action = $_GET['action'];
							if($action == "getfilm"){
							$response = GetFilm();
							echo $response;
							exit();
						}else if($action == "getfavorite"){
							$array = GetFavorite($link, $id);
							echo json_encode($array);
							exit();
						}else if($action == "save"){
							$idfilm = $_GET['id'];
							if(!is_numeric($idfilm)){
								echo json_encode(array("text" => "Ошибка", "photo" => "https://i.imgur.com/H6s4jwu.png"));
								exit();
							}
							$check = mysqli_query($link, "SELECT Count(*) FROM films WHERE idfilm = $idfilm and owner = $id")->fetch_assoc()["Count(*)"];
							if($check > 0){
								echo json_encode(array("text" => "Фильм уже в закладках", "photo" => "https://i.imgur.com/H6s4jwu.png"));
								exit();
							}
							$headers = array(
								'accept: application/json',
								'X-API-KEY: dd92e76d-9b11-4de0-830b-651885df128b'
							);
							$ch = curl_init("https://kinopoiskapiunofficial.tech/api/v2.1/films/$idfilm");
							curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
							curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
							curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
							$response = curl_exec($ch);
							curl_close($ch);
							$response = json_decode($response);
							$name = $response->data->nameRu;
							$linkfilm = $response->data->webUrl;
							$filmid = $response->data->filmId;
							$photo = $response->data->posterUrlPreview;
							if(!is_numeric($filmid)){
								echo json_encode(array("text" => "Ошибка", "photo" => "https://i.imgur.com/H6s4jwu.png"));
								exit();
							}else{
								$time = time();
								mysqli_query($link, "INSERT INTO `films`(`owner`, `name`, `link`, `idfilm`, `photo`, `date`) VALUES ($id,'$name','$linkfilm',$filmid,'$photo', $time)");
							echo json_encode(array("text" => "Добавлено", "photo" => "https://i.imgur.com/OLJWB7x.png"));
							exit();
							}	
						}
						}						
						
						
						
						
function GetFilm(){
$ganres = array(1750, 22, 3, 13, 19, 17, 456, 20, 12, 8, 27, 23, 6, 15, 16, 7, 14, 10, 11, 4, 1, 2, 5);
$orders = array("RATING", "NUM_VOTE", "YEAR");
$randganres = $ganres[rand(0, 22)];
$randorders = $orders[rand(0, 2)];
$randyears = rand(2000, 2020);
$randpages = rand(1, 3);
$url = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-filters?genre=$randganres&type=FILM&order=$randorders&ratingFrom=6&ratingTo=10&yearFrom=2000&yearTo=$randyears&page=$randpages";
$headers = array(
	'accept: application/json',
	'X-API-KEY: dd92e76d-9b11-4de0-830b-651885df128b'
);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$response = curl_exec($ch);
$response = json_decode($response);
$data = $response->films;
	$r = rand(0, 19);
	$id = $data[$r]->filmId;
	             if(!is_numeric($id)){
					echo json_encode(array("error" => "error"));
					exit();
				 }
$url = "https://kinopoiskapiunofficial.tech/api/v2.1/films/$id?append_to_response=RATING";				 
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$response = curl_exec($ch);
curl_close($ch);
return $response;
}

function GetFavorite($link, $id){
									$result = array();
									$rows = mysqli_query($link, "SELECT * FROM `films` WHERE owner = $id ORDER BY date DESC LIMIT 1000");
									while($row = $rows->fetch_array()) {
										$time = time() - $row['date'];
										if($time < 3600){
											$time = round($time / 60) . " мин. назад";
										}else if ($time > 3600 and $time < 86400){
											$time = round($time / 3600) . "ч. назад";
										}else if ($time > 86400 and $time < 172800){
											$time = date("Вчера в H:i", $row['time']);
										}else if ($time > 172800){
											$time = date("d.m в H:i", $row['time']);
										}
										$array = array(array("idfilm" => $row['idfilm'], "name" => $row['name'], "link" => $row['link'], "photo" => $row['photo'], "time" => $time));
										array_push($result, $array);
									}
									return $result;
							}
?>