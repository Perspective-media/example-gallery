<?php

$postData = $_POST;
	//create galleries for each results
function getfilelist($FolderPath,$key){
	global $c;
	$filesList=array();

	// $files1 = scandir($FolderPath);
	// print_r($files1);

	if (file_exists($FolderPath)) {
		$ignore = array('.','..','cgi-bin','.DS_Store','.recycle','_gsdata_');
		$NotIgnore = array('jpg','JPG','jpeg','JPEG');
		$files = scandir($FolderPath);
		$x=0;
		foreach($files as $fileName) {
			$x==0 ?  $c['examples'][$key]['CoverImgUrl'] = $fileName : false;
			$fileName = iconv(mb_detect_encoding($fileName, mb_detect_order(), true), "UTF-8",$fileName);
			if(in_array($fileName, $ignore)) continue;
			$ext = pathinfo($FolderPath.'/'.$fileName); 
			$ext = $ext['extension'];
			if(in_array($ext, $NotIgnore)){
				$filesList[]= $fileName;
			}
			$x++;
		}
	}
	return json_encode($filesList);
}

echo getfilelist($postData['path'].$postData['number'],$postData['number']);

?>