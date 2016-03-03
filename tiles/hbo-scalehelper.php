<?php 
echo "scalehelper v0.1 Max Bandle\n";
$is = scandir('.');

foreach($is as $i) {
	if(substr($i, -3) != 'png') {
		continue;
	}
	$s = getimagesize($i);
	if($s[0] != 256 || $s[1] != 256) {
		echo $i."\n";
		$im = @imagecreatetruecolor(256, 256);
		imagesavealpha($im, true);
		imagealphablending($im, false);
		$blank = imagecolorallocatealpha($im, 255, 255, 255, 127);
		imagefill($im, 0, 0, $blank);
		# do whatever you want with transparent image
		$old = imagecreatefrompng($i);
		imagecopy($im, $old, 0, 0, 0, 0, $s[0], $s[1]);
		imagepng($im, $i);
	}
}

?>