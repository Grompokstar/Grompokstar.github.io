<?
$referer = getenv("HTTP_REFERER");
if (!preg_match("/http:\/\/electrodon.ru/i",$referer) && !preg_match("/https:\/\/electrodon.ru/i",$referer)) {
    //exit("hacker?");
}

session_start();

header("Content-Type: text/html; charset=utf-8");

if ((isset($_REQUEST['key'])) && ($_REQUEST['key'] == md5("electrodon"))) {

}
else {
	//exit("hacker?");
}

//Подключаем конфиг
include_once('engine/config.php');

$error_auth = "";

//Подключаем классы
if ($handle = opendir($main["classes_dir"])) {
	while (false !== ($file = readdir($handle))){
		if (is_file($main["classes_dir"]."/".$file)){
			if (preg_match('/^class.[\w_-]+.php$/i',$file)){
				include_once($main["classes_dir"]."/".$file);
			}
		}
	}
}

$mysql = new mysql();
$mysql->connect($main["host"],$main["db"],$main["user"],$main["pass"]);

$cls_modules = new modules();
$cls_user = new user();

//Подключаем WideImage
require_once($main['home_path'].'/engine/WideImage/WideImage.php');

foreach ($system as $system_key=>$system_value){
    $main[$system_key] = $system_value;
}

function my_json_encode($arr){
	$parts = array();
	if (!is_array($arr)) return;
	if (count($arr) === 0) return '{}';

	$keys = array_keys($arr);
	foreach($keys as $key)	{
		if (is_array($arr[$key])) {
			$parts[] = '"' . $key . '":' . json_encode($arr[$key]);
		}
		else{
			$str = '"'.$key.'":';
			$str .= '"'.$arr[$key].'"';
			//if (is_numeric($arr[$key])) $str .= $arr[$key]; //Numbers
			//elseif ($arr[$key] === false) $str .= 'false'; //The booleans
			//elseif ($arr[$key] === true) $str .= 'true';
			//else $str .= '"'.strtr($arr[$key], array('\\'=>'\\\\', '/'=>'\/', '"'=>'\"', "\b"=>'\b', "\t"=>'\t', "\n"=>'\n', "\f"=>'\f', "\r"=>'\r')).'"';
			$parts[] = $str;
		}
	}
	return '{'.implode(',', $parts).'}';
}

function multidimensionalArrayMap($arr){
	$newArr = array();
	foreach($arr as $key => $value){
		$newArr[$key] = (is_array($value) ? multidimensionalArrayMap($value) : iconv("windows-1251","UTF-8",$value));
  }
	return $newArr;
}

if (isset($_REQUEST['type'])) {

    if ($_POST['type'] == "print_orders") {
        $tags = $mysql->query("select * from products where visible = 1 and categories in(221, 222, 223, 224, 225, 226, 228, 273, 274, 329, 330) order by position desc, name");
        $tags = $cls_modules->get_info_products($tags);

        $str = "";
        $str .= "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
                <html>
                <head>
                <meta http-equiv='content-type' content='text/html;charset=utf-8' charset='utf-8' />
                <link href='/view/style.css' rel='stylesheet' type='text/css' />
                <title>Печать ценников</title>
                </head>
                <body style='font-size:13px'>";

                $n = 1;
                for($i=0;count($tags)>$i;$i++){
                    $str .= "<div class='admin_tags'>
                                <div class='admin_tags_item'>";
                            $str .= "<div class='admin_tags_item_str_1'>Магазин \"\"</div>";
                            $str .= "<div class='admin_tags_item_str_3'>".$tags[$i]['brand_name']."</div>";
                            $str .= "<div class='admin_tags_item_str_2'>".$tags[$i]['name']."</div>";
                            $str .= "<div class='admin_tags_item_str_4'>Цена: ".number_format($tags[$i]['price'], 0, "", " ")." руб/м<sup>2</sup></div>";
                            $str .= "<div class='admin_tags_item_str_5'>по карте: ".number_format($tags[$i]['price']*0.95, 2, ".", " ")." руб/м<sup>2</sup></div>";
                            $str .= "<div class='admin_tags_item_str_6'>ИП  ".date("d.m.Y")."</div>";
                        $str .= "</div>
                            </div>";

                    if ($n == 12){
                        $str .= "<div class='page_break'></div>";
                    }
                    $n++;

                    if ($n == 13){
                        $n = 1;
                    }
                }
                $str .= "</body></html>";

        echo $str;
    }

    if ($_REQUEST['type'] == "get_main_search") {
		$result = $mysql->query("select name from products where (name like '".$_REQUEST['string']."%' or sku like '".$_REQUEST['string']."%') and visible > 0 order by name limit 0,15");
		echo my_json_encode($result);
	}

    if ($_REQUEST['type'] == "set_rating") {
		$mysql->query("insert into rating set product='".$_REQUEST['product_id']."', rating='".$_REQUEST['rating']."'",1);
    }

    if ($_REQUEST['type'] == "get_rating") {
		$rating = $mysql->query("select avg(rating) as rating,count(id) as count from rating where rating.product='".$_REQUEST['product_id']."'");
        $rating = $rating[0];

        $str='<div class="rate-wrapper align-inline">';

        $str.='<i onclick="set_rating('.$_REQUEST['product_id'].',1)" class="fa ';
        if($rating['rating']>=1){
            $str.='fa-star';
        }else{
            $str.='fa-star-o';
        }
        $str.='" aria-hidden="true"></i>';
        $str.='<i onclick="set_rating('.$_REQUEST['product_id'].',2)" class="fa ';
        if($rating['rating']>1){
            $str.='fa-star';
        }else{
            $str.='fa-star-o';
        }
        $str.='" aria-hidden="true"></i>';
        $str.='<i onclick="set_rating('.$_REQUEST['product_id'].',3)" class="fa ';
        if($rating['rating']>2){
            $str.='fa-star';
        }else{
            $str.='fa-star-o';
        }
        $str.='" aria-hidden="true"></i>';

        $str.='<i onclick="set_rating('.$_REQUEST['product_id'].',4)" class="fa ';
        if($rating['rating']>3){
            $str.='fa-star';
        }else{
            $str.='fa-star-o';
        }
        $str.='" aria-hidden="true"></i>';
        $str.='<i onclick="set_rating('.$_REQUEST['product_id'].',5)" class="fa ';
        if($rating['rating']>4){
            $str.='fa-star';
        }else{
            $str.='fa-star-o';
        }
        $str.='" aria-hidden="true"></i>';
        $str.='</div>';
        $str.='<div class="sa small dark align-inline">'.$rating['count'].' '.$cls_modules->modify_word($rating['count'],'Голосов','Голос','Голоса').'</div>';

		echo $str;
	}

    if ($_REQUEST['type'] == "get_options") {
		$result = $mysql->query("select value from options where feature_id = '".$_REQUEST['feature_id']."' and value like '%".$_REQUEST['string']."%' group by value order by value");
		echo my_json_encode($result);
	}

   if ($_REQUEST['type'] == "get_options_prod") {
		$result = $mysql->query("select name,id from products where visible=1 and name  like '%".$_REQUEST['string']."%' group by name order by name limit 10 ");
		echo my_json_encode($result);
	}

	if ($_REQUEST['type'] == "restore_pass") {
        $phone = preg_replace("/[^0-9]+/", "", $_REQUEST['phone']);
        $user = $mysql->query("select id from users where mobile = '$phone' and access = 1 limit 0,1");
        if(!empty($user)){
            $code = rand(111111,999999);
            $mysql->query("update users set pass = MD5('$code') where id = '$user' and access = 1");
            $sms_text="Пароль на сайте ".$main['site_name']." изменен. Новый пароль: $code";
            $target='+'.$phone;
            $sender_name=$main['sms_sender'];
            //$sms= new BEESMS($main['sms_login'],$main['sms_pass']);
            //$result = $sms->post_message($sms_text, $target, $sender_name);
            $return = array("response" => "ok", "message" => "");
        }
        else{
            $return = array("response" => "error", "message" => "");
        }

        echo my_json_encode($return);
    }

    if ($_REQUEST['type'] == "send_mail" || $_REQUEST['type'] == "send_callback" || $_REQUEST['type'] == "service" || $_REQUEST['type'] == "one_click" || $_REQUEST['type'] == "feedback" || $_REQUEST['type'] == "enroll") {
        $email_message = "";
        if($_REQUEST['type'] == "one_click"){
            $phone = $cls_modules->purifier($_POST['phone_click'],4);
            $product_name_click = $cls_modules->purifier($_POST['product_name_click'],4);
            $subject = "Купить в 1 клик";
            $email_message =  "Пользователь хочет купить товар: ".$product_name_click."<br />";
            $email_message .=  "Телефон: ".$phone."<br />";
        }elseif($_REQUEST['type'] == "feedback"){
            $phone = $cls_modules->purifier($_POST['phone'],4);
            $name = $cls_modules->purifier($_POST['name'],4);
            $subject = "Обратный звонок. ";
            $email_message =  "Пользователь: ".$name."<br />; ";
            $email_message .=  "Телефон: ".$phone."<br />";
        }elseif($_REQUEST['type'] == "enroll"){
            $phone = $cls_modules->purifier($_POST['phone'],4);
            $name = $cls_modules->purifier($_POST['name'],4);
            $subject = "Заявка на обратный звонок. ";
            $email_message =  "Пользователь: ".$name."<br />; ";
            $email_message .=  "Телефон: ".$phone."<br />";
        }elseif($_REQUEST['type'] == "service"){
            $phone = $cls_modules->purifier($_POST['phone'],4);
            $name = $cls_modules->purifier($_POST['name'],4);
            $service = $cls_modules->purifier($_POST['service'],4);
            $subject = "Заявка на услугу: ".$service.'. ';
            $email_message =  "Пользователь: ".$name."<br />";
            $email_message .=  "Телефон: ".$phone."<br />";
            $email_message .=  "Услуга: ".$service."<br />";
        }else{
            $phone = $cls_modules->purifier($_POST['phone'],4);
            $name = $cls_modules->purifier($_POST['name'],4);
            $email_message = "Пользователь: ".$name."<br />";

            if( !empty($_POST['email'])){
                $email = $cls_modules->purifier($_POST['email'],4);
                $email_message .= "Email: ".$email."<br />";
            }
            if( !empty($_POST['message'])){
                $message = $cls_modules->purifier($_POST['message'],4);
                $email_message .= "Сообщение: ".$message."<br />";
            }
            $email_message .= "Телефон: ".$phone."<br />";
            if(!empty($_REQUEST['make'])){
                $subject = 'сделай по-своему';
            }else{
                $subject = 'Обратный звонок';
            }
        }

        if(!empty($email_message)){
            $send_to = 'beauty.nargiza@yandex.ru';
            $cls_modules->send_mail($send_to, $subject, $email_message);

            $target =  '+'.preg_replace("/[^0-9]+/", "", $main["sms_info"]);
            $sender_name = $main['sms_sender'];
            $sms = new BEESMS($main['sms_login'],$main['sms_pass']);
            //$result = $sms->post_message(strip_tags($subject.' '.$email_message), $target, $sender_name);
            $return = array("response" => "ok");
        } else{
            $return = array("response" => "error");
        }

        echo my_json_encode($return);
    }

    if ($_REQUEST['type'] == "register_user_comp") {
        $code = rand(111111,999999);
        $mobile = preg_replace("/[^0-9]+/", "", $_REQUEST['mobile']);
        $name = $cls_modules->purifier($_POST['name'],2);
        $address = $cls_modules->purifier($_POST['address'],2);
        $mail = $cls_modules->purifier($_POST['mail'],2);
        $inn =  $cls_modules->purifier($_POST['inn'],2);
        $company = $cls_modules->purifier($_POST['company'],2);
        $index_u = $cls_modules->purifier($_POST['index_u'],2);
        $company_city_u = $cls_modules->purifier($_POST['company_city_u'],2);
        $company_addr_u = $cls_modules->purifier($_POST['company_addr_u'],2);
        $index_f = $cls_modules->purifier($_POST['index_f'],2);
        $company_city_f = $cls_modules->purifier($_POST['company_city_f'],2);
        $company_addr_f = $cls_modules->purifier($_POST['company_addr_f'],2);
        if(!empty($_POST['kpp_f'])){
            $kpp_f = $cls_modules->purifier($_POST['kpp_f'],2);
        }else{
            $kpp_f='';
        }

        if(!empty($_POST['company_bank'])){
            $company_bank = $cls_modules->purifier($_POST['company_bank'],2);
        }else{
            $company_bank='';
        }

        if(!empty($_POST['company_bank_city'])){
            $company_bank_city = $cls_modules->purifier($_POST['company_bank_city'],2);
        }else{
            $company_bank_city='';
        }

        if(!empty($_POST['company_bank_bik'])){
            $company_bank_bik = $cls_modules->purifier($_POST['company_bank_bik'],2);
        }else{
            $company_bank_bik='';
        }

        if(!empty($_POST['company_bank_bill'])){
            $company_bank_bill = $cls_modules->purifier($_POST['company_bank_bill'],2);
        }else{
            $company_bank_bill='';
        }

        if(!empty($_POST['company_bank_rs'])){
            $company_bank_rs = $cls_modules->purifier($_POST['company_bank_rs'],2);
        }else{
            $company_bank_rs='';
        }

        if ($mobile != "" && $inn!='' ){
            $user_ex = $mysql->query("select * from users where mobile  = '".$mobile."' and inn=$inn limit 0,1");
            if($user_ex){
               $return = array("response" => "error", "message" => 'Компания с таким ИНН и телефоном уже существует');
               echo my_json_encode($return);
            }else{
                if ($id_user = $cls_user->register($mobile,$code,$name,$mail)){
                    $mysql->query("update users set inn = '$inn', company = '$company',address='$address', index_u = '$index_u',company_city_u = '$company_city_u', company_addr_u = '$company_addr_u', index_f = '$index_f',company_city_f = '$company_city_f', company_addr_f = '$company_addr_f', company_addr_u = '$company_addr_u', kpp_f = '$kpp_f', company_bank = '$company_bank', company_bank_city = '$company_bank_city', company_bank_bik = '$company_bank_bik', company_bank_bill = '$company_bank_bill', company_bank_rs = '$company_bank_rs' where id = '".$id_user."'");
                    $sms_text="Вы зарегистрированы на сайте ".$main['site_name'].". Ваш пароль: $code";
                    $target='+'.$mobile;
                    $sender_name=$main['sms_sender'];
                    $sms= new BEESMS($main['sms_login'],$main['sms_pass']);
                    //$result = $sms->post_message($sms_text, $target, $sender_name);
                    if (!empty($mail)){
                       $send_to = $mail;
                       $subject = 'Поздравляем с регистрацией';
                       $cls_modules->send_mail($send_to, $subject, $sms_text);
                    }

                    $return = array("response" => "ok", "message" => "Поздравляем с регистрацией. На ваш номер должна прийти смс с паролем.");
                    echo my_json_encode($return);
                }
                else{
                    $return = array("response" => "error", "message" => $error_auth);
                    echo my_json_encode($return);
                }
           }
        }
	}
    if ($_REQUEST['type'] == "register_user") {
        $code = rand(111111,999999);
        $phone_reg = preg_replace("/[^0-9]+/", "", $_REQUEST['phone_reg']);
        $name_reg = $cls_modules->purifier($_POST['name_reg'],2);
        $email_reg = $cls_modules->purifier($_POST['email_reg'],2);

        if ($phone_reg != ""){
            if ($id_user = $cls_user->register($phone_reg,$code,$name_reg,$email_reg)){
                $sms_text="Вы зарегистрированы на сайте ".$main['site_name'].". Ваш пароль: $code";
                $target='+'.$phone_reg;
                $sender_name=$main['sms_sender'];
                $sms= new BEESMS($main['sms_login'],$main['sms_pass']);
                //$result = $sms->post_message($sms_text, $target, $sender_name);
                if (!empty($email_reg)){
                   $send_to = $email_reg;

                    $subject = 'Поздравляем с регистрацией';
                    $cls_modules->send_mail($send_to, $subject, $sms_text);
                }
                $return = array("response" => "ok", "message" => "Поздравляем с регистрацией. На ваш номер должна прийти смс с паролем.");
                echo my_json_encode($return);
            }
            else{
                $return = array("response" => "error", "message" => $error_auth);
                echo my_json_encode($return);
            }
        }
	}

    if ($_REQUEST['type'] == "auth_user") {
        $phone = preg_replace("/[^0-9]+/", "", $_REQUEST['phone']);
        $pass =  $_REQUEST['pass'];

        if (($phone != "") && ($pass != "")){
            if ($cls_user->auth($phone,$pass)){
                $return = array("response" => "ok", "message" => "Успешная авторизация");
                echo my_json_encode($return);
            }
            else{
                $return = array("response" => "error", "message" => $error_auth);
                echo my_json_encode($return);
            }
        }
        else{
            $return = array("response" => "error", "message" => 'Ошибка');
            echo my_json_encode($return);
        }
	}

    if ($_REQUEST['type'] == "get_kcaptcha") {
		if(isset($_SESSION['captcha_keystring']) && $_SESSION['captcha_keystring'] === $_POST['keystring']){
			$return = array("response" => "ok", "message" => "");
			echo my_json_encode($return);
		}else{
			$return = array("response" => "error_captcha", "message" => "");
			echo my_json_encode($return);
		}
	}

    if ($_REQUEST['type'] == "get_count_cart") {
        $count = count($_SESSION['cart']);
        $count_cart =0;
        if (intval($count) > 0){
            foreach($_SESSION['cart'] as &$item){
                $count_cart = $count_cart+$item['count'];

            }
            echo intval($count_cart);
        }
        else{
            echo 0;
        }
	}

    if ($_REQUEST['type'] == "get_price_cart") {
        $count = count($_SESSION['cart']);
        $price_cart =0;
        if (intval($count) > 0){
            foreach($_SESSION['cart'] as &$item){
                $product = $mysql->query("select * from products where id = '".$item['product_id']."'");
                $product = $product[0];
                if($_SESSION['user']['inn']==''){
                    if($product['stock']>0 && $product['discount']==1){
                        $product_price = $product['stock'];
                    }else{
                        $product_price = $product['price'];
                    }
                }else{
                    $product_price = $product['price_opt'];
                }


                $price_cart = $price_cart+$product_price * $item['count'];

            }
            echo intval($price_cart);
        }
        else{
            echo 0;
        }
	}
    if ($_REQUEST['type'] == "get_list_cart") {
        $str = ' <a class=" " href="'.$main['url'].'/checkout"><h6 class="uppercase">Корзина</h6></a>
                <hr>
                <ul class="cart-overview">';
        $total_price = 0;
        $total_price_all = 0;
        if (count($_SESSION['cart'])>0){
            foreach($_SESSION['cart'] as &$item){
                $product = $mysql->query("select * from products where id = '".$item['product_id']."'");
                $product = $product[0];
               if($_SESSION['user']['inn']==''){
                    if($product['stock']>0 && $product['discount']==1){
                        $item['product_price'] = $product['stock'];
                    }else{
                        $item['product_price'] = $product['price'];
                    }
                }else{
                    $item['product_price'] = $product['price_opt'];
                }

                $total_price_all = $total_price_all + $item['product_price'] * $item['count'];
                $total_price = $item['product_price'] * $item['count'];

                $str = $str.'<li>
                                    <div class="row product_info">
                                        <div class="col-md-4 col-xs-4">
                                            <a href="'.$main['url'].'/product/'.$product['url'].'"><img alt="'.$product['name'].'" src="'.$main['url'].'/view/images/products/'.$product['id'].'/'.$product['id'].'.jpg" /></a>
                                        </div>
                                        <div class = "col-md-6 col-xs-6">
                                            <a href="'.$main['url'].'/product/'.$product['url'].'">
                                                <span class="color_black display-block product-title semibold">'.$product['name'].'</span>
                                                <span class="color_black">'.$item['count'].' x <span class="color_black product-title price semibold">'.number_format($item['product_price'], 0, ',', ' ').'</span> = <span class="color_black product-title semibold price extra_bold">'.number_format($total_price, 0, ',', ' ').'</span></span>
                                            </a>
                                        </div>
                                        <div class = "col-md-1 col-xs-1">
                                            <input class ="cart_product_id" type="hidden" value="'.$product['id'].'">
                                            <a href="javascript:void(0);" class="remove-link">x</a>
                                        </div>
                                    </div>
                                </a>
                            </li>
                	       ';

            }
            $str = $str.'</ul>
                            <div class="">
                                <hr>
                                <div class="row">
                                    <div class="col-md-12">
                                        <span class="color_black  uppercase cart-total bold">Итого: </span>
                                        <span class="mb16 color_black uppercase price bold color_black">'.number_format($total_price_all, 0, ',', ' ').'</span>
                                    </div>
                                    <div class="col-md-12">
                                        <a class="btn btn-lg btn-filled checkout_btn " href="'.$main['url'].'/checkout">Оформить заказ</a>
                                    </div>
                                </div>
                            </div>';
        }else{
             $str ='<span class=" display-block semibold">Корзина пуста</span>';
        }
        echo $str;
	}

    if ($_REQUEST['type'] == "change_count_cart_admin") {
        $order_id = $cls_modules->purifier($_POST['order_id'],2);
        $product = $cls_modules->purifier($_POST['product'],2);
        $count = $cls_modules->purifier($_POST['count'],2);
        $price = $cls_modules->purifier($_POST['price'],2);
        $mysql->query("update orders_detail set price ='".$price."' , count ='".$count."' where product_id= '".$product."' and order_id = '".$order_id."'");

    }

    if ($_REQUEST['type'] == "delete_product_admin") {
        $order_id = $cls_modules->purifier($_POST['order_id'],2);
        $product = $cls_modules->purifier($_POST['product'],2);
        $mysql->query("delete from orders_detail where product_id= '".$product."' and order_id = '".$order_id."'");
    }


    if ($_REQUEST['type'] == "new_prod_add_admin") {
        $order_id = $cls_modules->purifier($_POST['order_id'],2);
        $product = $cls_modules->purifier($_POST['product'],2);

        $product_info = $mysql->query("SELECT * FROM `products` WHERE `id` = '".$product."'");
        $product_info= $product_info[0];

        $product_in_ord = $mysql->query("SELECT * FROM `orders_detail` WHERE `product_id` = '".$product."'");
        if($_SESSION['user']['inn']==''){
            if($product_info['stock']>0 && $product_info['discount']==1){
                $price = $product_info['stock'];
            }else{
                $price = $product_info['price'];
            }
        }else{
            $price = $product_info['price_opt'];
        }
        if(count($product_in_ord)==0){
           $mysql->query("insert into orders_detail set product_id= '".$product."' , order_id = '".$order_id."', count =1,price = '".$price."'");
        }

    }
    if ($_REQUEST['type'] == "apply_disc") {
        $order_id = $cls_modules->purifier($_POST['order_id'],2);
        $discount = $cls_modules->purifier($_POST['discount'],2);
        $mysql->query("update orders set discount= '$discount' where id = '$order_id' ");
    }
    if ($_REQUEST['type'] == "get_cart_order_admin") {
        $str ='';
        $total = 0;
        $order_id = $cls_modules->purifier($_POST['order_id'],2);
        $disc = $mysql->query("select discount  from orders where id = '$order_id' limit 0,1");
        $orders_details = $mysql->query("select * ,(select name from products where products.id=orders_detail.product_id) as prod_name from orders_detail where order_id = '$order_id'");
            foreach ($orders_details as $key => &$orders_detail) {
                if ($disc>0){
                    $orders_detail['price']=$orders_detail['price']-($orders_detail['price']*$disc/100);
                }
                var_dump($orders_detail['price']);
                $total = $total+$orders_detail['price']*$orders_detail['count'];
                $str .='
                <tr>
                    <input type="hidden" class="prod_id" value="'.$orders_detail['product_id'].'" />
                    <td align="center" width="100"><img src="'.$main['url'].'/view/images/products/'.$orders_detail['product_id'].'/'.$orders_detail['product_id'].'.jpg" width="80" /></td>
                    <td>'.$orders_detail['prod_name'].'</td>
                    <td align="center" width="80"><input style="width:200px;" type="number" id="count_prod" class="change_prod" name="count_prod" value="'.$orders_detail['count'].'"/></td>
                    <td align="center" width="80"><input style="width:200px;" type="text" id="prod_price" class="change_prod" name="prod_price" value="'.$orders_detail['price'].'" /></td>
                    <td align="center" width="100"><span class="price">'.$orders_detail['price']*$orders_detail['count'].'</span></td>
                    <td align="center" width="100"><a href="javascript:void(0);" class="remove-link-admin">x</a></td>
                </tr>';
            }

            $str .='<tr>
                <td colspan="4"></td>
                <td align="center"><div class="space_5"></div><strong class="price">'.$total.'</strong><div class="space_5"></div></td>
            </tr>';

            echo $str;
            $mysql->query("update orders set total_price ='".$total."' where id = '".$order_id."'");
	}

    if ($_REQUEST['type'] == "get_cart_order") {

        if (count($_SESSION['cart']) > 0){
            $cart = $_SESSION['cart'];

            $str = "";
            $all_cumma = 0;
            $total_price_all = '';
            $total_price = '';
            $product_id = '';
            $product_name = '';
            $str_tr = '';

            foreach ($cart as $key => &$item) {
                $product = $mysql->query("select * from products where id = '".$item['product_id']."'");
                $product = $product[0];

                if($_SESSION['user']['inn']==''){
                    if($product['stock']>0 && $product['discount']==1){
                        $product_price = $product['stock'];
                    }else{
                        $product_price = $product['price'];
                    }
                }else{
                    $product_price = $product['price_opt'];
                }


              $total_price_all = $total_price_all + $product_price * $item['count'];
              $total_price = $product_price* $item['count'];
              $str_tr .= ' <tr>
                            <input class ="cart_product_id" type="hidden" value="'.$product['id'].'">
                            <td data-title=" ">
                                <a class="cart-entry-thumbnail" href="'.$main['url'].'/product/'.$product['url'].'"><img src="'.$main['url'].'/view/images/products/'.$product['id'].'/'.$product['id'].'.jpg" alt="'.$product['name'].'" ></a>
                            </td>
                            <td data-title=" ">
                                <div class="h6"><span class="ht-2"><a href="'.$main['url'].'/product/'.$product['url'].'">'.$product['name'].'</a></span><span>'.$product['description'].'</span></div>
                            </td>
                            <td data-title="Цена: "><span class="price_pr">'.number_format($product_price, 0, ',', ' ').'</span></td>
                            <td data-title="Кол-во: ">
                                <div class="quantity-select-cart">
                                    <span class="minus count_prod"></span>
                                    <span class="number amount">'.$item['count'].'</span>
                                    <span class="plus count_prod"></span>
                                </div>
                            </td>
                            <td data-title="Итого:"><span class="price">'.number_format($total_price, 0, ',', ' ').'</span></td>
                            <td data-title="">
                                <a href="javascript:void(0);" class="remove-item remove-link" title="удалить из корзины"><div class="button-close"></div></a>
                            </td>
                        </tr>';
            }
            $str .= '   <div class="table-responsive">
                            <table class="cart-table">
                                <thead>
                                    <tr>
                                        <th style="width: 95px;"></th>
                                        <th>Название</th>
                                        <th style="width: 150px;">Цена</th>
                                        <th style="width: 260px;">Количество</th>
                                        <th style="width: 150px;">Итого</th>
                                        <th style="width: 70px;"></th>
                                    </tr>
                                </thead>
                                <tbody>'.$str_tr.'
                                </tbody>
                            </table>
                        </div>
                        <div class="empty-space col-xs-b35 col-md-b70"></div>
                        <div class="row">
                            <div class="col-md-6">
                                <h4 class="h4 col-xs-b25">Итого по заказу</h4>
                                <div class="order-details-entry dark">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            Итого
                                        </div>
                                        <div class="col-xs-6 col-xs-text-right">
                                            <b class="price_pr">'.number_format($total_price_all, 0, ',', ' ').'</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>';
            echo $str;
        }
        else{
            echo '<script>window.location = "'.$main['url'].'";</script>';
        }
	}
    if ($_REQUEST['type'] == "get_summa_cart") {
        $all_summa = 0;
        if (count($_SESSION['cart']) > 0){
            $cart = $_SESSION['cart'];
            foreach ($cart as $key => &$value) {
                $product_variant = $mysql->query("select * from products_variants where id = '".$value['variant']."'");
                $product_variant = $product_variant[0];
                if($product_variant['discount']>0){
                    $product_price = $product_variant['discount'];
                }else{
                    $product_price = $product_variant['price'];
                }
                $summa = $product_price * $value['count'];
                $all_summa += $summa;
            }
        }
        if ($all_summa > 0){
            echo $all_summa;
        }
        else{
            echo 0;
        }
	}

    if ($_REQUEST['type'] == "add_to_basket") {
        $pos = recursive_array_search($_POST['product_id'], $_SESSION['cart']);
        if ($pos>-1){
            $_SESSION['cart'][$pos]['count'] = $_SESSION['cart'][$pos]['count']+$_POST['count'];
        }
        else{
            $cart = array("product_id"=>$_POST['product_id'], 'count' => $_POST['count']);
            $_SESSION['cart'][] = $cart;
        }
	}

    if ($_REQUEST['type'] == "change_count_cart") {
        $pos = recursive_array_search($_POST['product'], $_SESSION['cart']);
        if ($pos>-1){
            $_SESSION['cart'][$pos]['count'] = $_POST['count'];
        }
	}

    if ($_REQUEST['type'] == "delete_product") {
        $pos = recursive_array_search($_POST['product_id'], $_SESSION['cart']);
        $return ="ok";
        if($pos>-1){
            $return = $_SESSION['cart'][$pos]['product_id'];
            unset($_SESSION['cart'][$pos]);

            $_SESSION['cart']=array_values($_SESSION['cart']);
        }else{
            $return = "error";
        }
        if(count($_SESSION['cart'])==0){
            $return = "empty_cart";
        }
        echo $return;
    }

    if ($_REQUEST['type'] == "update_amount") {
        if (recursive_array_search($_POST['product'], $_SESSION['cart']) !== false){
            foreach ($_SESSION['cart'] as $key => &$value) {
                if ($value['product_id'] == $_POST['product']){
                    $_SESSION['cart'][$key]['amount'] = $_POST['amount'];
                }
            }
        }
	}




    if ($_REQUEST['type'] == "print_orders") {
        $str = "";
        $str .= "<html>
                <head>
                <meta http-equiv='content-type' content='text/html;charset=utf-8' charset='utf-8' />
                <title>Печать заказов</title>
                </head>
                <body style='font-size:13px'>
                <table style='font-size:13px' width='100%' border='1' cellpadding='5' cellspacing='0'>";
        $orders = $mysql->query("select * from orders where status <> 2 order by id desc");
        $orders_detail = $mysql->query("select *, (select name from products where products.id = orders_detail.product_id) as product_name from orders_detail");
        for($i=0;count($orders)>$i;$i++){
            $str .= "<tr>
                        <td align='center' width='80'>".date("d-m-Y", strtotime($orders[$i]['date']))."</td>
                        <td width='100'>".$orders[$i]['name']."</td>
                        <td align='center' width='80'>".$orders[$i]['phone']."</td>
                        <td width='150'>".$orders[$i]['address']."</td>
                        <td>";

                        for($n=0;count($orders_detail)>$n;$n++){
                            if ($orders_detail[$n]['order_id'] == $orders[$i]['id']){
                                $str .= $orders_detail[$n]['product_name']." x ".$orders_detail[$n]['amount']." шт.<br/>";
                            }
                        }

                        $str .= "</td>
                        <td align='center' width='80'>".number_format($orders[$i]['total_price'],0,","," ")." руб.</td>
                        <td>".$orders[$i]['comment']."</td>
                    </tr>";
        }
        $str .= "</table></body></html>";
        echo $str;
    }

    if ($_REQUEST['type'] == "get_related_products") {
        $result = $mysql->query("select * from related_products where product_id = '".$_POST['product']."'");

        $str = "<table border='0' cellpadding='0' cellspacing='0' class='table_padding_10'>";

        if (empty($result)){
            $str = $str."<tr>
                        <td width='500'>
                            <input type='hidden' id='' name='' value='' />
                            <input type='text' id='' name='' value='' style='width:500px' />
                        </td>
                        <td width='10'>&nbsp;</td>
                        <td>
                            <input type='button' name='' id='' onclick='add_related_products()' value='+' />
                        </td>
                    </tr>";
        }


        $str = $str."</table>";
        echo $str;
    }

    if ($_REQUEST['type'] == "get_parse_status") {
        $file = fopen($main['home_path']."/view/images/logs/parser.txt","r");
        $buffer = "";
        if ($file) {
            while (($str = fgets($file, 4096)) !== false) {
                $buffer = $buffer.$str;
            }
            fclose($file);
        }
        $buffer = str_replace("\n","<br />",$buffer);
        echo $buffer;
    }

    if ($_REQUEST['type'] == "update_product") {
        if ($_POST['product'] > 0){
            $price_field = $cls_modules->purifier($_POST['price_field'],4);
            $price = intval($_POST['price']);
            $mysql->query("update products set `$price_field` = '$price' where id = '".intval($_POST['product'])."'");
        }
    }

    if ($_REQUEST['type'] == "get_main_image_block") {
        $img = $mysql->query("select filename from files where product_id = '".$_POST['product']."' and type = 1 limit 0,1");
        $str = "";
        if (!empty($img)){
            $str .= "<div class='file_upload_view_block'>
                        <div class='file_upload_view_block_item'>
                            <img src='".$main['img_dir']."/products/".$_POST['product']."/$img?thumb=1&cache=".rand(00000,99999)."' />
                            <div class='file_upload_view_block_item_delete'><a href='javascript:void(0)' onclick='delete_main_image()'><i class='fa fa-times'></i> удалить</a></div>
                        </div>
                    </div>";
        }
        echo $str;
    }

    if ($_REQUEST['type'] == "delete_main_image") {
        $img = $mysql->query("select filename from files where product_id = '".$_POST['product']."' and type = 1 limit 0,1");
        $upload_dir = $_SERVER["DOCUMENT_ROOT"]."/view/images/products/".$_POST['product'];
        @unlink($upload_dir."/".$img);
        $mysql->query("delete from files where product_id = '".$_POST['product']."' and type = 1");
    }

    if ($_REQUEST['type'] == "get_other_image_block") {
        $files = $mysql->query("select * from files where product_id = '".$_POST['product']."' and (type = 2 or type = 3)");
        $str = "";

        if (!empty($files)){
            $str .= "<div class='file_upload_view_block'>";
            for($i=0;count($files)>$i;$i++){
                $str .= "<div class='file_upload_view_block_item'>";

                $fileinfo = pathinfo($files[$i]['filename']);
                $ext = $fileinfo['extension'];
                if($ext=='pdf'){
                   $str .= "<img src='".$main['img_dir']."/content/pdf.svg' /><div class='decription_file'>".$files[$i]['name']."</div>";
                }elseif($ext=='doc' ||$ext=='docx'){
                    $str .= "<img src='".$main['img_dir']."/content/doc.svg' /><div class='decription_file'>".$files[$i]['name']."</div>";
                }elseif($ext=='xls' ||$ext=='xlsx'){
                    $str .= "<img src='".$main['img_dir']."/content/xls.svg' /><div class='decription_file'>".$files[$i]['name']."</div>";
                }else{
                    $str .= "<img src='".$main['img_dir']."/products/".$_POST['product']."/".$files[$i]['filename']."?thumb=1&cache=".rand(00000,99999)."'/><div class='decription_file'>".$files[$i]['name']."</div>";
                }

                $str .= "<div class='file_upload_view_block_item_delete'><a href='javascript:void(0)' onclick='delete_other_image(".$files[$i]['id'].")'><i class='fa fa-times'></i> удалить</a></div>
                         </div>";
            }
            $str .= "</div>";
        }
        echo $str;
    }

    if ($_REQUEST['type'] == "get_other_rewards_img_block") {
        $img = $mysql->query("select id, filename from rewards");
        $str = "";
        if (!empty($img)){
            $str .= "<div class='file_upload_rewards_img_block'>";
            for($i=0;count($img)>$i;$i++){
                $str .= "<div class='file_upload_rewards_img_block_item'>
                            <img src='".$main['img_dir']."/rewards/".$img[$i]['filename']."?thumb=1' />
                            <div class='file_upload_rewards_img_block_item_delete'><a href='javascript:void(0)' onclick='delete_other_rewards_img(".$img[$i]['id'].")'><i class='fa fa-times'></i> удалить</a></div>
                         </div>";
            }
            $str .= "</div>";
        }
        echo $str;
    }

    if ($_REQUEST['type'] == "delete_other_rewards") {
        $img_id = $_POST['img_id'];
        $img = $mysql->query("select filename from rewards where id = '$img_id' limit 0,1");
        $upload_dir = $_SERVER["DOCUMENT_ROOT"]."/view/images/rewards/";
        if($img !=''){
            @unlink($upload_dir."/".$img);
            $mysql->query("delete from rewards where id = '$img_id'",1);
        }

    }

    if ($_REQUEST['type'] == "delete_other_image") {
        $img_id = $_POST['img_id'];
        $img = $mysql->query("select filename from files where product_id = '".$_POST['product']."' and id = '$img_id' limit 0,1",1);
        $upload_dir = $_SERVER["DOCUMENT_ROOT"]."/view/images/products/".$_POST['product'];
        @unlink($upload_dir."/".$img);
        $mysql->query("delete from files where product_id = '".$_POST['product']."' and id = '$img_id'",1);
    }

}

if (isset($_REQUEST['upload_type'])) {

    if ($_GET['upload_type'] == "upload_product_main_image") {
        $id = $_POST['id'];
        if ($id > 0){
            if (isset($_FILES['files'])) {
                if ($_FILES['files']['name'] != ""){
                    $upload_dir = $_SERVER["DOCUMENT_ROOT"]."/view/images/products/$id";

                    $img = $mysql->query("select filename from files where product_id = '$id' and type = 1 limit 0,1");
                    if (!empty($img)){
                        @unlink($upload_dir."/".$img);
                        $mysql->query("delete from files where product_id = '$id' and type = 1");
                    }

                    if (!is_dir($upload_dir)) {
                        mkdir($upload_dir, 0777);
                        chmod($upload_dir, 0777);
                    }

                    $uploaded_file = $id.".jpg";

                    $img = WideImage::load("files");
                    $img->resize($main['product_main']['width'], $main['product_main']['height'], 'inside', 'any')->saveToFile($upload_dir."/".$uploaded_file, 90);

                    if ($mysql->query("select id from files where product_id = '$id' and type = 1 limit 0,1")){
                        $mysql->query("update files set filename = '$uploaded_file' where product_id = '$id' and type = 1");
                    }
                    else{
                        $mysql->query("INSERT INTO files (name, product_id, filename, type ) VALUES ('$id', '$id', '$uploaded_file', '1')");
                    }

                    echo 1;
                }
            }
        }
    }

    if ($_GET['upload_type'] == "upload_product_other_image") {
        $id = $_POST['id'];
        if ($id > 0){
            if (isset($_FILES['files'])) {
                if ($_FILES['files']['name'] != ""){
                    $upload_dir = $_SERVER["DOCUMENT_ROOT"]."/view/images/products/$id";
                    if (!is_dir($upload_dir)) {
                        mkdir($upload_dir, 0777);
                        chmod($upload_dir, 0777);
                    }
                    $fileinfo = pathinfo($_FILES['files']['name']);
                    $ext = $fileinfo['extension'];
                    $name_tran = $cls_modules->translit(reset(explode(".",$_FILES['files']['name'])));
                    $name = reset(explode(".",$_FILES['files']['name']));
                    if($ext=='pdf' || $ext=='doc' || $ext=='docx' || $ext=='xlsx' || $ext=='xls' ){
                        $uploaded_file = $name_tran.'.'.$ext;
                        move_uploaded_file($_FILES['files']['tmp_name'], $upload_dir."/".$uploaded_file);
                        $type = 3;
                    }else{
                        $img = WideImage::load("files");
                        $uploaded_file = $name_tran.".jpg";
                        $img->resize($main['product_main']['width'], $main['product_main']['height'], 'inside', 'any')->saveToFile($upload_dir."/".$uploaded_file, 90);
                        $type = 2;
                    }
                    $mysql->query("INSERT INTO files (name, product_id, filename, type ) VALUES ('$name', '$id', '$uploaded_file', '$type')");

                    echo 1;
                }
            }
        }
    }
   if ($_GET['upload_type'] == "upload_product_other_rewards_img") {
        if (isset($_FILES['files'])) {
            if ($_FILES['files']['name'] != ""){
                $upload_dir = $_SERVER["DOCUMENT_ROOT"]."/view/images/rewards/";
                if (!is_dir($upload_dir)) {
                    mkdir($upload_dir, 0777);
                    chmod($upload_dir, 0777);
                }

                $name = reset(explode(".", $_FILES['files']['name']));
                $uploaded_file = $name.".jpg";

                $img = WideImage::load("files");
                $img->saveToFile($upload_dir."/".$uploaded_file, 90);

                $mysql->query("INSERT INTO rewards (name, filename ) VALUES ('$name', '$uploaded_file')");

                echo 1;
            }
        }
    }

}

?>